const Utils = {
  randomVector: (length) => {
    let deg = 2 * Math.PI * Math.random();
    return Utils.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scale: (vec, n) => [vec[0] * n, vec[1] * n],

  distance: (pos1, pos2) => {
    let squareX = Math.pow(pos2[0] - pos1[0], 2);
    let squareY = Math.pow(pos2[1] - pos1[1], 2);

    return Math.sqrt(squareX + squareY);
  },

  sumVectors: vectors => {
    let result = [0, 0];
    vectors.forEach(vector => {
      result[0] += vector[0];
      result[1] += vector[1];
    });

    return result;
  },

  vectorLength: vector => {
    let x = Math.pow(vector[0], 2);
    let y = Math.pow(vector[1], 2);

    return Math.sqrt(x + y);
  },

  normalize: vector => {
    let length = Utils.vectorLength(vector);
    return vector.map(x => x / length);
  },

  vectorBetween: (v1, v2) => {
    let result = [v2[0] - v1[0], v2[1] - v1[1]];
    return Utils.normalize(result);
  },

  wrap: (pos, min, max) => {
    if (pos < min) {
      return max;
    } else if (pos > max) {
      return min;
    } else {
      return pos;
    }
  }
};

module.exports = Utils;
