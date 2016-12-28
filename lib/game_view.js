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
