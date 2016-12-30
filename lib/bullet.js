const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');
const Asteroid = require('./asteroid.js');

const DEFAULTS = {
  color: 'red',
  radius: 15,
  speed: 8
};

class Bullet extends MovingObject {
  constructor(options) {
    options.color = DEFAULTS.color;
    options.radius = DEFAULTS.radius;
    options.speed = DEFAULTS.speed;

    super(options);
    this.vel = Utils.scale(this.vel, this.speed);
    this.shootedBy = options.shootedBy;
    this.power = options.power;
    this.isWrappable = false;
    this.currFrame = 0;
  }

  collideWith(other) {
    if (other instanceof Ship && this.shootedBy === Asteroid) {
      let pointOfCollission = Utils.sumVectors([this.pos,
                                               [- 50 / 2, - 50 / 6]]);

      other.smallExplosion(pointOfCollission);
      this.remove();
      this.game.shipCrash();
      return true;
    } else if ( other instanceof Asteroid && this.shootedBy === Ship) {
      let pointOfCollission = Utils.sumVectors([this.pos,
                                               [- 50 / 2, - 50 / 1.2]]);

      other.smallExplosion(pointOfCollission);
      this.remove();
      this.game.increaseScore(other.health);
      other.decreaseHealth(this.power);
      return true;
    }
  }

  draw(ctx, images) {
    if (this.shootedBy.name === 'Asteroid') {
      ctx.drawImage(
        images.enemyBullet,
        this.currFrame * 17.94,
        0,
        17.94,
        17.94,
        this.pos[0] - this.radius / 2,
        this.pos[1] - this.radius / 2,
        this.radius,
        this.radius
      );
      this.currFrame = ++this.currFrame % 18;
    } else {
      ctx.drawImage(
        images.playerBullet,
        this.pos[0] - this.radius / 6,
        this.pos[1] - this.radius * .75,
        this.radius / 3,
        this.radius * 1.5
      );
    }
  }
}

module.exports = Bullet;
