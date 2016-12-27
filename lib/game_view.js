class GameView {
  constructor(game, ctx) {
    this.ship = game.ship;
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    key('space', () => this.ship.fireBullet());

    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    let timeDelta = time - this.lastTime;

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.bindKeyHandlers();

    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }

  bindKeyHandlers() {
    let pressedKeys = key.getPressedKeyCodes();
    this.ship.handleMoves(pressedKeys);
  }
}

module.exports = GameView;
