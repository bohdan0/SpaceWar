const MovingObject = require('./moving_object.js');
const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Game = require('./game.js');

const DEFAULTS = {
  pos: [600 / 2, 800 - 10],
  vel: [0, 0],
  radius: 10,
  color: 'red',
  speed: 5,
  fps: 60,
  fireRate: 16 // bullets per second
};

class Ship extends MovingObject {
  constructor(options = {}) {
    options.pos = options.pos || DEFAULTS.pos;
    options.vel = DEFAULTS.vel;
    options.radius = options.radius || DEFAULTS.radius;
    options.color = options.color || DEFAULTS.color;

    super(options);
    this.speed = DEFAULTS.speed;
    this.frames = 0; // to handle shooting
    this.minPos = [0 + this.radius * 2, 400 + this.radius * 2];
    this.maxPos = [this.game.DIM_X - this.radius * 2,
                   this.game.DIM_Y - this.radius * 2];
  }

  move() {
    super.move();
    // this.bounce(); // helps with ship wrapping on corners
  }

  handleMoves(pressedKeys) {
    let dirs = [];
    let newVel = this.vel;

    pressedKeys.forEach(key => {
      if (Ship.MOVES[key]) {
        dirs.push(Ship.MOVES[key]);
      } else if (key === 32) { // spacebar
        if (this.frames > DEFAULTS.fps / DEFAULTS.fireRate) {
          this.fireBullet();
          this.frames = 0;
        } else {
          this.frames += 1;
        }
      }
    });

    newVel = Utils.sumVectors(dirs);
    this.vel = Utils.scale(newVel, this.speed);
  }

  bounce() {
    this.vel = [0, 0];
    if (this.pos[0] < this.minPos[0]) { // left wall
      this.pos[0] = this.minPos[0];
    } else if (this.pos[1] < this.minPos[1]) { // middle of screen
      this.pos[1] = this.minPos[1];
    } else if (this.pos[0] > this.maxPos[0]) { // right wall
      this.pos[0] = this.maxPos[0];
    } else if (this.pos[1] > this.maxPos[1]) { // bottom wall
      this.pos[1] = this.maxPos[1];
    }
  }

  collideWith(other) {
    if (other instanceof Bullet && other.shootedBy.name === 'Asteroid') {
      other.remove();
      this.game.shipCrash(other.power);
      return true;
    }
  }

  fireBullet() {
    let leftPos = Utils.sumVectors([this.pos, [-this.radius, 0]]);
    let rightPos = Utils.sumVectors([this.pos, [this.radius, 0]]);

    [leftPos, rightPos].forEach(pos => {
      let bullet = new Bullet({
                                game: this.game,
                                vel: [0, -1],
                                pos: pos,
                                shootedBy: Ship,
                                power: 2
                              });
      this.game.add(bullet);
    });
  }
}

Ship.MOVES = {
  38: [0, -1], // up
  87: [0, -1], // up
  39: [1, 0],  // right
  68: [1, 0],  // right
  40: [0, 1],  // down
  83: [0, 1],  // down
  37: [-1, 0], // left
  65: [-1, 0]  // left
};

module.exports = Ship;
