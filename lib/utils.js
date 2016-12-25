const Utils = {
  randomVector: (length) => {
    let deg = 2 * Math.PI * Math.random();
    return Utils.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scale: (vec, n) => [vec[0] * n, vec[1] * n],
  wrap: (x, max) => {
    if (x < 0) {
      return max;
    } else if (x > max) {
      return 0;
    } else {
      return x;
    }
  },
  distance: (pos1, pos2) => {
    let squareX = Math.pow(pos2[0] - pos1[0], 2);
    let squareY = Math.pow(pos2[1] - pos1[1], 2);

    return Math.sqrt(squareX + squareY);
  }
};

module.exports = Utils;
