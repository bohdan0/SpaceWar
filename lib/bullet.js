const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');

const DEFAULTS = {
  color: 'red',
  radius: 15,
  speed: 4
};

class Bullet extends MovingObject {
  constructor(options) {
    options.color = DEFAULTS.color;
    options.radius = DEFAULTS.radius;
    options.speed = DEFAULTS.speed;

    super(options);
    this.vel = Utils.scale(this.vel, this.speed);
    this.shootedBy = options.shootedBy;
    this.power = options.power;
    this.isWrappable = false;
    this.currFrame = 0;
  }

  draw(ctx, sprite) {
    if (this.shootedBy.name === 'Asteroid') {
      ctx.drawImage(
        sprite,
        this.currFrame * 17.94,
        222,
        17.94,
        17.94,
        this.pos[0] - this.radius / 2,
        this.pos[1] - this.radius / 2,
        this.radius,
        this.radius
      );
      this.currFrame = ++this.currFrame % 18;
    } else {
      ctx.drawImage(
        sprite,
        0,
        276,
        6,
        14,
        this.pos[0] - this.radius / 6,
        this.pos[1] - this.radius * .75,
        this.radius / 3,
        this.radius * 1.5
      );
    }
  }
}

module.exports = Bullet;
