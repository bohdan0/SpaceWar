const Asteroid = require('./asteroid.js');
const Effect = require('./effect.js');
const Bullet = require('./bullet.js');
const Utils = require('./utils.js');
const Ship = require('./ship.js');
const Star = require('./star.js');

class Game {
  constructor(images, audio) {
    this.images = images;
    this.audio = audio;
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
    this.NUM_STARS = 300;

    this.addStars();
    this.renderingAsteroids = false;
    this.isOver = true;
    this.begin = true;
    
    audio.main.loop = true;
    audio.main.play('loop');
  }

  addAsteroids() {
    if (!this.isOver) {
      for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
        let asteroid = new Asteroid({
                                      game: this,
                                      health: this.level,
                                      vel: [0, 0]
                                    });
        this.add(asteroid);
      }
    }

    // hold enemies while appearance is drawing
    setTimeout(() => {
      this.asteroids.forEach(asteroid => {
        asteroid.vel = Utils.randomVector(3);
      });
    }, 500);
  }

  nextLevel() {
    if (this.asteroids.length === 0 &&
        !this.renderingAsteroids &&
        !this.isOver) {
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
    let result = [].concat(
                            this.stars,
                            this.asteroids,
                            this.bullets
                          );

    if (this.ship !== undefined) result.push(this.ship);

    return result;
  }

  moveObjects() {
    this.allObjects().forEach(obj => {
      obj.move();
    });
  }

  checkCollisions() {
    this.bullets.forEach(bullet => {
      this.asteroids.concat([this.ship]).forEach(obj => {
        if (bullet.isCollidedWith(obj)) {
          let collision = bullet.collideWith(obj);
          if (collision) return;
        }
      });
    });
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);

    if (this.isOver) {
      this.begin ? this.drawIntro(ctx) : this.drawGameOver(ctx);
    } else {
      this.drawScore(ctx);
      this.drawLevel(ctx);
      this.drawLives(ctx);
    }

    this.allObjects().concat(this.effects).forEach(obj => {
      obj.draw(ctx, this.images);
    });
  }

  drawIntro(ctx) {
    ctx.fillStyle = 'red';
    ctx.font = 'bold 64px Russo One';
    ctx.fillText(`SPACE WAR`, 110, 150);

    ctx.fillStyle = 'red';
    ctx.font = 'bold 48px Russo One';
    ctx.fillText(`HIT ENTER TO START`, 50, 400);

    ctx.drawImage(
      this.images.controls,
      20,
      550
    );

    ctx.fillStyle = 'yellow';
    ctx.font = 'bold 36px Russo One';
    ctx.fillText(`SHOOT`, 120, 670);

    ctx.fillStyle = 'yellow';
    ctx.font = 'bold 36px Russo One';
    ctx.fillText(`MOVE`, 455, 670);
  }

  drawGameOver(ctx) {
    ctx.fillStyle = 'red';
    ctx.font = 'bold 64px Russo One';
    ctx.fillText(`GAME OVER`, 105, 200);

    ctx.fillStyle = 'red';
    ctx.font = 'bold 48px Russo One';
    ctx.fillText(`YOUR SCORE`, 140, 300);


    let space = (600 - this.score.toString().length * 25 ) / 2;
    ctx.fillStyle = 'red';
    ctx.font = 'bold 48px Russo One';
    ctx.fillText(`${this.score}`, space, 350);

    ctx.fillStyle = 'red';
    ctx.font = 'bold 48px Russo One';
    ctx.fillText(`HIT ENTER TO RESTART`, 15, 600);
  }

  drawLevel(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Russo One';
    ctx.fillText(`LEVEL : ${this.level}`, 250, 30);
  }

  drawLives(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Russo One';
    ctx.fillText(`SCORE : ${this.score}`, 20, 30);
  }

  drawScore(ctx) {
    // ctx.fillStyle = 'white';
    // ctx.font = 'bold 24px Russo One';
    // ctx.fillText(`LIVES: ${this.lives}`, 480, 30);

    for(let i = 0; i < this.lives; i++) {
      ctx.drawImage(
        this.images.ship,
        560 - (i * 30),
        10,
        25,
        25
      );
    }
  }

  shipCrash() {
    this.ship.explode();
    this.lives -= 1;
    if (this.lives <= 0) this.gameOver();
  }

  gameOver() {
    this.isOver = true;
    this.ship.radius = 0;
    this.asteroids = [];
    this.bullets = [];
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

  restart(keys) {
    if (keys.includes(13)) { // enter
      this.ship = new Ship({game: this});
      this.begin = false;
      this.isOver = false;
      this.level = 0;
      this.score = 0;
      this.lives = 5;
      this.nextLevel();
    }
  }
}

module.exports = Game;
