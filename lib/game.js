const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');

class Game {
  constructor() {
    this.ship = new Ship({pos: this.randomPosition(), game: this});
    this.bullets = [];
    this.asteroids = [];
    this.addAsteroids();
  }

  addAsteroids() {
    for(let i = 0; i < Game.NUM_ASTEROIDS; i++) {
      let asteroid = new Asteroid({game: this});
      this.add(asteroid);
    }
  }

  randomPosition() {
    let x = Game.DIM_X * Math.random();
    let y = Game.DIM_Y * Math.random();

    return [x, y];
  }

  step(timeDelta) {
    this.moveObjects(timeDelta);
    this.checkCollisions();
  }

  allObjects() {
    return [].concat(this.asteroids, this.bullets, [this.ship]);
  }

  moveObjects(timeDelta) {
    this.allObjects().forEach(obj => {
      obj.move(timeDelta);
    });
  }

  checkCollisions() {
    this.allObjects().forEach(obj1 => {
      this.allObjects().forEach(obj2 => {
        if (obj1 !== obj2 && obj1.isCollidedWith(obj2)) {
          let collision = obj1.collideWith(obj2);
          if (collision) { return; }
        }
      });
    });
  }

  draw(ctx) {
    let extra = 20; // extra cleaning on border
    ctx.clearRect(0, 0, Game.DIM_X + extra, Game.DIM_Y + extra);
    ctx.fillStyle = 'yellow';
    ctx.clearRect(0, 0, Game.DIM_X + extra, Game.DIM_Y + extra);

    this.allObjects().forEach(obj => {
      obj.draw(ctx);
    });
  }

  wrap(pos) {
    return [Utils.wrap(pos[0], Game.DIM_X),
            Utils.wrap(pos[1], Game.DIM_Y)];
  }

  add(obj) {
    if (obj instanceof Bullet) {
      this.bullets.push(obj);
    } else if (obj instanceof Asteroid) {
      this.asteroids.push(obj);
    }
  }

  remove(obj) {
    if (obj instanceof Bullet) {
      let idx = this.bullets.indexOf(obj);
      this.bullets.splice(idx, 1);
    } else if (obj instanceof Asteroid) {
      let idx = this.asteroids.indexOf(obj);
      this.asteroids.splice(idx, 1);
    }
  }

  isOutOfBounds(pos) {
    let x = pos[0];
    let y = pos[1];

    if (x < 0 || x > Game.DIM_X || y < 0 || y > Game.DIM_Y) {
      return true;
    }

    return false;
  }
}

Game.DIM_X = 800;
Game.DIM_Y = 800;
Game.NUM_ASTEROIDS = 5;
Game.BACKGROUND = "#AA0000";

module.exports = Game;
