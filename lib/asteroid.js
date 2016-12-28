const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');

const DEFAULTS = {
  color: 'grey',
  radius: 20,
  speed: 3
};

class Asteroid extends MovingObject {
  constructor(options = {}) {
    options.pos = options.pos || options.game.randomPosition();
    options.vel = options.vel || Utils.randomVector(DEFAULTS.speed);
    options.radius = options.radius || DEFAULTS.radius;
    options.color = options.color || DEFAULTS.color;

    super(options);
    this.health = 5;
    this.minPos = [0 + this.radius, 0 + this.radius];
    this.maxPos = [600 - this.radius, 400 - this.radius];
  }

  bounce() {
    this.vel = Utils.scale(this.vel, -1);
    this.pos = Utils.sumVectors([this.pos, this.vel]);
  }

  decreaseHealth(points) {
    this.health -= points;
    if (this.health <= 0) {
      this.remove();
    }
  }

  collideWith(other) {
    if (other instanceof Ship) {
      this.remove();
      this.game.shipCrash();
      return true;
    } else if (other instanceof Bullet && other.shootedBy === Ship) {
      other.remove();
      this.game.increaseScore(this.health);
      this.decreaseHealth(other.power);
      return true;
    }
  }

  fireBullet() {
    const bullet = new Bullet({
                               game: this.game,
                               vel: [0, 1],
                               pos: this.pos,
                               shootedBy: Asteroid,
                               power: 1
                             });
    this.game.add(bullet);
  }
}

module.exports = Asteroid;
