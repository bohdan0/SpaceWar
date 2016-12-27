const Utils = require('./utils.js');
const Asteroid = require('./asteroid.js');

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.isWrappable = true;
  }

  move(delta) {
    let velocityScale = delta / (1000 / 60); // 60 times per second
    // this.vel = Utils.scale(this.vel, velocityScale);
    this.pos = Utils.sumVectors([this.pos, this.vel]);

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.bounce();
        // this.pos = this.game.wrap(this.pos);
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

  collideWith(other) {
    // is overriden in asteroid class
  }
}

module.exports = MovingObject;
