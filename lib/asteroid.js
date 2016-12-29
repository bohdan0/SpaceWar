const MovingObject = require('./moving_object.js');
const Explosion = require('./explosion.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');

const DEFAULTS = {
  color: 'grey',
  radius: 40,
  health: 5,
  speed: 3
};

class Asteroid extends MovingObject {
  constructor(options) {
    options.vel = Utils.randomVector(DEFAULTS.speed);
    options.radius = DEFAULTS.radius;
    options.pos = options.game.randomPosition(options.radius);
    options.color = DEFAULTS.color;

    super(options);
    this.health = options.health;
    this.minPos = [0 + this.radius, 0 + this.radius];
    this.maxPos = [this.game.DIM_X - this.radius,
                   this.game.DIM_Y / 2 - this.radius];
  }

  bounce() {
    this.vel = Utils.scale(this.vel, -1);
  }

  decreaseHealth(points) {
    this.health -= points;
    if (this.health <= 0) {
      this.explode();
      this.remove();
    }
  }

  explode() {
    let pos = this.pos.map(x => x - this.radius);

    let explosion = new Explosion({
                                    pos: pos,
                                    side: 88,
                                    game: this.game,
                                    totalFrames: 64
                                  });
    this.game.add(explosion);
  }

  collideWith(other) {
    if (other instanceof Bullet && other.shootedBy === Ship) {
      other.remove();
      this.game.increaseScore(this.health);
      this.decreaseHealth(other.power);
      return true;
    }
  }

  approxShipPos(scale) {
    return this.game.ship.pos.map(pos => {
      let deg = 2 * Math.PI * Math.random();
      let correct = Math.sin(deg);

      return pos + this.game.ship.radius * correct * scale;
    });
  }

  fireBullet() {
    let shipApproxPos = this.approxShipPos(5);
    let vel = Utils.vectorBetween(this.pos, shipApproxPos);

    const bullet = new Bullet({
                               game: this.game,
                               vel: vel,
                               pos: this.pos,
                               shootedBy: Asteroid,
                               power: 1
                             });
    this.game.add(bullet);
  }

  draw(ctx, images) {
    let level = this.game.level % 11;
    if (level === 0) level++;

    ctx.drawImage(
      images.levels[level],
      this.pos[0] - this.radius,
      this.pos[1] - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}

module.exports = Asteroid;
