/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	const Game = __webpack_require__(2);

	$(() => {
	  let ctx = $('#game-canvas')[0].getContext('2d');
	  let images = {};

	  let playerBullet = new Image();
	  playerBullet.src = 'assets/player_bullet.png';
	  images.playerBullet = playerBullet;

	  let enemyBullet = new Image();
	  enemyBullet.src = 'assets/enemy_bullet.png';
	  images.enemyBullet = enemyBullet;

	  let ship = new Image();
	  ship.src = 'assets/ship.png';
	  images.ship = ship;

	  let explosion = new Image();
	  explosion.src = 'assets/explosion.png';
	  images.explosion = explosion;

	  let smallExplosion = new Image();
	  smallExplosion.src = 'assets/smallExplosion.png';
	  images.smallExplosion = smallExplosion;

	  let appearance = new Image();
	  appearance.src = 'assets/appearance.png';
	  images.appearance = appearance;

	  images.levels = {};

	  for(let i = 1; i <= 10; i++) {
	    let level = new Image();
	    level.src = `assets/level${i}.png`;
	    images.levels[i] = level;
	  }

	  const game = new Game(images);
	  const view = new GameView(game, ctx);
	  window.stars = game.stars;
	  view.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.game = game;
	    this.ctx = ctx;
	  }

	  start() {
	    this.bindKeyHandlers();
	    requestAnimationFrame(this.animate.bind(this));

	    setInterval(() => {
	      this.game.asteroids.forEach(asteroid => {
	        asteroid.fireBullet();
	      });
	    }, 1000);
	  }

	  animate() {
	    this.game.step();
	    this.game.draw(this.ctx);
	    this.bindKeyHandlers();

	    requestAnimationFrame(this.animate.bind(this));
	  }

	  bindKeyHandlers() {
	    let pressedKeys = key.getPressedKeyCodes();

	    if (this.game.isOver) {
	      this.game.restart(pressedKeys);
	    } else {
	      if (this.game.ship) this.game.ship.handleMoves(pressedKeys);
	    }
	  }
	}

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Effect = __webpack_require__(10);
	const Bullet = __webpack_require__(6);
	const Utils = __webpack_require__(5);
	const Ship = __webpack_require__(7);
	const Star = __webpack_require__(8);

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

	    this.addStars();
	    this.renderingAsteroids = false;
	    this.isOver = true;
	    this.begin = true;
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
	    this.drawBackground(ctx);

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
	    ctx.fillStyle = 'blue';
	    ctx.font = 'bold 64px Arial';
	    ctx.fillText(`ASTEROIDS`, 115, 200);

	    ctx.fillStyle = 'white';
	    ctx.font = 'bold 64px Arial';
	    ctx.fillText(`GAME`, 205, 280);

	    ctx.fillStyle = 'red';
	    ctx.font = 'bold 48px Arial';
	    ctx.fillText(`HIT ENTER TO START`, 50, 450);

	    ctx.fillStyle = 'green';
	    ctx.font = 'bold 48px Arial';
	    ctx.fillText(`CONTROLS`, 165, 550);

	    ctx.fillStyle = 'green';
	    ctx.font = 'bold 36px Arial';
	    ctx.fillText(`SHOOT: SPACEBAR`, 130, 620);

	    ctx.fillStyle = 'green';
	    ctx.font = 'bold 36px Arial';
	    ctx.fillText(`MOVE: ARROWS OR W, A, S, D`, 35, 660);
	  }

	  drawGameOver(ctx) {
	    ctx.fillStyle = 'red';
	    ctx.font = 'bold 64px Arial';
	    ctx.fillText(`GAME OVER`, 105, 200);

	    ctx.fillStyle = 'red';
	    ctx.font = 'bold 48px Arial';
	    ctx.fillText(`YOUR SCORE`, 140, 300);


	    let space = (600 - this.score.toString().length * 25 ) / 2;
	    ctx.fillStyle = 'red';
	    ctx.font = 'bold 48px Arial';
	    ctx.fillText(`${this.score}`, space, 350);

	    ctx.fillStyle = 'red';
	    ctx.font = 'bold 48px Arial';
	    ctx.fillText(`HIT ENTER TO RESTART`, 15, 600);
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
	    if (this.lives <= 0) this.gameOver();
	  }

	  gameOver() {
	    this.isOver = true;
	    this.ship.explode();
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Utils = __webpack_require__(5);

	const DEFAULTS = {
	  color: 'grey',
	  radius: 40,
	  health: 5,
	  speed: 3
	};

	class Asteroid extends MovingObject {
	  constructor(options) {
	    options.radius = DEFAULTS.radius;
	    options.pos = options.game.randomPosition(options.radius);
	    options.color = DEFAULTS.color;

	    super(options);
	    this.health = options.health;
	    this.minPos = [0 + this.radius, 0 + this.radius];
	    this.maxPos = [this.game.DIM_X - this.radius,
	                   this.game.DIM_Y / 2 - this.radius];
	    this.appear();
	  }

	  bounce() {
	    this.vel = Utils.scale(this.vel, -1);
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
	    let shipApproxPos = this.approxShipPos(5);
	    let vel = Utils.vectorBetween(this.pos, shipApproxPos);

	    this.game.addBullet({
	                         game: this.game,
	                         vel: vel,
	                         pos: this.pos,
	                         shootedBy: Asteroid,
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

	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Effect = __webpack_require__(10);
	const Utils = __webpack_require__(5);

	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.speed = options.speed;
	    this.color = options.color;
	    this.game = options.game;
	    this.isWrappable = true;

	    this.minPos = [0 + this.radius, 0 + this.radius];
	    this.maxPos = [this.game.DIM_X - this.radius,
	                   this.game.DIM_Y - this.radius];
	  }

	  move() {
	    this.pos = Utils.sumVectors([this.pos, this.vel]);

	    if (this.isOutOfBounds()) {
	      if (this.isWrappable) {
	        this.bounce();
	      } else {
	        this.remove();
	      }
	    }
	  }

	  draw(ctx) {
	    ctx.fillStyle = this.color;
	    ctx.beginPath();

	    ctx.arc(
	      this.pos[0],
	      this.pos[1],
	      this.radius,
	      0,
	      2 * Math.PI,
	      false
	    );

	    ctx.fill();
	  }

	  isCollidedWith(other) {
	    let distanceBetweenCenters = Utils.distance(this.pos, other.pos);
	    return distanceBetweenCenters < this.radius + other.radius;
	  }

	  remove() {
	    this.game.remove(this);
	  }

	  collideWith() {
	    // overriden in child classes
	  }

	  isOutOfBounds() {
	    let x = this.pos[0];
	    let y = this.pos[1];

	    if (x < this.minPos[0] ||
	        x > this.maxPos[0] ||
	        y < this.minPos[1] ||
	        y > this.maxPos[1]) {
	      return true;
	    }

	    return false;
	  }

	  appear() {
	    let pos = this.pos.map(x => x - this.radius * 2);

	    let appearance = new Effect({
	                                  pos: pos,
	                                  width: 192,
	                                  height: 192,
	                                  resultSide: this.radius * 4,
	                                  game: this.game,
	                                  totalFrames: 20,
	                                  name: 'appearance'
	                                });
	    this.game.add(appearance);
	  }

	  explode() {
	    let pos = this.pos.map(x => x - this.radius * 1.5);

	    let explosion = new Effect({
	                                pos: pos,
	                                width: 88,
	                                height: 88,
	                                resultSide: this.radius * 3,
	                                game: this.game,
	                                totalFrames: 64,
	                                name: 'explosion'
	                              });
	    this.game.add(explosion);
	  }

	  smallExplosion(pos) {
	    let smallExplosion = new Effect({
	                                     pos: pos,
	                                     width: 128,
	                                     height: 128,
	                                     resultSide: 50, // on screen
	                                     game: this.game,
	                                     totalFrames: 16,
	                                     name: 'smallExplosion'
	                                   });
	    this.game.add(smallExplosion);
	  }


	}

	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const Utils = {
	  randomVector: (length) => {
	    let deg = 2 * Math.PI * Math.random();
	    return Utils.scale([Math.sin(deg), Math.cos(deg)], length);
	  },

	  scale: (vec, n) => [vec[0] * n, vec[1] * n],

	  distance: (pos1, pos2) => {
	    let squareX = Math.pow(pos2[0] - pos1[0], 2);
	    let squareY = Math.pow(pos2[1] - pos1[1], 2);

	    return Math.sqrt(squareX + squareY);
	  },

	  sumVectors: vectors => {
	    let result = [0, 0];
	    vectors.forEach(vector => {
	      result[0] += vector[0];
	      result[1] += vector[1];
	    });

	    return result;
	  },

	  vectorLength: vector => {
	    let x = Math.pow(vector[0], 2);
	    let y = Math.pow(vector[1], 2);

	    return Math.sqrt(x + y);
	  },

	  normalize: vector => {
	    let length = Utils.vectorLength(vector);
	    return vector.map(x => x / length);
	  },

	  vectorBetween: (v1, v2) => {
	    let result = [v2[0] - v1[0], v2[1] - v1[1]];
	    return Utils.normalize(result);
	  },

	  wrap: (pos, min, max) => {
	    if (pos < min) {
	      return max;
	    } else if (pos > max) {
	      return min;
	    } else {
	      return pos;
	    }
	  }
	};

	module.exports = Utils;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Utils = __webpack_require__(5);
	const Ship = __webpack_require__(7);
	const Asteroid = __webpack_require__(3);

	const DEFAULTS = {
	  color: 'red',
	  radius: 15,
	  speed: 8
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

	  collideWith(other) {
	    if (other instanceof Ship && this.shootedBy === Asteroid) {
	      let pointOfCollission = Utils.sumVectors([this.pos,
	                                               [- 50 / 2, - 50 / 6]]);

	      other.smallExplosion(pointOfCollission);
	      this.remove();
	      this.game.shipCrash();
	      return true;
	    } else if ( other instanceof Asteroid && this.shootedBy === Ship) {
	      let pointOfCollission = Utils.sumVectors([this.pos,
	                                               [- 50 / 2, - 50 / 1.2]]);

	      other.smallExplosion(pointOfCollission);
	      this.remove();
	      this.game.increaseScore(other.health);
	      other.decreaseHealth(this.power);
	      return true;
	    }
	  }

	  draw(ctx, images) {
	    if (this.shootedBy.name === 'Asteroid') {
	      ctx.drawImage(
	        images.enemyBullet,
	        this.currFrame * 17.94,
	        0,
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
	        images.playerBullet,
	        this.pos[0] - this.radius / 6,
	        this.pos[1] - this.radius * .75,
	        this.radius / 3,
	        this.radius * 1.5
	      );
	    }
	  }
	}

	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Utils = __webpack_require__(5);
	const Game = __webpack_require__(2);

	const DEFAULTS = {
	  vel: [0, 0],
	  radius: 40,
	  color: 'red',
	  speed: 5,
	  fps: 60,
	  fireRate: 8 // bullets per second
	};

	class Ship extends MovingObject {
	  constructor(options) {
	    options.radius = DEFAULTS.radius;
	    options.color = DEFAULTS.color;
	    options.speed = DEFAULTS.speed;
	    options.vel = DEFAULTS.vel;
	    options.pos = [options.game.DIM_X / 2,
	                   options.game.DIM_Y - DEFAULTS.radius];

	    super(options);
	    this.frames = 0; // to handle shooting
	    this.minPos = [0 + this.radius, this.game.DIM_Y / 2 + this.radius];
	    this.maxPos = [this.game.DIM_X - this.radius,
	                   this.game.DIM_Y - this.radius];
	    this.appear();
	  }

	  move() {
	    this.vel = Utils.scale(this.vel, this.speed);
	    super.move();
	    this.bounce(); // avoid wrapping on corners
	  }

	  handleMoves(pressedKeys) {
	    let dirs = [];

	    pressedKeys.forEach(key => {
	      if (Ship.MOVES[key]) {
	        dirs.push(Ship.MOVES[key]);
	      } else if (key === 32) { // spacebar
	        if (this.frames > DEFAULTS.fps / DEFAULTS.fireRate) {
	          this.fireBullet();
	          this.frames = 0;
	        } else {
	          this.frames += 1;
	        }
	      }
	    });

	    this.vel = Utils.sumVectors(dirs);
	  }

	  bounce() {
	    this.vel = [0, 0];

	    if (this.pos[0] < this.minPos[0]) { // left wall
	      this.pos[0] = this.minPos[0];
	    } else if (this.pos[1] < this.minPos[1]) { // middle of screen
	      this.pos[1] = this.minPos[1];
	    } else if (this.pos[0] > this.maxPos[0]) { // right wall
	      this.pos[0] = this.maxPos[0];
	    } else if (this.pos[1] > this.maxPos[1]) { // bottom wall
	      this.pos[1] = this.maxPos[1];
	    }
	  }

	  fireBullet() {
	    let leftPos = Utils.sumVectors([this.pos,
	                                   [-this.radius / 6, -this.radius]]);
	    let rightPos = Utils.sumVectors([this.pos,
	                                   [this.radius / 6, -this.radius]]);

	    [leftPos, rightPos].forEach(pos => {
	      this.game.addBullet({
	                           game: this.game,
	                           vel: [0, -1],
	                           pos: pos,
	                           shootedBy: Ship,
	                           power: 2
	                         });
	    });
	  }

	  draw(ctx, images) {
	    ctx.drawImage(
	      images.ship,
	      this.pos[0] - this.radius,
	      this.pos[1] - this.radius,
	      this.radius * 2,
	      this.radius * 2
	    );
	  }
	}

	Ship.MOVES = {
	  38: [0, -1], // up
	  87: [0, -1], // up
	  39: [1, 0],  // right
	  68: [1, 0],  // right
	  40: [0, 1],  // down
	  83: [0, 1],  // down
	  37: [-1, 0], // left
	  65: [-1, 0]  // left
	};

	module.exports = Ship;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Utils = __webpack_require__(5);

	class Star extends MovingObject {
	  constructor(options) {
	    options.radius = Math.random() + 1.1;
	    options.speed = options.radius;
	    options.vel = Utils.scale([0, 1], options.speed);
	    options.color = 'white';

	    super(options);
	  }

	  bounce() {
	    this.pos = [Utils.wrap(this.pos[0], this.minPos[0], this.maxPos[0]),
	                Utils.wrap(this.pos[1], this.minPos[1], this.maxPos[1])];
	  }
	}

	module.exports = Star;


/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	class Effect {
	  constructor(options) {
	    this.vel = [0, 0];
	    this.pos = options.pos;
	    this.game = options.game;

	    this.name = options.name;
	    this.width = options.width;
	    this.height = options.height;

	    this.resultSide = options.resultSide;
	    this.totalFrames = options.totalFrames;
	    this.currFrame = 0;
	  }

	  draw(ctx, images) {
	    if (this.currFrame > this.totalFrames) return this.game.remove(this);

	    let img;
	    switch(this.name) {
	      case 'explosion':
	        img = images.explosion;
	        break;
	      case 'appearance':
	        img = images.appearance;
	        break;
	      case 'smallExplosion':
	        img = images.smallExplosion;
	        break;
	      case 'splash':
	        img = images.splash;
	        break;
	    }

	    ctx.drawImage(
	      img,
	      this.currFrame * this.width,
	      0,
	      this.width,
	      this.height,
	      this.pos[0],
	      this.pos[1],
	      this.resultSide,
	      this.resultSide
	    );

	    this.currFrame++;
	  }
	}

	module.exports = Effect;


/***/ }
/******/ ]);