# Space War

## Play [Space War](https://bohdan0.github.io/SpaceWar "Space War")

![screenshot](http://res.cloudinary.com/safenotes/image/upload/v1485313063/Screen_Shot_2017-01-24_at_6.56.20_PM_hz5puq.png)

Space War is arcade style space shooter browser game where player has to destroy all the enemies. I created this game to improve my JavaScript coding skills.

Player has 5 lives at beginning, It decreases each time player's ship is destroyed. When there are no lives game is over. 

I implemented 10 levels in this game with unique enemies. After 10th level enemies repeat. On each next level enemies have more health than previous, so It's harder to destroy all of them. 

There is score counter, It counts health of destroyed enemies.

I used transparent canvas element plus cool background. For effects and bullets I used sprite sheets.

## System Design

```
  Class chain

  ├─ Game
  ├─ GameView
  ├─ Effect
  ├─ Utils
  └─ MovingObject 
     ├─ Ship
     ├─ Enemy
     ├─ Bullet
     └─ Star
```

**Game** class holds game state and logic for it's update. For dynamic gameplay I used HTML canvas element and JavaScript Audio objects.

**GameView** class is responsible for game animation and listening for user input. For re-drawing objects I used `window.requestAnimationFrame()` function, which renders each object about 60 times per second. For applying user input I used [keymaster.js](https://github.com/madrobby/keymaster) library.

```js
  class GameView {
    constructor(game, ctx) {
      this.game = game;
      this.ctx = ctx;
    }

    start() {
      requestAnimationFrame(this.animate.bind(this));
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
```

**Effect** class draws visual effects (explosion, spawning). For effects I used sprite sheets with different amount of frames and different frame sizes. 

```js
  // Effect class

  draw(ctx, images) {
    // effect removes itself from game state after all frames were shown
    if (this.currFrame > this.totalFrames) return this.game.remove(this);

    ctx.drawImage(
      // drawing sprite sheet based on effect name
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

    // initially currFrame equals 0
    this.currFrame++;
  }
```

**Utils** object is used for storing vector math formulas.

```js
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
```

**MovingObject** is parent class for Ship, Enemey, Bullet and Star classes. It utilizes logic for movings, checking valid position and creating effects. Child classes have own functionality based on game logic.

```js
  // MovingObject class

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
```

## Features

- ship, can move and shoot
- enemies, are moving and shooting
- levels, lives and score
- game over and restart

## Future implementations

- [ ] mobile responsive

## Gameplay and Game Over

![screenshot](http://res.cloudinary.com/safenotes/image/upload/v1485320511/Screen_Shot_2017-01-24_at_6.56.35_PM_yexeqt_jjmv99.png)