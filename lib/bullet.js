const MovingObject = require('./moving_object.js');
const Asteroid = require('./asteroid.js');

class Bullet extends MovingObject {
  constructor(options) {
    options.color = 'red';
    options.radius = 3;
    super(options);
    this.isWrappable = false;
  }
}

module.exports = Bullet;
