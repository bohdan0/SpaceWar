const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');
const Star = require('./star.js');

class Game {
  constructor() {
    this.stars = [];
    this.bullets = [];
    this.asteroids = [];
    this.lives = 5;
    this.score = 0;
    this.DIM_X = 600;
    this.DIM_Y = 800;
    this.NUM_ASTEROIDS = 10;
    this.NUM_STARS = 100;
    this.BACKGROUND = "#AA0000";
    this.ship = new Ship({game: this});
    this.addAsteroids();
    this.addStars();
  }

  addAsteroids() {
    for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
      let asteroid = new Asteroid({
                                    game: this,
                                    pos: this.randomPosition(20)
                                  });
      this.add(asteroid);
    }
  }

  addStars() {
    for(let i = 0; i < this.NUM_STARS; i++) {
      let star = new Star({
                            game: this,
                            pos: this.randomPosition(2, true)
                          });
      this.add(star);
    }
  }

  randomPosition(radius, forStar) {
    let dimY = this.DIM_Y / 2;
    if (forStar) dimY = this.DIM_Y;

    let x = (this.DIM_X - radius * 2) * Math.random() + radius;
    let y = (dimY - radius * 2) * Math.random() + radius;

    return [x, y];
  }

  step() {
    this.moveObjects();
    this.checkCollisions();
  }

  allObjects() {
    return [].concat(
                      this.stars,
                      this.asteroids,
                      this.bullets,
                      [this.ship]
                    );
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
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);

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
    // console.log('ship crashes');
  }

  gameOver() {
    // this.asteroids = [];
    // console.log('game over');
  }

  add(obj) {
    if (obj instanceof Bullet) {
      this.bullets.push(obj);
    } else if (obj instanceof Asteroid) {
      this.asteroids.push(obj);
    } else if (obj instanceof Star) {
      this.stars.push(obj);
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

  increaseScore(rate) {
    this.score += rate;
  }
}

module.exports = Game;
