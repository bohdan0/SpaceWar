const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Ship = require('./ship.js');
const Utils = require('./utils.js');

class Game {
  constructor() {
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

  moveObjects() {
    this.asteroids.forEach(asteroid => {
      asteroid.move();
    });
  }

  checkCollisions() {
    this.asteroids.forEach(asteroid1 => {
      this.asteroids.forEach(asteroid2 => {
        if (asteroid1 !== asteroid2 &&
            asteroid1.isCollidedWith(asteroid2)) {
          asteroid1.collideWith(asteroid2);
        }
      });
    });
  }

  draw(ctx) {
    let radius = this.asteroids[0].radius;
    ctx.clearRect(0, 0, Game.DIM_X + radius, Game.DIM_Y + radius);
    ctx.fillStyle = 'blue';
    ctx.clearRect(0, 0, Game.DIM_X + radius, Game.DIM_Y + radius);

    this.asteroids.forEach(asteroid => {
      asteroid.draw(ctx);
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
Game.NUM_ASTEROIDS = 10;
Game.BACKGROUND = "#AA0000";

module.exports = Game;
