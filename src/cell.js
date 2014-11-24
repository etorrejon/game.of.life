var cell = function(x, y) {
  var that, x_pos, y_pos, is_alive;
  that = {};
  x_pos = x;
  y_pos = y;
  is_alive = true;

  that.die = function() {
    is_alive = false;
  }

  that.resurrect = function() {
    is_alive = true;
  }

  that.is_alive = function() {
    return is_alive;
  }

  that.x = function() {
    return x_pos;
  }

  that.y = function() {
    return y_pos;
  }

  return that;
}
