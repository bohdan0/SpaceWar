const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');

const DEFAULTS = {
  color: 'grey',
  radius: 20,
  speed: 5
};

class Asteroid extends MovingObject {
  constructor(options = {}) {
    options.pos = options.pos; // or random position
    options.vel = options.vel ||
                  Utils.randomVector(DEFAULTS.speed);
    options.radius = options.radius || DEFAULTS.radius;
    options.color = options.color || DEFAULTS.color;

    super(options);
  }
}

module.exports = Asteroid;
