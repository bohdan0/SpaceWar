const GameView = require('./game_view.js');
const Game = require('./game.js');

$(() => {
  let ctx = $('#game-canvas')[0].getContext('2d');
  let images = {};

  const imageNames = ['playerBullet', 'enemyBullet', 'ship',
                    'explosion', 'smallExplosion', 'appearance',
                    'controls'];

  imageNames.forEach(name => {
    let image = new Image();
    image.src = `assets/${ name }.png`;
    images[name] = image;
  });

  let audio = {};
  const audioNames = ['main', 'shot', 'explosion'];

  audioNames.forEach(name => {
    let sound = new Audio(`assets/${ name }.mp3`);
    audio[name] = sound;
  });

  images.levels = {};

  for(let i = 1; i <= 10; i++) {
    let level = new Image();
    level.src = `assets/level${ i }.png`;
    images.levels[i] = level;
  }


  const game = new Game(images, audio);
  const view = new GameView(game, ctx);
  window.stars = game.stars;
  view.start();
});
