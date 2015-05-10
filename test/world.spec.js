var requirejs = require('requirejs');
var assert = requirejs('assert');

var cell = requirejs('lib/cell');
var utilities = requirejs('lib/utilities');
var world = requirejs('lib/world');

describe("A new world", function() {
  it("Accepts grid dimensions", function() {
    var width = 50;
    var height = 80;

    var w = new world(width, height);

    assert.equal(width, w.width());
    assert.equal(height, w.height());
  });

  it("Has an initial tick count of zero", function() {
    var w = new world(50, 50);

    assert.equal(0, w.tickCount());
  });

  it("Has an initial population of zero", function() {
    var w = new world(50, 50);

    assert.equal(0, w.populationSize());
  });

  it("Has only dead cells", function() {
    var w = new world(50, 50);

    assert.equal(50 * 50, w.deadCellCount());
  });

  it("Accepts a seed", function() {
    var w = new world(50, 50);

    w.seed([{x: 0, y:0}]);

    assert.equal(1, w.populationSize());
  }); 

  it("Can populate a cell", function() {
    var w = new world(50, 50);

    w.populateCell(1, 1);

    assert.equal(1, w.populationSize());
    assert.equal(true, w.isCellPopulated(1, 1));
  });

  it("Can tick", function() {
    var w = new world(50, 50);

    w.tick();

    assert.equal(1, w.tickCount());
  });

  it("Can be reset", function() {
    var w = new world(50, 50);

    w.populateCell(1, 1);

    w.reset();

    assert.equal(0, w.tickCount());
    assert.equal(0, w.populationSize());
  });

  it("Can distinguish a dead cell from an empty cell", function() {
    var w = new world(50, 50);
    w.seed([{x: 0, y: 0},
            {x: 1, y: 1}]);

    w.killCell(1, 1);

    assert.equal(true, w.isCellPopulated(0, 0));
    assert.equal(false, w.isCellDead(0, 0));
    assert.equal(false, w.isCellEmpty(0, 0));
    assert.equal(false, w.isCellPopulated(1, 1));
    assert.equal(true, w.isCellDead(1, 1));
    assert.equal(false, w.isCellEmpty(1, 1));
    assert.equal(false, w.isCellEmpty(2, 2));
  });
});

describe("A tick", function() {
  it("Causes a solitary cell to die", function() {
    var w = new world(50, 50);
    w.seed([{x: 0, y:0}]);
    w.tick();

    assert.equal(0, w.populationSize());
  });

  it("Keeps track of dead cells", function() {
    var width = 50;
    var height = 50;
    var w = new world(width, height);
    var dead_cell_one = {x: 4, y: 4};
    var dead_cell_two = {x: 12, y: 1};
    var dead_cell_three = {x: 2, y: 2};
    w.seed([dead_cell_one, dead_cell_two, dead_cell_three]);

    w.tick();

    assert.equal(0, w.populationSize());
    assert.equal(width * height, w.deadCellCount());
  }); 

  it("Causes any cell with no live neighbours to die", function() {
    var w = new world(50, 50);
    w.seed([{x: 0, y: 0}, 
                {x: 10, y: 10}, 
                {x: 4, y: 6}]);
    w.tick();

    assert.equal(0, w.populationSize());
  });

  it("Causes a cell with only one live neighbour to die", function() {
    var w = new world(50, 50);
    w.seed([{x: 0, y: 0}, {x: 0, y: 1}]);
    
    w.tick();

    assert.equal(0, w.populationSize());
  });

  it("Allows a cell with two live neighbours to survive", function() {
    var w = new world(50, 50);
    var survivor = {x: 1, y: 1};
    w.seed([survivor, 
                {x: 0, y: 0},
                {x: 2, y: 2}]);

    w.tick();

    assert.equal(1, w.populationSize());
    assert.equal(true, w.isCellPopulated(survivor.x, survivor.y));
  });

  it("Allows a cell with two live diagonal neighbours to survive", function() {
    var w = new world(50, 50);
    var survivor = {x: 2, y: 2};
    w.seed([survivor, 
                {x: 3, y: 3},
                {x: 1, y: 1}]);

    w.tick();

    assert.equal(1, w.populationSize());
    assert.equal(true, w.isCellPopulated(survivor.x, survivor.y));
  });

  it("Causes a cell with more than three live neighbours to die", function() {
    var will_die = {x: 1, y: 2};
    var w = new world(50, 50);
    w.seed([{x: 1, y: 1}, 
                will_die, 
                {x: 2, y: 1}, 
                {x: 2, y: 2}, 
                {x: 0, y: 3}]);

    w.tick();

    assert.equal(false, w.isCellPopulated(will_die.x, will_die.y));
  });

  it("Causes a dead cell with three live neighbours to come back to life", function() {
    var zombie_cell = {x: 1, y: 1};
    var seed = [{x: 0, y: 0}, 
                {x: 0, y: 1}, 
                zombie_cell, 
                {x: 0, y: 2}];
    var w = new world(50, 50);
    w.seed(seed);
    w.killCell(zombie_cell.x, zombie_cell.y);

    w.tick();

    assert.equal(true, w.isCellPopulated(zombie_cell.x, zombie_cell.y));
  });

  it("Increments the age of cells that are alive", function() {
    var blockOfFour = [{x: 2, y: 2}, 
                       {x: 2, y: 3}, 
                       {x: 3, y: 2}, 
                       {x: 3, y: 3}];

    var w = new world(50, 50);
    w.seed(blockOfFour);

    w.tick();

    for(var i = 0; i < blockOfFour.length; i++) {
      var cell = blockOfFour[i];
      assert.equal(1, w.cellAge(cell.x, cell.y));
    }
  });


  it("A block of four squares is a still life", function() {
    var seed = [{x: 2, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 2}, 
                {x: 3, y: 3}];
    var w = new world(50, 50);
    w.seed(seed);

    w.tick();
    w.tick();

    assert.equal(4, w.populationSize());
    assertCellsAreVisible(w, seed);
  });

  it("A beehive is a still life", function() {
    var seed = [{x: 2, y: 1}, 
                {x: 3, y: 1}, 
                {x: 1, y: 2}, 
                {x: 4, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 3}];
    var w = new world(50, 50);
    w.seed(seed);

    w.tick();
    w.tick();

    assert.equal(6, w.populationSize());
    assertCellsAreVisible(w, seed);
  });

  it("A boat is a still life", function() {
    var seed = [{x: 2, y: 1}, 
                {x: 3, y: 1}, 
                {x: 1, y: 2}, 
                {x: 4, y: 2}, 
                {x: 2, y: 3}, 
                {x: 3, y: 3}]

    var w = new world(50, 50);
    w.seed(seed);

    for(var i = 0; i < 100; i++) {
      w.tick();
    }

    assert.equal(6, w.populationSize());
    assertCellsAreVisible(w, seed);
  });
  
});

function assertCellsAreVisible(aWorld, cells) {
  for(var i = 0; i < cells.length; i++) {
    assert.equal(true, aWorld.isCellPopulated(cells[i].x, cells[i].y));
  }
}
