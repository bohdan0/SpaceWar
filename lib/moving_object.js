const Asteroid = require('./asteroid.js');
const Utils = require('./utils.js');

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.speed = options.speed;
    this.color = options.color;
    this.game = options.game;
    this.isWrappable = true;

    this.minPos = [0 + this.radius, 0 + this.radius];
    this.maxPos = [this.game.DIM_X - this.radius,
                   this.game.DIM_Y - this.radius];
  }

  move() {
    this.pos = Utils.sumVectors([this.pos, this.vel]);

    if (this.isOutOfBounds()) {
      if (this.isWrappable) {
        this.bounce();
      } else {
        this.remove();
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  }

  isCollidedWith(other) {
    let distanceBetweenCenters = Utils.distance(this.pos, other.pos);
    return distanceBetweenCenters < this.radius + other.radius;
  }

  remove() {
    this.game.remove(this);
  }

  collideWith() {
    // overriden in child classes
  }

  isOutOfBounds() {
    let x = this.pos[0];
    let y = this.pos[1];

    if (x < this.minPos[0] ||
        x > this.maxPos[0] ||
        y < this.minPos[1] ||
        y > this.maxPos[1]) {
      return true;
    }

    return false;
  }
}

module.exports = MovingObject;
