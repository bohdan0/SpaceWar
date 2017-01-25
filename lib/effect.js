class Effect {
  constructor(options) {
    this.vel = [0, 0];
    this.pos = options.pos;
    this.game = options.game;

    this.name = options.name;
    this.width = options.width;
    this.height = options.height;

    this.resultSide = options.resultSide;
    this.totalFrames = options.totalFrames;
    this.currFrame = 0;
  }

  draw(ctx, images) {
    if (this.currFrame > this.totalFrames) return this.game.remove(this);

    ctx.drawImage(
      images[this.name],
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
