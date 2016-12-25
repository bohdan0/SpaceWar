const Utils = {
  randomVector: (length) => {
    let deg = 2 * Math.PI * Math.random();
    return Utils.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scale: (vec, n) => [vec[0] * n, vec[1] * n]
};

module.exports = Utils;
