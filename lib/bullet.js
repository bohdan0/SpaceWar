const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');

class Bullet extends MovingObject {
  constructor(options) {
    options.color = 'red';
    options.radius = 3;
    super(options);
    this.speed = 6;
    this.vel = Utils.scale(this.vel, this.speed);
    this.shootedBy = options.shootedBy;
    this.isWrappable = false;
  }
}

module.exports = Bullet;
