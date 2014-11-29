var simulation = function(width, height) {
  var that, tick_count, population, 
      population_grid, grid_width, grid_height;

  that = this;
  tick_count = 0;
  population = [];
  grid_width = width;
  grid_height = height;

  that.tick_count = function () {
    return tick_count;
  };

  that.population_size = function() {
    var live_count = 0;
    for(var i = 0; i < population.length; i++) {
      if(population[i] != null && population[i].is_alive()) {
        live_count += 1;
      }
    }
    return live_count;
  }

  that.cell_age = function(x, y) {
    return population_grid[x][y].age();
  }

  that.dead_cell_count = function() {
    var dead_count = 0;
    for(var i = 0; i < population.length; i++) {
      if(population[i] == null || !population[i].is_alive()) {
        dead_count += 1;
      }
    }
    return dead_count;
  }

  that.width = function() {
    return width;
  }

  that.height = function() {
    return height;
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

  that.populate_cell = function(x, y) {
    if(is_cell_empty(x, y)) {
      var new_cell = cell(x, y);
      population_grid[x][y] = new_cell;
      population.push(new_cell);
    } else if(is_cell_dead(x, y)) {
      population_grid[x][y].resurrect();
    }
  }

  that.reset = function() {
    initialize();
  };

  that.kill_cell = function(x, y) {
    population_grid[x][y].die();
  }

  that.seed = function(cells) {
    for(var i = 0; i < cells.length; i++) {
      var newX = cells[i].x;
      var newY = cells[i].y;
      population_grid[newX][newY].resurrect();
    }
  }

  that.tick = function() {
    var to_die = [];
    var to_resurrect = [];

    for(var i = 0; i < population.length; i++) {
      population[i].tick();
      var fate = decide_cell_fate(population[i]);
      if(fate == 'resurrect') {
        to_resurrect.push(population[i]);
      } else if(fate == 'die') {
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
  var initialize = function initialize() {
    tick_count = 0;
    population = [];
    initialize_grid();
  }

  var initialize_grid = function initialize_grid() {
    population_grid = Array.matrix(grid_width, grid_height, null);

    for(var i = 0; i < population_grid.length; i++) {
      for(var j = 0; j < population_grid[0].length; j++) {
        populate_cell(i, j);
        kill_cell(i, j);
      }
    }
  }

  var decide_cell_fate = function decide_cell_fate(c) {
    var neighbour_count = 0;
    if(has_left_neighbour(c)) neighbour_count += 1;
    if(has_right_neighbour(c)) neighbour_count += 1;
    if(has_top_neighbour(c)) neighbour_count += 1;
    if(has_bottom_neighbour(c)) neighbour_count += 1;
    if(has_bottom_left_neighbour(c)) neighbour_count += 1;
    if(has_bottom_right_neighbour(c)) neighbour_count += 1;
    if(has_top_left_neighbour(c)) neighbour_count += 1;
    if(has_top_right_neighbour(c)) neighbour_count += 1;

    if(!c.is_alive() && neighbour_count == 3) return 'resurrect';
    if(!c.is_alive()) return 'die';
    if(neighbour_count > 3) return 'die';
    return neighbour_count >= 2 ? 'live' : 'die';
  }

  var has_top_left_neighbour = function has_top_left_neighbour(c) {
    if(c.y() == 0) return false;
    if(c.x() == 0) return false;
    var neighbour = population_grid[c.x() - 1][c.y() - 1];
    return neighbour.is_alive();
  }

  var has_top_right_neighbour = function has_top_right_neighbour(c) {
    if(c.y() == 0) return false;
    if(c.x() >= population_grid.length - 1) return false;
    var neighbour = population_grid[c.x() + 1][c.y() - 1];
    return neighbour.is_alive();
  }

  var has_bottom_left_neighbour = function has_bottom_left_neighbour(c) {
    if(c.y() >= population_grid[0].length - 1) return false;
    if(c.x() == 0) return false;
    var neighbour = population_grid[c.x() - 1][c.y() + 1];
    return neighbour.is_alive();
  }

  var has_bottom_right_neighbour = function has_bottom_right_neighbour(c) {
    if(c.y() >= population_grid[0].length - 1) return false;
    if(c.x() >= population_grid.length - 1) return false;
    var neighbour = population_grid[c.x() + 1][c.y() + 1];
    return neighbour.is_alive();
  }

  var has_left_neighbour = function has_left_neighbour(c) {
    if(c.x() == 0) return false;
    var neighbour = population_grid[c.x() - 1][c.y()];
    return neighbour.is_alive();
  }

  var has_right_neighbour = function has_right_neighbour(c) {
    if(c.x() >= population_grid.length - 1) return false;
    var neighbour = population_grid[c.x() + 1][c.y()];
    return neighbour.is_alive();
  }

  var has_bottom_neighbour = function has_bottom_neighbour(c) {
    if(c.y() >= population_grid[0].length - 1) return false;
    var neighbour = population_grid[c.x()][c.y() + 1];
    return neighbour.is_alive();
  }
  
  var has_top_neighbour = function has_top_neighbour(c) {
    if(c.y() == 0) return false;
    var neighbour = population_grid[c.x()][c.y() - 1];
    return neighbour.is_alive();
  }

  var print_world = function print_world() {
    console.log('------------------the world----------------------');
    console.log('tick: {t}'
                .supplant({t: tick_count}));
    console.log('population: {p}'
                .supplant({p: population_size()}));

    for(var i = 0; i < population.length; i++) {
      var c = population[i];
      if(c.is_alive()) {
        print_cell(c);
      }
    }

    console.log('------------------------------------------------');
  }

  var print_neighbours = function print_neighbours(c) {
    console.log('has left neighbour? {v}'
                .supplant({v: has_left_neighbour(c).toString()}));
    console.log('has right neighbour? {v}'
                .supplant({v: has_right_neighbour(c).toString()}));
    console.log('has bottom neighbour? {v}'
                .supplant({v: has_bottom_neighbour(c).toString()}));
    console.log('has top neighbour? {v}'
                .supplant({v: has_top_neighbour(c).toString()}));
  }

  var print_cell = function print_cell(c) {
    console.log('cell ({x}, {y}) is alive? {a}'
                .supplant({x: c.x(), y: c.y(), a: c.is_alive().toString()}));
  }

  // :: initialize state ::
  initialize_grid();

  return that;
}
