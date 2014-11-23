var simulation = function() {
  var that = this;
  var tick_count = 0;
  var population = [];
  var population_grid = Array.matrix(100, 100, null);

  that.get_tick_count = function () {
    return tick_count;
  };

  that.get_population_size = function() {
    var live_count = 0;
    for(i = 0; i < population.length; i++) {
      if(population[i] != null && population[i].is_alive()) {
        live_count += 1;
      }
    }
    return live_count
  };

  that.get_dead_cell_count = function() {
    var dead_count = 0;
    for(i = 0; i < population.length; i++) {
      if(population[i] == null || !population[i].is_alive()) {
        dead_count += 1;
      }
    }
    return dead_count
  };

  that.is_cell_populated = function(x, y) {
    return population_grid[x][y] != null &&
           population_grid[x][y].is_alive();
  }

  that.seed = function(cells) {
    for(i = 0; i < cells.length; i++) {
      var newX = cells[i].x;
      var newY = cells[i].y;
      var newCell = cell(newX, newY);

      population_grid[newX][newY] = newCell;
      population.push(newCell);
    }
  }

  that.tick = function() {
    var populationSize = get_population_size();

    for(i = populationSize - 1; i >= 0; i--) {
      if(!cell_should_live(population[i])) {
        population[i].die();
      }
    }
    
    tick_count += 1;
  }

  // :: helper functions ::
  function cell_should_live(c) {
    var neighbour_count = 0;
    if(has_left_neighbour(c)) neighbour_count += 1;
    if(has_right_neighbour(c)) neighbour_count += 1;
    if(has_top_neighbour(c)) neighbour_count += 1;
    if(has_bottom_neighbour(c)) neighbour_count += 1;

    return neighbour_count >= 2;
  }

  function has_left_neighbour(c) {
    if(c.x() == 0) return false;
    return population_grid[c.x() - 1][c.y()];
  }

  function has_right_neighbour(c) {
    if(c.x() >= population_grid.length - 1) return false;
    return population_grid[c.x() + 1][c.y()];
  }

  function has_bottom_neighbour(c) {
    if(c.y() >= population_grid[0].length - 1) return false;
    return population_grid[c.x()][c.y() + 1];
  }
  
  function has_top_neighbour(c) {
    if(c.y() == 0) return false;
    return population_grid[c.x()][c.y() - 1];
  }

  function print_world() {
    console.log('---------the world----------');
    console.log('population: {p}'
                .supplant({p: population.length}));

    for(i = 0; i < population.length; i++) {
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

  return that;
}
