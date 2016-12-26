const Utils = require('./utils.js');

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
  }

  move() {
    let newX = this.pos[0] + this.vel[0];
    let newY = this.pos[1] + this.vel[1];

    this.pos = this.game.wrap([newX, newY]);
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

  collideWith(other) {

  }
}

module.exports = MovingObject;
