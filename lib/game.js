const Asteroid = require('./asteroid.js');
const Effect = require('./effect.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');
const Star = require('./star.js');

class Game {
  constructor(images) {
    this.images = images;
    this.stars = [];
    this.bullets = [];
    this.asteroids = [];
    this.effects = [];

    this.lives = 5;
    this.level = 1;
    this.score = 0;

    this.DIM_X = 600;
    this.DIM_Y = 800;
    this.NUM_ASTEROIDS = 5;
    this.NUM_STARS = 100;

    this.ship = new Ship({game: this});
    this.addAsteroids();
    this.addStars();
    this.renderingAsteroids = false;
  }

  addAsteroids() {
    for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
      let asteroid = new Asteroid({
                                    game: this,
                                    health: this.level,
                                    vel: [0, 0]
                                  });
      this.add(asteroid);
    }

    // hold enemies while appearance is drawing
    setTimeout(() => {
      this.asteroids.forEach(asteroid => {
        asteroid.vel = Utils.randomVector(3);
      });
    }, 500);
  }

  nextLevel() {
    if (this.asteroids.length === 0 && this.renderingAsteroids === false) {
      this.renderingAsteroids = true;
      this.level++;

      setTimeout(() => {
        this.addAsteroids();
        this.renderingAsteroids = false;
      }, 2000);
    }
  }

  addBullet(options) {
    let bullet = new Bullet(options);
    this.add(bullet);
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
    this.nextLevel();
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
          if (collision) return;
        }
      });
    });
  }

  draw(ctx) {
    this.drawBackground(ctx);

    this.drawScore(ctx);
    this.drawLevel(ctx);
    this.drawLives(ctx);

    this.allObjects().concat(this.effects).forEach(obj => {
      obj.draw(ctx, this.images);
    });
  }

  drawBackground(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);
  }

  drawLevel(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`LEVEL: ${this.level}`, 250, 30);
  }

  drawLives(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`SCORE: ${this.score}`, 20, 30);
  }

  drawScore(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`LIVES: ${this.lives}`, 480, 30);
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
    } else if (obj instanceof Effect) {
      this.effects.push(obj);
    }
  }

  remove(obj) {
    if (obj instanceof Bullet) {
      let idx = this.bullets.indexOf(obj);
      this.bullets.splice(idx, 1);
    } else if (obj instanceof Asteroid) {
      let idx = this.asteroids.indexOf(obj);
      this.asteroids.splice(idx, 1);
    } else if (obj instanceof Effect) {
      let idx = this.effects.indexOf(obj);
      this.effects.splice(idx, 1);
    }
  }

  increaseScore(rate) {
    this.score += rate;
  }
}

module.exports = Game;
