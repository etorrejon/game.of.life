eval(require('fs').readFileSync('src/utilities.js','utf8'));
eval(require('fs').readFileSync('src/cell.js','utf8'));
eval(require('fs').readFileSync('src/simulation.js','utf8'));

describe("A new simulation", function() {
  it("Accepts grid dimensions", function() {
    var width = 50;
    var height = 80;

    var sim = simulation(width, height);

    expect(sim.get_width()).toBe(width);
    expect(sim.get_height()).toBe(height);
  });

  it("Has an initial tick count of zero", function() {
    var sim = simulation(50, 50);

    expect(sim.get_tick_count()).toBe(0);
  });

  it("Has an initial population of zero", function() {
    var sim = simulation(50, 50);

    expect(sim.get_population_size()).toBe(0);
  });

  it("Has only dead cells", function() {
    var sim = simulation(50, 50);

    expect(sim.get_dead_cell_count()).toBe(50 * 50);
  });

  it("Accepts a seed", function() {
    var sim = simulation(50, 50);

    sim.seed([{x: 0, y:0}]);

    expect(sim.get_population_size()).toBe(1);
  }); 

  it("Can populate a cell", function() {
    var sim = simulation(50, 50);

    sim.populate_cell(1, 1);

    expect(sim.get_population_size()).toBe(1);
    expect(sim.is_cell_populated(1, 1)).toBe(true);
  });

  it("Can tick", function() {
    var sim = simulation(50, 50);

    sim.tick();

    expect(sim.get_tick_count()).toBe(1);
  });

  it("Can be reset", function() {
    var sim = simulation(50, 50);

    sim.populate_cell(1, 1);

    sim.reset();

    expect(sim.get_tick_count()).toBe(0);
    expect(sim.get_population_size()).toBe(0);
  });

  it("Can distinguish a dead cell from an empty cell", function() {
    var sim = simulation(50, 50);
    sim.seed([{x: 0, y: 0},
              {x: 1, y: 1}]);

    sim.kill_cell(1, 1);

    expect(sim.is_cell_populated(0, 0)).toBe(true);
    expect(sim.is_cell_dead(0, 0)).toBe(false);
    expect(sim.is_cell_empty(0, 0)).toBe(false);
    expect(sim.is_cell_populated(1, 1)).toBe(false);
    expect(sim.is_cell_dead(1, 1)).toBe(true);
    expect(sim.is_cell_empty(1, 1)).toBe(false);
    expect(sim.is_cell_empty(2, 2)).toBe(false);
  });
});

describe("On simulation tick", function() {
  it("Causes a solitary cell to die", function() {
    var sim = simulation(50, 50);
    sim.seed([{x: 0, y:0}]);
    sim.tick();

    expect(sim.get_population_size()).toBe(0);
  });

  it("Keeps track of dead cells", function() {
    var width = 50;
    var height = 50;
    var sim = simulation(width, height);
    var dead_cell_one = {x: 4, y: 4};
    var dead_cell_two = {x: 12, y: 1};
    var dead_cell_three = {x: 2, y: 2};
    sim.seed([dead_cell_one, dead_cell_two, dead_cell_three]);

    sim.tick();

    expect(sim.get_population_size()).toBe(0);
    expect(sim.get_dead_cell_count()).toBe(width * height);
  }); 

  it("Causes any cell with no live neighbours to die", function() {
    var sim = simulation(50, 50);
    sim.seed([{x: 0, y: 0}, 
              {x: 10, y: 10}, 
              {x: 4, y: 6}]);
    sim.tick();

    expect(sim.get_population_size()).toBe(0);
  });

  it("Causes a cell with only one live neighbour to die", function() {
    var sim = simulation(50, 50);
    sim.seed([{x: 0, y: 0}, {x: 0, y: 1}]);
    
    sim.tick();

    expect(sim.get_population_size()).toBe(0);
  });

  it("Allows a cell with two live neighbours to survive", function() {
    var sim = simulation(50, 50);
    var survivor = {x: 1, y: 1};
    sim.seed([survivor, 
              {x: 0, y: 0},
              {x: 2, y: 2}]);

    sim.tick();

    expect(sim.get_population_size()).toBe(1);
    expect(sim.is_cell_populated(survivor.x, survivor.y)).toBe(true);
  });

  it("Allows a cell with two live diagonal neighbours to survive", function() {
    var sim = simulation(50, 50);
    var survivor = {x: 2, y: 2};
    sim.seed([survivor, 
              {x: 3, y: 3},
              {x: 1, y: 1}]);

    sim.tick();

    expect(sim.get_population_size()).toBe(1);
    expect(sim.is_cell_populated(survivor.x, survivor.y)).toBe(true);
  });

  it("Causes a cell with more than three live neighbours to die", function() {
    var will_die = {x: 1, y: 2};
    var sim = simulation(50, 50);
    sim.seed([{x: 1, y: 1}, 
              will_die, 
              {x: 2, y: 1}, 
              {x: 2, y: 2}, 
              {x: 0, y: 3}]);

    sim.tick();

    expect(sim.is_cell_populated(will_die.x, will_die.y)).toBe(false);
  });

  it("Causes a dead cell with three live neighbours to come back to life", function() {
    var zombie_cell = {x: 1, y: 1};
    var seed = [{x: 0, y: 0}, 
                {x: 0, y: 1}, 
                zombie_cell, 
                {x: 0, y: 2}];
    var sim = simulation(50, 50);
    sim.seed(seed);
    sim.kill_cell(zombie_cell.x, zombie_cell.y);

    sim.tick();

    expect(sim.is_cell_populated(zombie_cell.x, zombie_cell.y)).toBe(true);
  });


  it("A block of four squares is a still life", function() {
    var seed = [{x: 2, y: 2}, 
                  {x: 2, y: 3}, 
                  {x: 3, y: 2}, 
                  {x: 3, y: 3}];
    var sim = simulation(50, 50);
    sim.seed(seed);

    sim.tick();
    sim.tick();

    expect(sim.get_population_size()).toBe(4);
    assert_cells_are_visible(sim, seed);
  });

  it("A beehive is a still life", function() {
    var seed = [{x: 2, y: 1}, 
                {x: 3, y: 1}, 
                {x: 1, y: 2}, 
                {x: 4, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 3}];
    var sim = simulation(50, 50);
    sim.seed(seed);

    sim.tick();
    sim.tick();

    expect(sim.get_population_size()).toBe(6);
    assert_cells_are_visible(sim, seed);
  });

  it("A boat is a still life", function() {
    var seed = [{x: 2, y: 1}, 
                {x: 3, y: 1}, 
                {x: 1, y: 2}, 
                {x: 4, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 3}]

    var sim = simulation(50, 50);
    sim.seed(seed);

    for(var i = 0; i < 100; i++) {
      sim.tick();
    }

    expect(sim.get_population_size()).toBe(6);
    assert_cells_are_visible(sim, seed);
  });

  
});

function assert_cells_are_visible(sim, cells) {
  for(var i = 0; i < cells.length; i++) {
    expect(sim.is_cell_populated(cells[i].x, cells[i].y)).toBe(true);
  }
}
