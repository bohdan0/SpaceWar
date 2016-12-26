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

	const GameView = __webpack_require__(7);
	const Game = __webpack_require__(1);

	$(() => {
	  let ctx = $('#game-canvas')[0].getContext('2d');
	  const game = new Game();
	  const view = new GameView(game, ctx);
	  view.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(2);
	const Bullet = __webpack_require__(5);
	const Utils = __webpack_require__(8);
	const Ship = __webpack_require__(6);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Bullet = __webpack_require__(5);
	const Utils = __webpack_require__(8);
	const Ship = __webpack_require__(6);

	const DEFAULTS = {
	  color: 'grey',
	  radius: 20,
	  speed: 5
	};

	class Asteroid extends MovingObject {
	  constructor(options = {}) {
	    options.pos = options.pos || options.game.randomPosition();
	    options.vel = options.vel || Utils.randomVector(DEFAULTS.speed);
	    options.radius = options.radius || DEFAULTS.radius;
	    options.color = options.color || DEFAULTS.color;

	    super(options);
	  }

	  collideWith(other) {
	    if (other instanceof Ship) {
	      other.relocate();
	      return true;
	    } else if (other instanceof Bullet) {
	      other.remove();
	      this.remove();
	      return true;
	    }
	  }
	}

	module.exports = Asteroid;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(8);

	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.color = options.color;
	    this.game = options.game;
	    this.isWrappable = true;
	  }

	  move(delta) {
	    const velocityScale = delta / (1000 / 60); // 60 times per second
	    let newX = this.pos[0] + this.vel[0] * velocityScale;
	    let newY = this.pos[1] + this.vel[1] * velocityScale;

	    if (this.game.isOutOfBounds([newX, newY])) {
	      if (this.isWrappable) {
	        this.pos = this.game.wrap([newX, newY]);
	      } else {
	        this.remove();
	      }
	    } else {
	      this.pos = [newX, newY];
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

	  collideWith(other) {
	    // is overriden in asteroid class
	  }
	}

	module.exports = MovingObject;


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);

	class Bullet extends MovingObject {
	  constructor(options) {
	    options.color = 'red';
	    options.radius = 3;
	    super(options);
	    this.isWrappable = false;
	  }
	}

	module.exports = Bullet;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	const Bullet = __webpack_require__(5);

	const DEFAULTS = {
	  vel: [0, 0],
	  radius: 10,
	  color: 'red'
	};

	class Ship extends MovingObject {
	  constructor(options = {}) {
	    options.pos = options.pos;
	    options.vel = DEFAULTS.vel;
	    options.radius = options.radius || DEFAULTS.radius;
	    options.color = options.color || DEFAULTS.color;

	    super(options);
	  }

	  relocate() {
	    this.pos = this.game.randomPosition();
	    this.vel = DEFAULTS.vel;
	  }

	  power(impulse) {
	    let newX = this.vel[0] + impulse[0];
	    let newY = this.vel[1] + impulse[1];

	    this.vel = [newX, newY];
	  }

	  fireBullet() {
	    const bullet = new Bullet({
	                               game: this.game,
	                               vel: this.vel,
	                               pos: this.pos
	                             });
	    this.game.add(bullet);
	  }
	}

	module.exports = Ship;


/***/ },
/* 7 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.game = game;
	    this.ctx = ctx;
	  }

	  start() {
	    this.bindKeyHandlers();
	    this.lastTime = 0;

	    requestAnimationFrame(this.animate.bind(this));
	  }

	  animate(time) {
	    let timeDelta = time - this.lastTime;

	    this.game.step(timeDelta);
	    this.game.draw(this.ctx);

	    this.lastTime = time;

	    requestAnimationFrame(this.animate.bind(this));
	  }

	  bindKeyHandlers() {
	    const ship = this.game.ship;

	    Object.keys(GameView.MOVES).forEach(button => {
	      let impulse = GameView.MOVES[button];
	      key(button, () => ship.power(impulse));
	    });

	    key('l', () => ship.fireBullet());
	  }
	}

	GameView.MOVES = {
	  'w': [0, -1],
	  'a': [-1, 0],
	  's': [0, 1],
	  'd': [1, 0]
	};

	module.exports = GameView;


/***/ },
/* 8 */
/***/ function(module, exports) {

	const Utils = {
	  randomVector: (length) => {
	    let deg = 2 * Math.PI * Math.random();
	    return Utils.scale([Math.sin(deg), Math.cos(deg)], length);
	  },

	  scale: (vec, n) => [vec[0] * n, vec[1] * n],

	  wrap: (x, max) => {
	    if (x < 0) {
	      return max;
	    } else if (x > max) {
	      return 0;
	    } else {
	      return x;
	    }
	  },

	  distance: (pos1, pos2) => {
	    let squareX = Math.pow(pos2[0] - pos1[0], 2);
	    let squareY = Math.pow(pos2[1] - pos1[1], 2);

	    return Math.sqrt(squareX + squareY);
	  }
	};

	module.exports = Utils;


/***/ }
/******/ ]);