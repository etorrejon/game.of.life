var simulation = function() {
  var that = this;
  var tick_count = 0;

  that.get_tick_count = function () {
    return tick_count;
  };

  that.get_population = function() {
    return 0;
  };

  //that.seed(cells) = function() {
    
  //}

  that.tick = function() {
    tick_count += 1;
  }

  return that;
}
