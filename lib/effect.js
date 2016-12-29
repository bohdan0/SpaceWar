const MovingObject = require('./moving_object.js');

class Effect extends MovingObject {
  constructor(options) {
    options.vel = [0, 0];

    super(options);

    this.name = options.name;
    this.width = options.width;
    this.height = options.height;
    this.resultSide = options.resultSide;
    this.totalFrames = options.totalFrames;
    this.currFrame = 0;
  }

  draw(ctx, images) {
    if (this.currFrame > this.totalFrames) return this.remove();

    let img;
    if (this.name === 'explosion') img = images.explosion;
    if (this.name === 'appearance') img = images.appearance;

    ctx.drawImage(
      img,
      this.currFrame * this.width,
      0,
      this.width,
      this.height,
      this.pos[0],
      this.pos[1],
      this.resultSide,
      this.resultSide
    );

    this.currFrame++;
  }
}

module.exports = Effect;
