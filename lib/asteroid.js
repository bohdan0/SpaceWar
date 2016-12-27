const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');

const DEFAULTS = {
  color: 'grey',
  radius: 20,
  speed: 5
};

class Asteroid extends MovingObject {
  constructor(options = {}) {
    options.pos = options.pos || options.game.randomPosition();
    options.vel = options.vel || Utils.randomVector(DEFAULTS.speed);
    options.radius = options.radius || DEFAULTS.radius;
    options.color = options.color || DEFAULTS.color;

    super(options);
  }

  collideWith(other) {
    if (other instanceof Ship) {
      other.relocate();
      return true;
    } else if (other instanceof Bullet && other.shootedBy === Ship) {
      other.remove();
      this.remove();
      return true;
    }
  }

  fireBullet() {
    const bullet = new Bullet({
                               game: this.game,
                               vel: [0, 1],
                               pos: this.pos,
                               shootedBy: Asteroid
                             });
    this.game.add(bullet);
  }
}

module.exports = Asteroid;
