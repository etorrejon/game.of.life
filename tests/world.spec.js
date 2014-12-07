eval(require('fs').readFileSync('src/scripts/utilities.js','utf8'));
eval(require('fs').readFileSync('src/scripts/cell.js','utf8'));
eval(require('fs').readFileSync('src/scripts/world.js','utf8'));

describe("A new world", function() {
  it("Accepts grid dimensions", function() {
    var width = 50;
    var height = 80;

    var w = world(width, height);

    expect(w.width()).toBe(width);
    expect(w.height()).toBe(height);
  });

  it("Has an initial tick count of zero", function() {
    var w = world(50, 50);


    expect(w.tickCount()).toBe(0);
  });

  it("Has an initial population of zero", function() {
    var w = world(50, 50);

    expect(w.populationSize()).toBe(0);
  });

  it("Has only dead cells", function() {
    var w = world(50, 50);

    expect(w.deadCellCount()).toBe(50 * 50);
  });

  it("Accepts a seed", function() {
    var w = world(50, 50);

    w.seed([{x: 0, y:0}]);

    expect(w.populationSize()).toBe(1);
  }); 

  it("Can populate a cell", function() {
    var w = world(50, 50);

    w.populateCell(1, 1);

    expect(w.populationSize()).toBe(1);
    expect(w.isCellPopulated(1, 1)).toBe(true);
  });

  it("Can tick", function() {
    var w = world(50, 50);

    w.tick();

    expect(w.tickCount()).toBe(1);
  });

  it("Can be reset", function() {
    var w = world(50, 50);

    w.populateCell(1, 1);

    w.reset();

    expect(w.tickCount()).toBe(0);
    expect(w.populationSize()).toBe(0);
  });

  it("Can distinguish a dead cell from an empty cell", function() {
    var w = world(50, 50);
    w.seed([{x: 0, y: 0},
                {x: 1, y: 1}]);

    w.killCell(1, 1);

    expect(w.isCellPopulated(0, 0)).toBe(true);
    expect(w.isCellDead(0, 0)).toBe(false);
    expect(w.isCellEmpty(0, 0)).toBe(false);
    expect(w.isCellPopulated(1, 1)).toBe(false);
    expect(w.isCellDead(1, 1)).toBe(true);
    expect(w.isCellEmpty(1, 1)).toBe(false);
    expect(w.isCellEmpty(2, 2)).toBe(false);
  });
});

describe("On simulation tick", function() {
  it("Causes a solitary cell to die", function() {
    var w = world(50, 50);
    w.seed([{x: 0, y:0}]);
    w.tick();

    expect(w.populationSize()).toBe(0);
  });

  it("Keeps track of dead cells", function() {
    var width = 50;
    var height = 50;
    var w = world(width, height);
    var dead_cell_one = {x: 4, y: 4};
    var dead_cell_two = {x: 12, y: 1};
    var dead_cell_three = {x: 2, y: 2};
    w.seed([dead_cell_one, dead_cell_two, dead_cell_three]);

    w.tick();

    expect(w.populationSize()).toBe(0);
    expect(w.deadCellCount()).toBe(width * height);
  }); 

  it("Causes any cell with no live neighbours to die", function() {
    var w = world(50, 50);
    w.seed([{x: 0, y: 0}, 
                {x: 10, y: 10}, 
                {x: 4, y: 6}]);
    w.tick();

    expect(w.populationSize()).toBe(0);
  });

  it("Causes a cell with only one live neighbour to die", function() {
    var w = world(50, 50);
    w.seed([{x: 0, y: 0}, {x: 0, y: 1}]);
    
    w.tick();

    expect(w.populationSize()).toBe(0);
  });

  it("Allows a cell with two live neighbours to survive", function() {
    var w = world(50, 50);
    var survivor = {x: 1, y: 1};
    w.seed([survivor, 
                {x: 0, y: 0},
                {x: 2, y: 2}]);

    w.tick();

    expect(w.populationSize()).toBe(1);
    expect(w.isCellPopulated(survivor.x, survivor.y)).toBe(true);
  });

  it("Allows a cell with two live diagonal neighbours to survive", function() {
    var w = world(50, 50);
    var survivor = {x: 2, y: 2};
    w.seed([survivor, 
                {x: 3, y: 3},
                {x: 1, y: 1}]);

    w.tick();

    expect(w.populationSize()).toBe(1);
    expect(w.isCellPopulated(survivor.x, survivor.y)).toBe(true);
  });

  it("Causes a cell with more than three live neighbours to die", function() {
    var will_die = {x: 1, y: 2};
    var w = world(50, 50);
    w.seed([{x: 1, y: 1}, 
                will_die, 
                {x: 2, y: 1}, 
                {x: 2, y: 2}, 
                {x: 0, y: 3}]);

    w.tick();

    expect(w.isCellPopulated(will_die.x, will_die.y)).toBe(false);
  });

  it("Causes a dead cell with three live neighbours to come back to life", function() {
    var zombie_cell = {x: 1, y: 1};
    var seed = [{x: 0, y: 0}, 
                {x: 0, y: 1}, 
                zombie_cell, 
                {x: 0, y: 2}];
    var w = world(50, 50);
    w.seed(seed);
    w.killCell(zombie_cell.x, zombie_cell.y);

    w.tick();

    expect(w.isCellPopulated(zombie_cell.x, zombie_cell.y)).toBe(true);
  });

  it("Increments the age of cells that are alive", function() {
    var blockOfFour = [{x: 2, y: 2}, 
                       {x: 2, y: 3}, 
                       {x: 3, y: 2}, 
                       {x: 3, y: 3}];

    var w = world(50, 50);
    w.seed(blockOfFour);

    w.tick();

    for(var i = 0; i < blockOfFour.length; i++) {
      var cell = blockOfFour[i];
      expect(w.cellAge(cell.x, cell.y)).toBe(1);
    }
  });


  it("A block of four squares is a still life", function() {
    var seed = [{x: 2, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 2}, 
                {x: 3, y: 3}];
    var w = world(50, 50);
    w.seed(seed);

    w.tick();
    w.tick();

    expect(w.populationSize()).toBe(4);
    assertCellsAreVisible(w, seed);
  });

  it("A beehive is a still life", function() {
    var seed = [{x: 2, y: 1}, 
                {x: 3, y: 1}, 
                {x: 1, y: 2}, 
                {x: 4, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 3}];
    var w = world(50, 50);
    w.seed(seed);

    w.tick();
    w.tick();

    expect(w.populationSize()).toBe(6);
    assertCellsAreVisible(w, seed);
  });

  it("A boat is a still life", function() {
    var seed = [{x: 2, y: 1}, 
                {x: 3, y: 1}, 
                {x: 1, y: 2}, 
                {x: 4, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 3}]

    var w = world(50, 50);
    w.seed(seed);

    for(var i = 0; i < 100; i++) {
      w.tick();
    }

    expect(w.populationSize()).toBe(6);
    assertCellsAreVisible(w, seed);
  });
  
});

function assertCellsAreVisible(aWorld, cells) {
  for(var i = 0; i < cells.length; i++) {
    expect(aWorld.isCellPopulated(cells[i].x, cells[i].y)).toBe(true);
  }
}
