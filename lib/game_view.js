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
