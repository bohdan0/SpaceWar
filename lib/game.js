const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Ship = require('./ship.js');

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

  }

  moveObjects() {
    this.asteroids.forEach(asteroid => {
      asteroid.move();
    });
  }

  checkCollisions() {

  }

  draw(ctx) {
    ctx.clearRact(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle(Game.BACKGROUND);
    ctx.clearRact(0, 0, Game.DIM_X, Game.DIM_Y);

    this.asteroids.forEach(asteroid => {
      asteroid.draw(ctx);
    });
  }
}

Game.DIM_X = 1000;
Game.DIM_Y = 1000;
Game.NUM_ASTEROIDS = 20;
Game.BACKGROUND = 'grey';

module.exports = Game;
