const Effect = require('./effect.js');
const Utils = require('./utils.js');

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.speed = options.speed;
    this.game = options.game;
    this.isWrappable = true;
    this.minPos = [0 + this.radius, 0 + this.radius];
    this.maxPos = [this.game.DIM_X - this.radius,
                   this.game.DIM_Y - this.radius];
  }

  move() {
    this.pos = Utils.sumVectors([this.pos, this.vel]);
    const wallCollision = this.isOutOfBounds();
    
    if (wallCollision) {
      if (this.isWrappable) {
        this.bounce(wallCollision);
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

  isOutOfBounds() {
    let x = this.pos[0];
    let y = this.pos[1];

    if (x < this.minPos[0]) return 'left';
    if (x > this.maxPos[0]) return 'right';
    if (y < this.minPos[1]) return 'top';
    if (y > this.maxPos[1]) return 'bottom';

    return false;
  }

  appear() {
    let pos = this.pos.map(x => x - this.radius * 2);

    let appearance = new Effect({
                                  pos: pos,
                                  width: 192,
                                  height: 192,
                                  resultSide: this.radius * 4,
                                  game: this.game,
                                  totalFrames: 20,
                                  name: 'appearance'
                                });
    this.game.add(appearance);
  }

  explode() {
    if (!this.game.audio.explosion.muted) this.game.audio.explosion.cloneNode().play();
    let pos = this.pos.map(x => x - this.radius * 1.5);

    let explosion = new Effect({
                                pos: pos,
                                width: 88,
                                height: 88,
                                resultSide: this.radius * 3,
                                game: this.game,
                                totalFrames: 64,
                                name: 'explosion'
                              });
    this.game.add(explosion);
  }

  smallExplosion(pos) {
    let smallExplosion = new Effect({
                                     pos: pos,
                                     width: 128,
                                     height: 128,
                                     resultSide: 50, // on screen
                                     game: this.game,
                                     totalFrames: 16,
                                     name: 'smallExplosion'
                                   });
    this.game.add(smallExplosion);
  }
}

module.exports = MovingObject;
