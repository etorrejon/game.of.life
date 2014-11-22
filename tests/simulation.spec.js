var fs = require('fs');
fileData = fs.readFileSync('src/simulation.js','utf8');
eval(fileData);


describe("Simulation", function() {
  it("Has an initial tick count of zero", function() {
    var sim = simulation();

    expect(sim.get_tick_count()).toBe(0);
  });

  it("Has an initial population of zero", function() {
    var sim = simulation();

    expect(sim.get_population()).toBe(0);
  });

/*  it("Accepts a seed", function() {
    var sim = simulation();
    sim.seed({x: 0, y:0});

    expect(sim.get_population()).toBe(1);
  }); */

  it("Can tick", function() {
    var sim = simulation();

    sim.tick();

    expect(sim.get_tick_count()).toBe(1);
  });
  
});
