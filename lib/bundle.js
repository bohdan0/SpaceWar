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
	  const game = new Game();
	  const view = new GameView(game, ctx);
	  view.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ship = game.ship;
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
	    this.ship.handleMoves(pressedKeys);
	  }
	}

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Bullet = __webpack_require__(6);
	const Utils = __webpack_require__(5);
	const Ship = __webpack_require__(7);

	class Game {
	  constructor() {
	    this.bullets = [];
	    this.asteroids = [];
	    this.lives = 5;
	    this.score = 0;
	    this.DIM_X = 600;
	    this.DIM_Y = 800;
	    this.NUM_ASTEROIDS = 10;
	    this.BACKGROUND = "#AA0000";
	    this.ship = new Ship({game: this});
	    this.addAsteroids();
	  }

	  addAsteroids() {
	    for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
	      let asteroid = new Asteroid({game: this});
	      this.add(asteroid);
	    }
	  }

	  randomPosition(radius) {
	    let x = (this.DIM_X - radius * 2) * Math.random() + radius;
	    let y = (this.DIM_Y / 2 - radius * 2) * Math.random() + radius;

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
	    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	    ctx.fillStyle = 'yellow';
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
	    console.log('ship crashes');
	  }

	  gameOver() {
	    // this.asteroids = [];
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

	  increaseScore(rate) {
	    this.score += rate;
	  }
	}

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Bullet = __webpack_require__(6);
	const Utils = __webpack_require__(5);
	const Ship = __webpack_require__(7);

	const DEFAULTS = {
	  color: 'grey',
	  radius: 20,
	  speed: 3
	};

	class Asteroid extends MovingObject {
	  constructor(options = {}) {
	    options.vel = options.vel || Utils.randomVector(DEFAULTS.speed);
	    options.radius = options.radius || DEFAULTS.radius;
	    options.pos = options.pos || options.game.randomPosition(options.radius);
	    options.color = options.color || DEFAULTS.color;

	    super(options);
	    this.health = 5;
	    this.minPos = [0 + this.radius, 0 + this.radius];
	    this.maxPos = [this.game.DIM_X - this.radius,
	                   this.game.DIM_Y / 2 - this.radius];
	  }

	  bounce() {
	    this.vel = Utils.scale(this.vel, -1);
	    this.pos = Utils.sumVectors([this.pos, this.vel]);
	  }

	  decreaseHealth(points) {
	    this.health -= points;
	    if (this.health <= 0) {
	      this.remove();
	    }
	  }

	  collideWith(other) {
	    if (other instanceof Bullet && other.shootedBy === Ship) {
	      other.remove();
	      this.game.increaseScore(this.health);
	      this.decreaseHealth(other.power);
	      return true;
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
	    const bullet = new Bullet({
	                               game: this.game,
	                               vel: vel,
	                               pos: this.pos,
	                               shootedBy: Asteroid,
	                               power: 1
	                             });
	    this.game.add(bullet);
	  }
	}

	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Utils = __webpack_require__(5);

	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
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
	  }
	};

	module.exports = Utils;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Utils = __webpack_require__(5);

	const DEFAULTS = {
	  color: 'red',
	  radius: 3,
	  speed: 6
	};

	class Bullet extends MovingObject {
	  constructor(options) {
	    options.color = DEFAULTS.color;
	    options.radius = DEFAULTS.radius;

	    super(options);
	    this.speed = DEFAULTS.speed;
	    this.vel = Utils.scale(this.vel, this.speed);
	    this.shootedBy = options.shootedBy;
	    this.power = options.power;
	    this.isWrappable = false;
	  }
	}

	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Asteroid = __webpack_require__(3);
	const Bullet = __webpack_require__(6);
	const Utils = __webpack_require__(5);
	const Game = __webpack_require__(2);

	const DEFAULTS = {
	  pos: [600 / 2, 800 - 10],
	  vel: [0, 0],
	  radius: 10,
	  color: 'red',
	  speed: 5,
	  fps: 60,
	  fireRate: 16 // bullets per second
	};

	class Ship extends MovingObject {
	  constructor(options = {}) {
	    options.pos = options.pos || DEFAULTS.pos;
	    options.vel = DEFAULTS.vel;
	    options.radius = options.radius || DEFAULTS.radius;
	    options.color = options.color || DEFAULTS.color;

	    super(options);
	    this.speed = DEFAULTS.speed;
	    this.frames = 0; // to handle shooting
	    this.minPos = [0 + this.radius * 2, 400 + this.radius * 2];
	    this.maxPos = [this.game.DIM_X - this.radius * 2,
	                   this.game.DIM_Y - this.radius * 2];
	  }

	  move() {
	    super.move();
	    this.bounce(); // helps with ship wrapping on corners
	  }

	  handleMoves(pressedKeys) {
	    let dirs = [];
	    let newVel = this.vel;

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

	    newVel = Utils.sumVectors(dirs);
	    this.vel = Utils.scale(newVel, this.speed);
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

	  collideWith(other) {
	    if (other instanceof Bullet && other.shootedBy.name === 'Asteroid') {
	      other.remove();
	      this.game.shipCrash(other.power);
	      return true;
	    }
	  }

	  fireBullet() {
	    let leftPos = Utils.sumVectors([this.pos, [-this.radius, 0]]);
	    let rightPos = Utils.sumVectors([this.pos, [this.radius, 0]]);

	    [leftPos, rightPos].forEach(pos => {
	      let bullet = new Bullet({
	                                game: this.game,
	                                vel: [0, -1],
	                                pos: pos,
	                                shootedBy: Ship,
	                                power: 2
	                              });
	      this.game.add(bullet);
	    });
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


/***/ }
/******/ ]);