"use strict";

// supplant function taken from Douglas Crockford's "Remedial Javascript"
// http://javascript.crockford.com/remedial.html
if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(
            /\{([^{}]*)\}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

// matrix function taken from Douglas Crockford's "Javascript: The Good Parts"
// http://shop.oreilly.com/product/9780596517748.do
if (!Array.matrix) {
  Array.matrix = function(m, n, initial) {
    var a, i, j, mat = [];
    for(i = 0; i < m; i += 1) {
      a = [];
      for(j = 0; j < n; j += 1) {
        a[j] = initial;
      }
      mat[i] = a;
    }
    return mat;
  }
}

if (!Math.toRadians) {
  Math.toRadians = function (deg) {
    return deg * Math.PI / 180;
  };
}
