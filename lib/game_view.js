const key = require('../vendor/keymaster.js');

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
