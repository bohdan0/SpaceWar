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
    if (other instanceof Ship && this.shootedBy === Asteroid && !other.protect) {
      this.game.shipCrash();
      other.respawn();
      this.remove();
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
    let img;
    let size;

    if (this.shootedBy.name === 'Asteroid') {
      img = images.enemyBullet;
      size = 17.94;
    } else {
      img = images.playerBullet;
      size = 192;
    }

      ctx.drawImage(
        img,
        this.currFrame * size,
        0,
        size,
        size,
        this.pos[0] - this.radius / 2,
        this.pos[1] - this.radius / 8,
        this.radius,
        this.radius
      );
      // playerBullet and enemyBullet have 18 frames
      this.currFrame = ++this.currFrame % 18;
  }
}

module.exports = Bullet;
