const GameView = require('./game_view.js');
const Game = require('./game.js');

$(() => {
  let ctx = $('#game-canvas')[0].getContext('2d');
  const game = new Game();
  const view = new GameView(game, ctx);
  view.start();
});
