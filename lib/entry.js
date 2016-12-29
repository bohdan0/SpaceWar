const GameView = require('./game_view.js');
const Game = require('./game.js');

$(() => {
  let ctx = $('#game-canvas')[0].getContext('2d');

  let img = new Image();
  img.src = '../../sprite.png';

  const game = new Game(img);
  const view = new GameView(game, ctx);
  window.stars = game.stars;
  view.start();
});
