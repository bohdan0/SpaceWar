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
	const Game = __webpack_require__(3);

	document.addEventListener('DOMContentLoaded', () => {
	  const canvas = document.getElementById('game-canvas');
	  const height = document.documentElement.clientHeight - 30;
	  canvas.height = height;
	  const ctx = canvas.getContext('2d');

	  let images = {};

	  const imageNames = ['playerBullet', 'enemyBullet', 'ship',
	                      'explosion', 'smallExplosion', 'appearance',
	                      'controls'];

	  imageNames.forEach(name => {
	    let image = new Image();
	    image.src = `assets/${ name }.png`;
	    images[name] = image;
	  });

	  let audio = {};
	  const audioNames = ['main', 'shot', 'explosion'];

	  audioNames.forEach(name => {
	    let sound = new Audio(`assets/${ name }.mp3`);
	    audio[name] = sound;
	  });

	  images.levels = {};

	  for(let i = 1; i <= 10; i++) {
	    let level = new Image();
	    level.src = `assets/level${ i }.png`;
	    images.levels[i] = level;
	  }

	  const muteButton = document.getElementById('mute');
	  muteButton.addEventListener('click', () => {
	    muteButton.blur();
	    Object.values(audio).forEach(sound => {
	      sound.muted = !sound.muted;
	    });
	  });

	  const game = new Game(images, audio, height);
	  const view = new GameView(game, ctx);
	  window.stars = game.stars;
	  view.start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const key = __webpack_require__(2);

	class GameView {
	  constructor(game, ctx) {
	    this.game = game;
	    this.ctx = ctx;
	  }

	  start() {
	    requestAnimationFrame(this.animate.bind(this));

	    setInterval(() => {
	      let enemy = this.game.enemies[Math.floor(Math.random() * this.game.enemies.length)];
	      if (enemy) enemy.fireBullet();
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

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Enemy = __webpack_require__(4);
	const Effect = __webpack_require__(6);
	const Bullet = __webpack_require__(8);
	const Utils = __webpack_require__(7);
	const Ship = __webpack_require__(9);
	const Star = __webpack_require__(10);

	class Game {
	  constructor(images, audio, height) {
	    this.images = images;
	    this.audio = audio;
	    this.stars = [];
	    this.bullets = [];
	    this.enemies = [];
	    this.effects = [];

	    this.lives = 5;
	    this.level = 1;
	    this.score = 0;

	    this.DIM_X = 600;
	    this.DIM_Y = height;
	    this.NUM_ENEMIES = 5;
	    this.NUM_STARS = 300;

	    this.addStars();
	    this.renderingEnemies = false;
	    this.isOver = true;
	    this.begin = true;
	    
	    audio.main.loop = true;
	    audio.main.play('loop');
	  }

	  addEnemies() {
	    if (!this.isOver) {
	      for(let i = 0; i < this.NUM_ENEMIES; i++) {
	        let enemy = new Enemy({
	                                      game: this,
	                                      health: this.level,
	                                      vel: [0, 0]
	                                    });
	        this.add(enemy);
	      }
	    }

	    // hold enemies while appearance is drawing
	    setTimeout(() => {
	      this.enemies.forEach(enemy => {
	        enemy.vel = Utils.randomVector(3);
	      });
	    }, 500);
	  }

	  nextLevel() {
	    if (this.enemies.length === 0 &&
	        !this.renderingEnemies &&
	        !this.isOver) {
	      this.renderingEnemies = true;
	      this.level++;

	      setTimeout(() => {
	        this.addEnemies();
	        this.renderingEnemies = false;
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
	                            this.enemies,
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
	      this.enemies.concat([this.ship]).forEach(obj => {
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
	    ctx.fillText(`HIT ENTER TO START`, 50, 300);

	    ctx.drawImage(
	      this.images.controls,
	      20,
	      450
	    );

	    ctx.fillStyle = 'yellow';
	    ctx.font = 'bold 36px Russo One';
	    ctx.fillText(`SHOOT`, 120, 600);

	    ctx.fillStyle = 'yellow';
	    ctx.font = 'bold 36px Russo One';
	    ctx.fillText(`MOVE`, 455, 600);
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
	    ctx.fillText(`HIT ENTER TO RESTART`, 15, 500);
	  }

	  drawLevel(ctx) {
	    ctx.fillStyle = 'red';
	    ctx.font = 'bold 24px Russo One';
	    ctx.fillText(`LEVEL : ${this.level}`, 250, 30);
	  }

	  drawLives(ctx) {
	    // ctx.fillStyle = 'red';
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

	  drawScore(ctx) {
	    ctx.fillStyle = 'red';
	    ctx.font = 'bold 24px Russo One';
	    ctx.fillText(`SCORE : ${this.score}`, 20, 30);
	  }

	  shipCrash() {
	    this.ship.explode();
	    this.lives -= 1;
	    if (this.lives <= 0) this.gameOver();
	  }

	  gameOver() {
	    this.isOver = true;
	    this.ship.radius = 0;
	    this.enemies = [];
	    this.bullets = [];
	  }

	  add(obj) {
	    if (obj instanceof Bullet) {
	      this.bullets.push(obj);
	    } else if (obj instanceof Enemy) {
	      this.enemies.push(obj);
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
	    } else if (obj instanceof Enemy) {
	      let idx = this.enemies.indexOf(obj);
	      this.enemies.splice(idx, 1);
	    } else if (obj instanceof Effect) {
	      let idx = this.effects.indexOf(obj);
	      this.effects.splice(idx, 1);
	    }
	  }

	  increaseScore(rate) {
	    this.score += rate;
	  }

	  restart(keys) {
	    if (keys.includes(13)) { // return
	      this.ship = new Ship({ game: this });
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Utils = __webpack_require__(7);

	const DEFAULTS = {
	  radius: 40,
	  health: 5,
	  speed: 3
	};

	class Enemy extends MovingObject {
	  constructor(options) {
	    options.radius = DEFAULTS.radius;
	    options.pos = options.game.randomPosition(options.radius);
	    options.speed = DEFAULTS.speed;

	    super(options);
	    this.health = options.health;
	    this.minPos = [0 + this.radius, 0 + this.radius];
	    this.maxPos = [this.game.DIM_X - this.radius,
	                   this.game.DIM_Y / 2 - this.radius];
	    this.appear();
	  }

	  bounce(collidedWall) {
	    switch(collidedWall) {
	      case 'top':
	      case 'bottom':
	        this.vel = [this.vel[0], -this.vel[1]];
	        break;
	      case 'right':
	      case 'left':
	        this.vel = [-this.vel[0], this.vel[1]];
	        break;
	    }
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
	    let shipApproxPos = this.approxShipPos(3);
	    let vel = Utils.vectorBetween(this.pos, shipApproxPos);

	    this.game.addBullet({
	                         game: this.game,
	                         vel: vel,
	                         pos: this.pos,
	                         shootedBy: Enemy,
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

	module.exports = Enemy;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Effect = __webpack_require__(6);
	const Utils = __webpack_require__(7);

	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.speed = options.speed;
	    this.game = options.game;
	    this.isWrappable = true;
	    this.minPos = [0 + this.radius, 0 + this.radius];
	    this.maxPos = [this.game.DIM_X - this.radius,
	                   this.game.DIM_Y - this.radius];
	  }

	  move() {
	    this.pos = Utils.sumVectors([this.pos, this.vel]);
	    const wallCollision = this.isOutOfBounds();
	    
	    if (wallCollision) {
	      if (this.isWrappable) {
	        this.bounce(wallCollision);
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

	  isOutOfBounds() {
	    let x = this.pos[0];
	    let y = this.pos[1];

	    if (x < this.minPos[0]) return 'left';
	    if (x > this.maxPos[0]) return 'right';
	    if (y < this.minPos[1]) return 'top';
	    if (y > this.maxPos[1]) return 'bottom';

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
	    if (!this.game.audio.explosion.muted) this.game.audio.explosion.cloneNode().play();
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
/* 6 */
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

	    ctx.drawImage(
	      images[this.name],
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


/***/ },
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Utils = __webpack_require__(7);
	const Ship = __webpack_require__(9);
	const Enemy = __webpack_require__(4);

	const DEFAULTS = {
	  radius: 15,
	  speed: 8
	};

	class Bullet extends MovingObject {
	  constructor(options) {
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
	    if (other instanceof Ship && this.shootedBy === Enemy && !other.protect) {
	      this.game.shipCrash();
	      other.respawn();
	      this.remove();

	      return true;
	    } else if ( other instanceof Enemy && this.shootedBy === Ship) {
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
	    let img;
	    let size;

	    if (this.shootedBy.name === 'Enemy') {
	      img = images.enemyBullet;
	      size = 17.94;
	    } else {
	      img = images.playerBullet;
	      size = 192;
	    }

	      ctx.drawImage(
	        img,
	        this.currFrame * size,
	        0,
	        size,
	        size,
	        this.pos[0] - this.radius / 2,
	        this.pos[1] - this.radius / 8,
	        this.radius,
	        this.radius
	      );
	      // playerBullet and enemyBullet have 18 frames
	      this.currFrame = ++this.currFrame % 18;
	  }
	}

	module.exports = Bullet;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Utils = __webpack_require__(7);
	const Game = __webpack_require__(3);

	const DEFAULTS = {
	  vel: [0, 0],
	  radius: 40,
	  speed: 5.5,
	  fps: 60, 
	  fireRate: 8 // bullets per second
	};

	class Ship extends MovingObject {
	  constructor(options) {
	    options.radius = DEFAULTS.radius;
	    options.speed = DEFAULTS.speed;
	    options.vel = DEFAULTS.vel;
	    options.pos = [options.game.DIM_X / 2,
	                   options.game.DIM_Y - DEFAULTS.radius];

	    super(options);
	    this.frames = 0; // to handle shooting
	    this.minPos = [0 + this.radius, this.game.DIM_Y / 2 + this.radius];
	    this.maxPos = [this.game.DIM_X - this.radius,
	                   this.game.DIM_Y - this.radius];

	    this.protect = false;
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
	    if (!this.game.audio.shot.muted) this.game.audio.shot.cloneNode().play();
	    let leftPos = Utils.sumVectors([this.pos,
	                                   [-this.radius / 4, -this.radius]]);
	    let rightPos = Utils.sumVectors([this.pos,
	                                    [this.radius / 4, -this.radius]]);

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

	  setProtection() {
	    this.protect = true;
	    setInterval(() => {
	      this.protect = false;
	    }, 3000);
	  }

	  respawn() {
	    this.setProtection();
	    this.pos = [this.game.DIM_X / 2, this.game.DIM_Y - this.radius];
	    this.appear();
	  }

	  draw(ctx, images) {
	    if (this.protect) ctx.globalAlpha = .5;

	    ctx.drawImage(
	      images.ship,
	      this.pos[0] - this.radius,
	      this.pos[1] - this.radius,
	      this.radius * 2,
	      this.radius * 2
	    );

	    ctx.globalAlpha = 1;
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(5);
	const Utils = __webpack_require__(7);

	class Star extends MovingObject {
	  constructor(options) {
	    options.radius = Math.random() + .01;
	    options.speed = Math.pow(options.radius, 3);
	    options.vel = Utils.scale([0, 1], options.speed);

	    super(options);
	    this.color = 'white';
	  }

	  bounce() {
	    this.pos = [Utils.wrap(this.pos[0], this.minPos[0], this.maxPos[0]),
	                Utils.wrap(this.pos[1], this.minPos[1], this.maxPos[1])];
	  }
	}

	module.exports = Star;


/***/ }
/******/ ]);