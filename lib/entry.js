const GameView = require('./game_view.js');
const Game = require('./game.js');

$(() => {
  let ctx = $('#game-canvas')[0].getContext('2d');
  let images = {};

  let playerBullet = new Image();
  playerBullet.src = 'assets/player_bullet.png';
  images.playerBullet = playerBullet;

  let enemyBullet = new Image();
  enemyBullet.src = 'assets/enemy_bullet.png';
  images.enemyBullet = enemyBullet;

  let ship = new Image();
  ship.src = 'assets/ship.png';
  images.ship = ship;

  let explosion = new Image();
  explosion.src = 'assets/explosion.png';
  images.explosion = explosion;

  let appearance = new Image();
  appearance.src = 'assets/appearance.png';
  images.appearance = appearance;

  images.levels = {};

  for(let i = 1; i <= 10; i++) {
    let level = new Image();
    level.src = `assets/level${i}.png`;
    images.levels[i] = level;
  }

  const game = new Game(images);
  const view = new GameView(game, ctx);
  window.stars = game.stars;
  view.start();
});
