const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');

const DEFAULTS = {
  color: 'red',
  radius: 3,
  speed: 6
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
  }
}

module.exports = Bullet;
