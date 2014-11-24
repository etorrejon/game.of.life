eval(require('fs').readFileSync('src/utilities.js','utf8'));
eval(require('fs').readFileSync('src/cell.js','utf8'));

describe("A cell", function() {
  it("Is alive", function() {
    var c = cell();

    expect(c.is_alive()).toBe(true);
  });

  it("Can die", function() {
    var c = cell();
    c.die();

    expect(c.is_alive()).toBe(false);
  });

  it("Can resurrect", function() {
    var c = cell();
    c.die();

    c.resurrect();

    expect(c.is_alive()).toBe(true);
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
});
