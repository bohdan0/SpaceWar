const MovingObject = require('./moving_object.js');
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
    }
  }
}

module.exports = Asteroid;
