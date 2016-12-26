const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');
const Bullet = require('./bullet.js');

const DEFAULTS = {
  pos: [0, 0],
  vel: [0, 0],
  radius: 10,
  color: 'red'
};

class Ship extends MovingObject {
  constructor(options = {}) {
    options.pos = options.pos || DEFAULTS.pos;
    options.vel = DEFAULTS.vel;
    options.radius = options.radius || DEFAULTS.radius;
    options.color = options.color || DEFAULTS.color;

    super(options);
  }

  relocate() {
    this.pos = this.game.randomPosition();
    this.vel = DEFAULTS.vel;
  }

  power(impulse) {
    let newX = this.vel[0] + impulse[0];
    let newY = this.vel[1] + impulse[1];

    this.vel = [newX, newY];
  }

  fireBullet() {
    const bullet = new Bullet({
                               game: this.game,
                               vel: this.vel,
                               pos: this.pos
                             });
    this.game.add(bullet);
  }
}

module.exports = Ship;
