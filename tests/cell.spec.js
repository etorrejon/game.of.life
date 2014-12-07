eval(require('fs').readFileSync('src/scripts/utilities.js','utf8'));
eval(require('fs').readFileSync('src/scripts/cell.js','utf8'));

describe("A cell", function() {
  it("Is alive", function() {
    var c = cell();

    expect(c.isAlive()).toBe(true);
  });

  it("Can die", function() {
    var c = cell();
    c.die();

    expect(c.isAlive()).toBe(false);
    expect(c.age()).toBe(0);
  });

  it("Can resurrect", function() {
    var c = cell(0, 0);
    c.die();

    c.resurrect();

    expect(c.isAlive()).toBe(true);
  });

  it("Has an age of 0 after resurrection", function() {
    var c = cell(0, 0);
    c.tick();
    c.die();

    c.resurrect();

    expect(c.age()).toBe(0);
  });

  it("Has an x value", function() {
    var c = cell(2, 3);
    
    expect(c.x()).toBe(2);
  });

  it("Has a y value", function() {
    var c = cell(4, 5);
    
    expect(c.y()).toBe(5);
  });

  it("Has it's own identity", function() {
    var first = cell(4, 5);
    var second = cell(6, 7);
  
    expect(first.x()).toBe(4);
    expect(first.y()).toBe(5);

    expect(second.x()).toBe(6);
    expect(second.y()).toBe(7);
  });

  it("Has an age", function() {
    var c = cell(1, 1);
    
    expect(c.age()).toBe(0);
  });

  it("Increases in age when ticked", function() {
    var c = cell(1, 1);

    c.tick();

    expect(c.age()).toBe(1)
  });
});
