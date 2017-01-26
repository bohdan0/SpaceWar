const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');
const Game = require('./game.js');

const DEFAULTS = {
  vel: [0, 0],
  radius: 40,
  speed: 5.5,
  fps: 60, 
  fireRate: 8 // bullets per second
};

class Ship extends MovingObject {
  constructor(options) {
    options.radius = DEFAULTS.radius;
    options.speed = DEFAULTS.speed;
    options.vel = DEFAULTS.vel;
    options.pos = [options.game.DIM_X / 2,
                   options.game.DIM_Y - DEFAULTS.radius];

    super(options);
    this.frames = 0; // to handle shooting
    this.minPos = [0 + this.radius, this.game.DIM_Y / 2 + this.radius];
    this.maxPos = [this.game.DIM_X - this.radius,
                   this.game.DIM_Y - this.radius];

    this.protect = false;
    this.appear();
  }

  move() {
    this.vel = Utils.scale(this.vel, this.speed);
    super.move();
    this.bounce(); // avoid wrapping on corners
  }

  handleMoves(pressedKeys) {
    let dirs = [];

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

    this.vel = Utils.sumVectors(dirs);
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

  fireBullet() {
    if (!this.game.audio.shot.muted) this.game.audio.shot.cloneNode().play();
    let leftPos = Utils.sumVectors([this.pos,
                                   [-this.radius / 4, -this.radius]]);
    let rightPos = Utils.sumVectors([this.pos,
                                    [this.radius / 4, -this.radius]]);

    [leftPos, rightPos].forEach(pos => {
      this.game.addBullet({
                           game: this.game,
                           vel: [0, -1],
                           pos: pos,
                           shootedBy: Ship,
                           power: 2
                         });
    });
  }

  setProtection() {
    this.protect = true;
    setInterval(() => {
      this.protect = false;
    }, 3000);
  }

  respawn() {
    this.setProtection();
    this.pos = [this.game.DIM_X / 2, this.game.DIM_Y - this.radius];
    this.appear();
  }

  draw(ctx, images) {
    if (this.protect) ctx.globalAlpha = .5;

    ctx.drawImage(
      images.ship,
      this.pos[0] - this.radius,
      this.pos[1] - this.radius,
      this.radius * 2,
      this.radius * 2
    );

    ctx.globalAlpha = 1;
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
