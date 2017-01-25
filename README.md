# Space War

## Play [Space War](https://spacewar0.herokuapp.com "Space War")

![screenshot](http://res.cloudinary.com/safenotes/image/upload/v1485313063/Screen_Shot_2017-01-24_at_6.56.20_PM_hz5puq.png)

Space War is example of Space Shooter games. It's single player game, where player drives space ship and shoots enemies. 

Player has 5 lives at beginning, It decreases each time player's ship is destroyed by enemy and when there are no lives game is over. 

I implemented 10 levels in this game with unique enemies. After 10th level enemies repeat. On each next level enemies have more health than previous, so It's harder to destroy all of them. 

There is score counter, It counts health of destroyed enemies. I used App Academy asteroids skeleton for this project.

I used canvas with transparent background plus cool background. For effects and bullets I used sprite sheets.

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

**Game** class holds game state and handles moving logic for each object on the screen. There are 4 different types of moving objects: player ship, enemy ship, bullet and star. For dynamic gameplay I used HTML canvas element and JavaScript audio objects.

**GameView** class is responsible for game animation and listening for user input. For re-drawing objects I used `window.requestAnimationFrame()` function, which renders each object about 60 times per second.

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

**MovingObject** is parent class for Ship, Enemey, Bullet and Star classes. It utilizes main logic for movings, checking valid position and creating effects. Child classes have own functionality based on game logic. In Ship class I used [keymaster.js](https://github.com/madrobby/keymaster) library for applying user input.

## MVP

- [x] ship, can move and shoot
- [x] enemies, are moving and shooting
- [x] levels, lives and score
- [x] game over and restart

## Future implementations

- [ ] mobile responsive

## Gameplay && Game Over

![screenshot](http://res.cloudinary.com/safenotes/image/upload/v1485320511/Screen_Shot_2017-01-24_at_6.56.35_PM_yexeqt_jjmv99.png)