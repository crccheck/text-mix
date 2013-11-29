// Uses Node, AMD or browser globals to create a module.
//
// https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['levenshtein'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('levenshtein'));
  } else {
    // Browser globals (root is window)
    root.textMix = factory(root.Levenshtein);
  }
}(this, function (Levenshtein) {
  'use strict';

  var utils = {
    // from jQuery, MIT license
    isNumeric: function( obj ) {
      return !isNaN( parseFloat(obj) ) && isFinite( obj );
    }
  };

  var matrixMemory = {};

  var NOOP = null,
      SUB = 0,
      INSERT = -1,
      DELETION = 1;

  var next = function (matrix, startX, startY) {
    // http://stackoverflow.com/questions/5849139/levenshtein-distance-inferring-the-edit-operations-from-the-matrix
    // assert startY > matrix.length
    // assert startX > matrix[0].length
    var val = matrix[startY][startX],
        up = matrix[startY - 1][startX],
        left = matrix[startY][startX - 1],
        diag = matrix[startY - 1][startX - 1],
        min = Math.min(up, left, diag),
        nextX = startX, nextY = startY, operation;
    // console.log('val:', val, 'up:', up, 'diag:', diag, 'left:', left, 'min:', min);
    if (diag === 0 || diag <= min) {
      nextX = startX - 1;
      nextY = startY - 1;
      if (diag < val) {
        operation = SUB;
      } else if (diag === val) {
        operation = NOOP;
      }
    } else if (left === 0 || left <= min) {
      operation = INSERT;
      nextX = startX - 1;
    } else {
      operation = DELETION;
      nextY = startY -1;
    }
    return [val, operation, nextX, nextY];
  };

  var traverse = function(text1, text2, iterations) {
    var matrix = (new Levenshtein(text1, text2)).getMatrix(),
        startY = matrix.length - 1,
        startX = matrix[0].length - 1,
        out,
        ret = text2.split('');

    while (iterations-- && startX > 0 && startY > 0) {
      out = next(matrix, startX, startY);
      startX = out[2];
      startY = out[3];
      switch (out[1]) {
        case NOOP:
        break;
        case SUB:
          ret[startY] = text1[startX];
        break;
        case INSERT:
          ret.splice(startY, 0, text1[startX]);
        break;
        case DELETION:
          ret.splice(startX, 1);
        break;
      }
    }
    return ret.join('');
  };

  var pick = function(text1, text2, idx, amount) {
    var mmKey = text1 + ' ' + text2;
    if (!matrixMemory[mmKey]) {
      matrixMemory[mmKey] = (new Levenshtein(text1, text2)).getMatrix();
    }
    // assert idx < Math.max(text1.length, text2.length)
    var n_max = Math.max(text1.length, text2.length);
    if (idx >= text1.length) {
      return text2[idx];
    } else if (idx >= text2.length) {
      return text1[idx];
    }
    // left to right:
    return (idx < amount * n_max) ? text2[idx]: text1[idx];
    // random method:
    // return (Math.random() < amount) ? text2[idx]: text1[idx];
  };

  var stringMix = function(text1, text2, amount) {
    var new_length = text1.length + Math.floor((text2.length - text1.length) * amount),
        out = '';
    for (var i = 0; i < new_length; i++) {
      out += pick(text1, text2, i, amount);
    }
    return out;
  };

  var numberMix = function(num1, num2, amount) {
    // FIXME sig digs
    return Math.round(num1 + (num2 - num1) * amount);
  };

  var textMix = function(text1, text2, amount) {
    var words1 = text1.split(' '),
        words2 = text2.split(' '),
        n_max = Math.max(words1.length, words2.length),
        out = [];
    for (var i = 0; i < n_max; i++) {
      if (utils.isNumeric(words1[i]) && utils.isNumeric(words2[i])) {
        out.push(numberMix(parseFloat(words1[i]), parseFloat(words2[i]), amount));
      } else {
        out.push(stringMix(words1[i] || '', words2[i] || '', amount));
      }
    }
    return out.join(' ');
  };

  return {
    traverse: traverse,
    textMix: textMix
  };
}));
