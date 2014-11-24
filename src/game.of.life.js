var CANVAS_ELEMENT_ID = "game_of_life";
var CELL_SIZE_IN_PIXELS = 10;
var GRID_WIDTH_IN_CELLS = 80;
var GRID_HEIGHT_IN_CELLS = 80;

var _canvas;
var _context;
var _simulation;

$(function() {
  $('#game_of_life').mousedown(function(e) {
    var cellCoordinates = windowToCellCoordinates(e.pageX, e.pageY);
    toggleCellState(cellCoordinates.x, cellCoordinates.y);
    draw(_simulation);
  });
});

function getCurrentTick() {
  return _simulation.get_tick_count();
}

function toggleCellState(x, y) {
  if(_simulation.is_cell_empty(x, y)) {
    _simulation.populate_cell(x, y);
  } else if(_simulation.is_cell_alive(x, y)) {
    _simulation.kill_cell(x, y);
  } else {
    _simulation.resurrect_cell(x, y);
  }
}

function windowToCellCoordinates(x, y) {
  var bounding_box = _canvas.getBoundingClientRect();

  var canvas_x = x - bounding_box.left * (_canvas.width / bounding_box.width);
  var cell_x = Math.floor( ( canvas_x / CELL_SIZE_IN_PIXELS ) - 0.5 );

  var canvas_y = y - bounding_box.top * (_canvas.height / bounding_box.height);
  var cell_y = Math.floor( ( canvas_y / CELL_SIZE_IN_PIXELS ) - 0.5 );

  return {x: cell_x, y: cell_y };
}

function prepareSimulation() {
  prepareCanvas();
  drawGrid();

  var seed = [ {x: 0, y: 0}, 
               {x: 0, y: 1}, 
               {x: 2, y: 2}, 
               {x: 1, y: 0} ];
  _simulation = simulation();
  _simulation.seed(seed);
  _simulation.debug();
  draw(_simulation);
}

function next_tick() {
  _simulation.tick();
  _simulation.debug();
  draw(_simulation);
}

function prepareCanvas() {
  _canvas = document.getElementById(CANVAS_ELEMENT_ID);
  _canvas.width = GRID_WIDTH_IN_CELLS * CELL_SIZE_IN_PIXELS;
  _canvas.height = GRID_HEIGHT_IN_CELLS * CELL_SIZE_IN_PIXELS;

  _context = _canvas.getContext('2d');
  _context.translate(0.5, 0.5); // shifts lines half a pixel - to avoid blurry lines
  _context.strokeStyle = "#eee";
}

function drawGrid() {
  var gridWidth = GRID_WIDTH_IN_CELLS * CELL_SIZE_IN_PIXELS;
  var gridHeight = GRID_HEIGHT_IN_CELLS * CELL_SIZE_IN_PIXELS;

  for(var i = 0; i < GRID_HEIGHT_IN_CELLS; i++) {
    var start_offset = CELL_SIZE_IN_PIXELS * i;
    var verticalStartPoint = { x: start_offset, y: 0 };
    var verticalEndPoint = { x: start_offset, y: gridHeight };
    drawLine(verticalStartPoint, verticalEndPoint);
  }

  for(var i = 0; i < GRID_WIDTH_IN_CELLS; i++) {
    var start_offset = CELL_SIZE_IN_PIXELS * i;
    var horizontalStartPoint = { x: 0, y: start_offset };
    var horizontalEndPoint = { x: gridWidth, y: start_offset };
    drawLine(horizontalStartPoint, horizontalEndPoint);
  }
}

function draw(sim) {
  drawGrid();
  for(var i = 0; i < GRID_WIDTH_IN_CELLS; i++) {
    for(var j = 0; j < GRID_HEIGHT_IN_CELLS; j++) {
      if(sim.is_cell_populated(i, j)) {
        fillCell(i, j);
      }
      else if(sim.is_cell_dead(i, j)) {
        fillDeadCell(i, j);
      }
      else {
        clearCell(i, j);
      }
    }
  }
}

function fillCell(x, y) {
  var xCoordinate = x * CELL_SIZE_IN_PIXELS;
  var yCoordinate = y * CELL_SIZE_IN_PIXELS;
  _context.fillRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
}

function fillDeadCell(x, y) {
  var xCoordinate = x * CELL_SIZE_IN_PIXELS;
  var yCoordinate = y * CELL_SIZE_IN_PIXELS;
  _context.save();
  _context.fillStyle = "#999";
  _context.fillRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
  _context.restore();
}

function clearCell(x, y) {
  var xCoordinate = x * CELL_SIZE_IN_PIXELS;
  var yCoordinate = y * CELL_SIZE_IN_PIXELS;
  _context.clearRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
}

function log(message) {
  $("#log").prepend( "<p>{m}</p>".supplant({m: message}) ); 
}

function drawLine(startPoint, endPoint) {
  log("drawing line from ({x1}, {y1}) to ({x2}, {y2})".supplant({ x1: startPoint.x + 0.5, 
                                                                  y1: startPoint.y + 0.5, 
                                                                  x2: endPoint.x + 0.5, 
                                                                  y2: endPoint.y + 0.5}));

  _context.beginPath();
  _context.moveTo(startPoint.x, startPoint.y);
  _context.lineTo(endPoint.x, endPoint.y);
  _context.closePath();
  _context.stroke();
}
