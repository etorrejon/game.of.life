var simulation = function() {
  var that, tick_count, population, population_grid;
  that = this;
  tick_count = 0;
  population = [];
  population_grid = Array.matrix(80, 80, null);

  that.get_tick_count = function () {
    return tick_count;
  };

  that.get_population_size = function() {
    var live_count = 0;
    for(var i = 0; i < population.length; i++) {
      if(population[i] != null && population[i].is_alive()) {
        live_count += 1;
      }
    }
    return live_count;
  }

  that.get_dead_cell_count = function() {
    var dead_count = 0;
    for(var i = 0; i < population.length; i++) {
      if(population[i] == null || !population[i].is_alive()) {
        dead_count += 1;
      }
    }
    return dead_count;
  }

  that.is_cell_dead = function(x, y) {
    return population_grid[x][y] != null &&
           !population_grid[x][y].is_alive();
  }

  that.is_cell_empty = function(x, y) {
    return population_grid[x][y] == null;
  }

  that.is_cell_populated = function(x, y) {
    return population_grid[x][y] != null &&
           population_grid[x][y].is_alive();
  }

  that.kill_cell = function(x, y) {
    population_grid[x][y].die();
  }

  that.seed = function(cells) {
    for(var i = 0; i < cells.length; i++) {
      var newX = cells[i].x;
      var newY = cells[i].y;
      var newCell = cell(newX, newY);

      population_grid[newX][newY] = newCell;
      population.push(newCell);
    }
  }

  that.tick = function() {
    var to_die = [];
    var to_resurrect = [];

    for(var i = 0; i < population.length; i++) {
      if(cell_should_live(population[i])) {
        to_resurrect.push(population[i]);
      } else {
        to_die.push(population[i]);
      }
    }

    for(var i = 0; i < to_die.length; i++) {
      to_die[i].die();
    }

    for(var i = 0; i < to_resurrect.length; i++) {
      to_resurrect[i].resurrect();
    }
    
    tick_count += 1;
  }

  that.debug = function() {
    print_world();
  }

  // :: helper functions ::
  function cell_should_live(c) {
    var neighbour_count = 0;
    if(has_left_neighbour(c)) neighbour_count += 1;
    if(has_right_neighbour(c)) neighbour_count += 1;
    if(has_top_neighbour(c)) neighbour_count += 1;
    if(has_bottom_neighbour(c)) neighbour_count += 1;
    if(has_bottom_left_neighbour(c)) neighbour_count += 1;
    if(has_bottom_right_neighbour(c)) neighbour_count += 1;
    if(has_top_left_neighbour(c)) neighbour_count += 1;
    if(has_top_right_neighbour(c)) neighbour_count += 1;

    if(!c.is_alive() && neighbour_count == 3) return true;
    if(!c.is_alive()) return false;
    if(neighbour_count > 3) return false;
    return neighbour_count >= 2;
  }

  function has_top_left_neighbour(c) {
    if(c.y() == 0) return false;
    if(c.x() == 0) return false;
    var neighbour = population_grid[c.x() - 1][c.y() - 1];
    return neighbour != null && neighbour.is_alive();
  }

  function has_top_right_neighbour(c) {
    if(c.y() == 0) return false;
    var neighbour = population_grid[c.x() + 1][c.y() - 1];
    return neighbour != null && neighbour.is_alive();
  }

  function has_bottom_left_neighbour(c) {
    if(c.y() >= population_grid[0].length - 1) return false;
    if(c.x() == 0) return false;
    var neighbour = population_grid[c.x() - 1][c.y() + 1];
    return neighbour != null && neighbour.is_alive();
  }

  function has_bottom_right_neighbour(c) {
    if(c.y() >= population_grid[0].length - 1) return false;
    var neighbour = population_grid[c.x() + 1][c.y() + 1];
    return neighbour != null && neighbour.is_alive();
  }

  function has_left_neighbour(c) {
    if(c.x() == 0) return false;
    var neighbour = population_grid[c.x() - 1][c.y()];
    return neighbour != null && neighbour.is_alive();
  }

  function has_right_neighbour(c) {
    if(c.x() >= population_grid.length - 1) return false;
    var neighbour = population_grid[c.x() + 1][c.y()];
    return neighbour != null && neighbour.is_alive();
  }

  function has_bottom_neighbour(c) {
    if(c.y() >= population_grid[0].length - 1) return false;
    var neighbour = population_grid[c.x()][c.y() + 1];
    return neighbour != null && neighbour.is_alive();
  }
  
  function has_top_neighbour(c) {
    if(c.y() == 0) return false;
    var neighbour = population_grid[c.x()][c.y() - 1];
    return neighbour != null && neighbour.is_alive();
  }

  function print_world() {
    console.log('---------the world----------');
    console.log('tick: {t}'
                .supplant({t: tick_count}));
    console.log('population: {p}'
                .supplant({p: get_population_size()}));

    for(var i = 0; i < population.length; i++) {
      var c = population[i];
      var inGrid = is_cell_populated(c.x(), c.y());
      console.log('Member: {x}, {y} in grid? {g}'
                  .supplant({x: c.x(), y: c.y(), g: inGrid.toString()}));
    }

    console.log('---------------------------');
  }

  function print_neighbours(c) {
    console.log('has left neighbour? {v}'
                .supplant({v: has_left_neighbour(c).toString()}));
    console.log('has right neighbour? {v}'
                .supplant({v: has_right_neighbour(c).toString()}));
    console.log('has bottom neighbour? {v}'
                .supplant({v: has_bottom_neighbour(c).toString()}));
    console.log('has top neighbour? {v}'
                .supplant({v: has_top_neighbour(c).toString()}));
  }

  function print_cell(c) {
    console.log('cell ({x}, {y}) is alive? {a}'
                .supplant({x: c.x(), y: c.y(), a: c.is_alive().toString()}));
  }

  return that;
}
