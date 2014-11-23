eval(require('fs').readFileSync('src/utilities.js','utf8'));
eval(require('fs').readFileSync('src/cell.js','utf8'));
eval(require('fs').readFileSync('src/simulation.js','utf8'));

//describe("A new simulation", function() {
//  it("Has an initial tick count of zero", function() {
//    var sim = simulation();
//
//    expect(sim.get_tick_count()).toBe(0);
//  });
//
//  it("Has an initial population of zero", function() {
//    var sim = simulation();
//
//    expect(sim.get_population_size()).toBe(0);
//  });
//
//  it("Has an initial dead cell count of zero", function() {
//    var sim = simulation();
//
//    expect(sim.get_dead_cell_count()).toBe(0);
//  });
//
//  it("Accepts a seed", function() {
//    var sim = simulation();
//
//    sim.seed([{x: 0, y:0}]);
//
//    expect(sim.get_population_size()).toBe(1);
//  }); 
//
//  it("Can tick", function() {
//    var sim = simulation();
//
//    sim.tick();
//
//    expect(sim.get_tick_count()).toBe(1);
//  });
//});

describe("On simulation tick", function() {
  //it("Causes a solitary cell to die", function() {
  //  var sim = simulation();
  //  sim.seed([{x: 0, y:0}]);
  //  sim.tick();

  //  expect(sim.get_population_size()).toBe(0);
  //});

  //it("Causes any cell with no neighbours to die", function() {
  //  var sim = simulation();
  //  sim.seed([{x: 0, y: 0}, 
  //            {x: 10, y: 10}, 
  //            {x: 4, y: 6}]);
  //  sim.tick();

  //  expect(sim.get_population_size()).toBe(0);
  //});

  it("Causes a cell with only one neighbour to die", function() {
    var sim = simulation();
    sim.seed([{x: 0, y: 0}, {x: 0, y: 1}]);
    
    sim.tick();

    expect(sim.get_population_size()).toBe(0);
  });

  it("Allows a cell with two neighbours to live", function() {
    var sim = simulation();
    var survivor = {x: 3, y: 2};
    sim.seed([survivor, 
              {x: 2, y: 2},
              {x: 4, y: 2}]);

    sim.tick();

    expect(sim.get_population_size()).toBe(1);
    expect(sim.is_cell_populated(survivor.x, survivor.y)).toBe(true);
  });

  it("Allows a cell with diagonal neighbours to live", function() {
    var sim = simulation();
    var survivor = {x: 2, y: 2};
    sim.seed([survivor, 
              {x: 3, y: 3},
              {x: 1, y: 1}]);

    sim.tick();

    expect(sim.get_population_size()).toBe(1);
    expect(sim.is_cell_populated(survivor.x, survivor.y)).toBe(true);
  });

  it("Keeps track of dead cells", function() {
    var sim = simulation();
    var dead_cell_one = {x: 4, y: 4};
    var dead_cell_two = {x: 12, y: 1};
    var dead_cell_three = {x: 2, y: 2};
    sim.seed([dead_cell_one, dead_cell_two, dead_cell_three]);

    sim.tick();

    expect(sim.get_population_size()).toBe(0);
    expect(sim.get_dead_cell_count()).toBe(3);
  });

  it("Causes a cell with two dead neighbours to die", function() {
    var sim = simulation();
    sim.seed([{x: 2, y: 2}, 
              {x: 2, y: 1}, 
              {x: 2, y: 3}]);

    sim.tick();
    sim.tick();

    expect(sim.get_population_size()).toBe(0);
    expect(sim.get_dead_cell_count()).toBe(3);
  });

  it("Allows a block of four squares to live for a long time", function() {
    var sim = simulation();

    sim.seed([{x: 2, y: 2}, 
              {x: 2, y: 3}, 
              {x: 3, y: 2}, 
              {x: 3, y: 3}]);

    for(i = 0; i < 100; i++) {
      sim.tick();
    }

    expect(sim.get_population_size()).toBe(4);
    expect(sim.get_dead_cell_count()).toBe(0);
  });

  it("Allows a beehive to live for a long time", function() {
    var sim = simulation();

    sim.seed([{x: 2, y: 1}, 
              {x: 3, y: 1}, 
              {x: 1, y: 2}, 
              {x: 4, y: 2}, 
              {x: 2, y: 3}, 
              {x: 3, y: 3}]);

    for(i = 0; i < 100; i++) {
      sim.tick();
    }

    expect(sim.get_population_size()).toBe(6);
    expect(sim.get_dead_cell_count()).toBe(0);
  });
  
});
