const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Ship = require('./ship.js');
const Utils = require('./utils.js');

class Game {
  constructor() {
    this.ship = new Ship({pos: this.randomPosition(), game: this});
    this.asteroids = [];
    this.addAsteroids();
  }

  addAsteroids() {
    for(let i = 0; i < Game.NUM_ASTEROIDS; i++) {
      let asteroid = new Asteroid({game: this});
      this.asteroids.push(asteroid);
    }
  }

  randomPosition() {
    let x = Game.DIM_X * Math.random();
    let y = Game.DIM_Y * Math.random();

    return [x, y];
  }

  step() {
    this.moveObjects();
    this.checkCollisions();
  }

  allObjects() {
    return this.asteroids.concat([this.ship]);
  }

  moveObjects() {
    this.allObjects().forEach(asteroid => {
      asteroid.move();
    });
  }

  checkCollisions() {
    this.allObjects().forEach(obj1 => {
      this.allObjects().forEach(obj2 => {
        if (obj1 !== obj2 &&
            obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  }

  draw(ctx) {
    let radius = this.allObjects()[0].radius; // extra cleaning on border
    ctx.clearRect(0, 0, Game.DIM_X + radius, Game.DIM_Y + radius);
    ctx.fillStyle = 'blue';
    ctx.clearRect(0, 0, Game.DIM_X + radius, Game.DIM_Y + radius);

    this.allObjects().forEach(obj => {
      obj.draw(ctx);
    });
  }

  wrap(pos) {
    return [Utils.wrap(pos[0], Game.DIM_X),
            Utils.wrap(pos[1], Game.DIM_Y)];
  }

  remove(asteroid) {
    let idx = this.asteroids.indexOf(asteroid);
    this.asteroids.splice(idx, 1);
  }
}

Game.DIM_X = 800;
Game.DIM_Y = 800;
Game.NUM_ASTEROIDS = 5;
Game.BACKGROUND = "#AA0000";

module.exports = Game;
