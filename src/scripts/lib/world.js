"use strict";

define(['lib/cell', 'lib/utilities'],
function(cell) {
    return function world(width, height) {
      var that, tick_count, population, 
          population_grid, grid_width, grid_height;

      that = this;
      tick_count = 0;
      population = [];
      grid_width = width;
      grid_height = height;

      that.tickCount = function () {
        return tick_count;
      };

      that.populationSize = function() {
        var live_count = 0;
        for(var i = 0; i < population.length; i++) {
          if(population[i] != null && population[i].isAlive()) {
            live_count += 1;
          }
        }
        return live_count;
      }

      that.cellAge = function(x, y) {
        return population_grid[x][y].age();
      }

      that.deadCellCount = function() {
        var dead_count = 0;
        for(var i = 0; i < population.length; i++) {
          if(population[i] == null || !population[i].isAlive()) {
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

      that.isCellDead = function(x, y) {
        return population_grid[x][y] != null &&
               !population_grid[x][y].isAlive();
      }

      that.isCellEmpty = function(x, y) {
        return population_grid[x][y] == null;
      }

      that.isCellPopulated = function(x, y) {
        return population_grid[x][y] != null &&
               population_grid[x][y].isAlive();
      }

      that.populateCell = function(x, y) {
        if(that.isCellEmpty(x, y)) {
          var new_cell = cell(x, y);
          population_grid[x][y] = new_cell;
          population.push(new_cell);
        } else if(that.isCellDead(x, y)) {
          population_grid[x][y].resurrect();
        }
      }

      that.reset = function() {
        initialize();
      };

      that.killCell = function(x, y) {
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
          var fate = decideCellFate(population[i]);
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
        printWorld();
      }

      // :: helper functions ::
      var initialize = function initialize() {
        tick_count = 0;
        population = [];
        initializeGrid();
      }

      var initializeGrid = function initializeGrid() {
        population_grid = Array.matrix(grid_width, grid_height, null);

        for(var i = 0; i < population_grid.length; i++) {
          for(var j = 0; j < population_grid[0].length; j++) {
            that.populateCell(i, j);
            that.killCell(i, j);
          }
        }
      }

      var decideCellFate = function decideCellFate(c) {
        var neighbour_count = 0;
        if(hasLeftNeighbour(c)) neighbour_count += 1;
        if(hasRightNeighbour(c)) neighbour_count += 1;
        if(hasTopNeighbour(c)) neighbour_count += 1;
        if(hasBottomNeighbour(c)) neighbour_count += 1;
        if(hasBottomLeftNeighbour(c)) neighbour_count += 1;
        if(hasBottomRightNeighbour(c)) neighbour_count += 1;
        if(hasTopLeftNeighbour(c)) neighbour_count += 1;
        if(hasTopRightNeighbour(c)) neighbour_count += 1;

        if(!c.isAlive() && neighbour_count == 3) return 'resurrect';
        if(!c.isAlive()) return 'die';
        if(neighbour_count > 3) return 'die';
        return neighbour_count >= 2 ? 'live' : 'die';
      }

      var hasTopLeftNeighbour = function hasTopLeftNeighbour(c) {
        if(c.y() == 0) return false;
        if(c.x() == 0) return false;
        var neighbour = population_grid[c.x() - 1][c.y() - 1];
        return neighbour.isAlive();
      }

      var hasTopRightNeighbour = function hasTopRightNeighbour(c) {
        if(c.y() == 0) return false;
        if(c.x() >= population_grid.length - 1) return false;
        var neighbour = population_grid[c.x() + 1][c.y() - 1];
        return neighbour.isAlive();
      }

      var hasBottomLeftNeighbour = function hasBottomLeftNeighbour(c) {
        if(c.y() >= population_grid[0].length - 1) return false;
        if(c.x() == 0) return false;
        var neighbour = population_grid[c.x() - 1][c.y() + 1];
        return neighbour.isAlive();
      }

      var hasBottomRightNeighbour = function hasBottomRightNeighbour(c) {
        if(c.y() >= population_grid[0].length - 1) return false;
        if(c.x() >= population_grid.length - 1) return false;
        var neighbour = population_grid[c.x() + 1][c.y() + 1];
        return neighbour.isAlive();
      }

      var hasLeftNeighbour = function hasLeftNeighbour(c) {
        if(c.x() == 0) return false;
        var neighbour = population_grid[c.x() - 1][c.y()];
        return neighbour.isAlive();
      }

      var hasRightNeighbour = function hasRightNeighbour(c) {
        if(c.x() >= population_grid.length - 1) return false;
        var neighbour = population_grid[c.x() + 1][c.y()];
        return neighbour.isAlive();
      }

      var hasBottomNeighbour = function hasBottomNeighbour(c) {
        if(c.y() >= population_grid[0].length - 1) return false;
        var neighbour = population_grid[c.x()][c.y() + 1];
        return neighbour.isAlive();
      }
      
      var hasTopNeighbour = function hasTopNeighbour(c) {
        if(c.y() == 0) return false;
        var neighbour = population_grid[c.x()][c.y() - 1];
        return neighbour.isAlive();
      }

      var printWorld = function printWorld() {
        console.log('------------------the world----------------------');
        console.log('tick: {t}'
                    .supplant({t: tick_count}));
        console.log('population: {p}'
                    .supplant({p: populationSize()}));

        for(var i = 0; i < population.length; i++) {
          var c = population[i];
          if(c.isAlive()) {
            printCell(c);
          }
        }

        console.log('------------------------------------------------');
      }

      var printNeighbours = function printNeighbours(c) {
        console.log('has left neighbour? {v}'
                    .supplant({v: hasLeftNeighbour(c).toString()}));
        console.log('has right neighbour? {v}'
                    .supplant({v: hasRightNeighbour(c).toString()}));
        console.log('has bottom neighbour? {v}'
                    .supplant({v: hasBottomNeighbour(c).toString()}));
        console.log('has top neighbour? {v}'
                    .supplant({v: hasTopNeighbour(c).toString()}));
      }

      var printCell = function printCell(c) {
        console.log('cell ({x}, {y}) is alive? {a}'
                    .supplant({x: c.x(), y: c.y(), a: c.isAlive().toString()}));
      }

      // :: initialize state ::
      initializeGrid();

      return that;
    }
});
