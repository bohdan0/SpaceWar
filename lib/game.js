const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');

class Game {
  constructor() {
    this.ship = new Ship({game: this});
    this.bullets = [];
    this.asteroids = [];
    this.lives = 5;
    this.score = 0;
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
    let y = Game.DIM_Y * Math.random() * 0.5;

    return [x, y];
  }

  step() {
    this.moveObjects();
    this.checkCollisions();
  }

  allObjects() {
    return [].concat(this.asteroids, this.bullets, [this.ship]);
  }

  moveObjects() {
    this.allObjects().forEach(obj => {
      obj.move();
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
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = 'yellow';
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(obj => {
      obj.draw(ctx);
    });
  }

  shipCrash() {
    this.lives -= 1;
    this.drawCrash();
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  drawCrash() {
    console.log('ship crashes');
  }

  gameOver() {
    this.asteroids = [];
    console.log('game over');
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

  increaseScore(rate) {
    this.score += rate;
    console.log(this.score);
  }
}

Game.DIM_X = 600;
Game.DIM_Y = 800;
Game.NUM_ASTEROIDS = 10;
Game.BACKGROUND = "#AA0000";

module.exports = Game;
