class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    this.bindKeyHandlers();
    setInterval(() => {
      this.game.step();
      this.game.draw(this.ctx);
    }, 1000 / 32);
  }

  bindKeyHandlers() {
    const ship = this.game.ship;

    Object.keys(GameView.MOVES).forEach(button => {
      let vec = GameView.MOVES[button];
      key(button, () => {
        button === 'l' ? ship.fireBullet() : ship.power(vec);
      });
    });

    // key('space', () => {
    //   ship.fireBullet();
    // });
  }

  step() {

  }
}

GameView.MOVES = {
  'w': [0, -1],
  'a': [-1, 0],
  's': [0, 1],
  'd': [1, 0],
  'l': 0
};

module.exports = GameView;
