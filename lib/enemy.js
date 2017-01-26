const MovingObject = require('./moving_object.js');
const Utils = require('./utils.js');

const DEFAULTS = {
  radius: 40,
  health: 5,
  speed: 3
};

class Enemy extends MovingObject {
  constructor(options) {
    options.radius = DEFAULTS.radius;
    options.pos = options.game.randomPosition(options.radius);
    options.speed = DEFAULTS.speed;

    super(options);
    this.health = options.health;
    this.minPos = [0 + this.radius, 0 + this.radius];
    this.maxPos = [this.game.DIM_X - this.radius,
                   this.game.DIM_Y / 2 - this.radius];
    this.appear();
  }

  bounce(collidedWall) {
    switch(collidedWall) {
      case 'top':
      case 'bottom':
        this.vel = [this.vel[0], -this.vel[1]];
        break;
      case 'right':
      case 'left':
        this.vel = [-this.vel[0], this.vel[1]];
        break;
    }
  }

  decreaseHealth(points) {
    this.health -= points;
    if (this.health <= 0) {
      this.explode();
      this.remove();
    }
  }

  approxShipPos(scale) {
    return this.game.ship.pos.map(pos => {
      let deg = 2 * Math.PI * Math.random();
      let correct = Math.sin(deg);

      return pos + this.game.ship.radius * correct * scale;
    });
  }

  fireBullet() {
    let shipApproxPos = this.approxShipPos(3);
    let vel = Utils.vectorBetween(this.pos, shipApproxPos);

    this.game.addBullet({
                         game: this.game,
                         vel: vel,
                         pos: this.pos,
                         shootedBy: Enemy,
                         power: 1
                       });
  }

  draw(ctx, images) {
    let level = this.game.level % 11;
    if (level === 0) level++;

    ctx.drawImage(
      images.levels[level],
      this.pos[0] - this.radius,
      this.pos[1] - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}

module.exports = Enemy;
