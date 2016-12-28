const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');

class Star extends MovingObject {
  constructor(options) {
    options.radius = Math.random() + 1.1;
    options.speed = options.radius - .99;
    options.vel = Utils.scale([0, 1], options.speed);
    options.color = 'white';

    super(options);
  }

  bounce() {
    this.pos = [Utils.wrap(this.pos[0], this.minPos[0], this.maxPos[0]),
                Utils.wrap(this.pos[1], this.minPos[1], this.maxPos[1])];
  }
}

module.exports = Star;