var requirejs = require('requirejs');
var assert = requirejs('assert');
var cell = requirejs('lib/cell');

describe("A cell", function() {
  it("Is alive", function() {
    var c = cell();

    assert.equal(true, c.isAlive());
  });

  it("Can die", function() {
    var c = cell();
    c.die();

    assert.equal(false, c.isAlive());
    assert.equal(0, c.age());
  });

  it("Can resurrect", function() {
    var c = cell(0, 0);
    c.die();

    c.resurrect();

    assert.equal(true, c.isAlive());
  });

  it("Has an age of 0 after resurrection", function() {
    var c = cell(0, 0);
    c.tick();
    c.die();

    c.resurrect();

    assert.equal(0, c.age());
  });

  it("Has an x value", function() {
    var c = cell(2, 3);
    
    assert.equal(2, c.x());
  });

  it("Has a y value", function() {
    var c = cell(4, 5);
    
    assert.equal(5, c.y());
  });

  it("Has it's own identity", function() {
    var first = cell(4, 5);
    var second = cell(6, 7);
  
    assert.equal(4, first.x());
    assert.equal(5, first.y());

    assert.equal(6, second.x());
    assert.equal(7, second.y());
  });

  it("Has an age", function() {
    var c = cell(1, 1);
    
    assert.equal(0, c.age());
  });

  it("Increases in age when ticked", function() {
    var c = cell(1, 1);

    c.tick();

    assert.equal(1, c.age());
  });
});
