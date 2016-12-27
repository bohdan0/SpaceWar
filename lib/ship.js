const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Game = require('./game.js');

const DEFAULTS = {
  pos: [600 / 2, 800],
  vel: [0, 0],
  radius: 10,
  color: 'red',
  speed: 5
};

class Ship extends MovingObject {
  constructor(options = {}) {
    options.pos = options.pos || DEFAULTS.pos;
    options.vel = DEFAULTS.vel;
    options.radius = options.radius || DEFAULTS.radius;
    options.color = options.color || DEFAULTS.color;

    super(options);
    this.speed = DEFAULTS.speed;
  }

  move(delta) {
    super.move(delta);
    this.bounce();
  }

  relocate() {
    this.pos = this.game.randomPosition();
    this.vel = DEFAULTS.vel;
  }

  handleMoves(pressedKeys) {
    let dirs = [];
    let newVel = this.vel;

    pressedKeys.forEach(key => {
      if (Ship.MOVES[key]) {
        dirs.push(Ship.MOVES[key]);
      }
    });

    newVel = Utils.sumVectors(dirs);
    this.vel = Utils.scale(newVel, this.speed);
  }

  bounce() {
    this.vel = [0, 0];
    if (this.pos[0] < this.radius) {
      this.pos[0] = this.radius;
    } else if (this.pos[1] < this.radius) {
      this.pos[1] = this.radius;
    } else if (this.pos[0] > 600 - this.radius) {
      this.pos[0] = 600 - this.radius;
    } else if (this.pos[1] > 800 - this.radius) {
      this.pos[1] = 800 - this.radius;
    }
  }

  fireBullet() {
    const bullet = new Bullet({
                               game: this.game,
                               vel: [0, -1],
                               pos: this.pos,
                               shootedBy: Ship
                             });
    this.game.add(bullet);
  }
}

Ship.MOVES = {
  38: [0, -1],
  87: [0, -1],
  39: [1, 0],
  68: [1, 0],
  40: [0, 1],
  83: [0, 1],
  37: [-1, 0],
  65: [-1, 0]
};

module.exports = Ship;
