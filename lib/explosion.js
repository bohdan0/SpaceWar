const MovingObject = require('./moving_object.js');

class Explosion extends MovingObject {
  constructor(options) {
    options.vel = [0, 0];

    super(options);
    this.totalFrames = options.totalFrames;
    this.currFrame = 0;
    this.side = options.side;
  }

  draw(ctx, images) {
    if (this.currFrame > this.totalFrames) return this.remove();

    ctx.drawImage(
      images.explosion,
      this.currFrame * this.side,
      0,
      this.side,
      this.side,
      this.pos[0],
      this.pos[1],
      80,
      80
    );

    this.currFrame++;
  }
}

module.exports = Explosion;
