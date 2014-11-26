var CANVAS_ELEMENT_ID = "game_of_life";
var CELL_SIZE_IN_PIXELS = 10;
var GRID_WIDTH_IN_CELLS = 80;
var GRID_HEIGHT_IN_CELLS = 40;

var _canvas;
var _context;
var _simulation;
var _intervalId;

$(function() {
  prepareSimulation();
});

$('#game_of_life').mousedown(function(e) {
  var cellCoordinates = windowToCellCoordinates(e.pageX, e.pageY);
  _simulation.populate_cell(cellCoordinates.x, cellCoordinates.y);
  updateView();
});

$("#start_button").click(function () {
  _intervalId = window.setInterval(function() { nextTick(); }, 1000);
});

$("#pause_button").click(function() {
  window.clearInterval(_intervalId);
});

$("#reset_button").click(function () {
  _simulation.reset();
  updateView();
});

var updateStatus = function updateStatus() {
  $("#current_tick").html(_simulation.get_tick_count());
  $("#current_population").html(_simulation.get_population_size());
}

function windowToCellCoordinates(x, y) {
  var bounding_box = _canvas.getBoundingClientRect();

  var canvas_x = x - bounding_box.left * (_canvas.width / bounding_box.width);
  var cell_x = Math.floor( ( canvas_x / CELL_SIZE_IN_PIXELS ) - 0.5 );

  var canvas_y = y - bounding_box.top * (_canvas.height / bounding_box.height);
  var cell_y = Math.floor( ( canvas_y / CELL_SIZE_IN_PIXELS ) - 0.5 );

  return { x: cell_x, y: cell_y };
}

var prepareSimulation = function prepareSimulation() {
  _simulation = simulation(GRID_WIDTH_IN_CELLS, GRID_HEIGHT_IN_CELLS);
  _simulation.debug();

  prepareCanvas();
  updateView();
}

var nextTick = function nextTick() {
  _simulation.tick();
  _simulation.debug();
  updateView();
}

var prepareCanvas = function prepareCanvas() {
  _canvas = document.getElementById(CANVAS_ELEMENT_ID);
  _canvas.width = GRID_WIDTH_IN_CELLS * CELL_SIZE_IN_PIXELS;
  _canvas.height = GRID_HEIGHT_IN_CELLS * CELL_SIZE_IN_PIXELS;

  _context = _canvas.getContext('2d');
  _context.translate(0.5, 0.5); // shifts lines half a pixel - to avoid blurry lines
  _context.strokeStyle = "#eee";
}

var drawGrid = function drawGrid() {
  var gridWidth = GRID_WIDTH_IN_CELLS * CELL_SIZE_IN_PIXELS;
  var gridHeight = GRID_HEIGHT_IN_CELLS * CELL_SIZE_IN_PIXELS;

  for(var i = 0; i < GRID_WIDTH_IN_CELLS; i++) {
    var start_offset = CELL_SIZE_IN_PIXELS * i;
    var verticalStartPoint = { x: start_offset, y: 0 };
    var verticalEndPoint = { x: start_offset, y: gridHeight };
    drawLine(verticalStartPoint, verticalEndPoint);
  }

  for(var i = 0; i < GRID_HEIGHT_IN_CELLS; i++) {
    var start_offset = CELL_SIZE_IN_PIXELS * i;
    var horizontalStartPoint = { x: 0, y: start_offset };
    var horizontalEndPoint = { x: gridWidth, y: start_offset };
    drawLine(horizontalStartPoint, horizontalEndPoint);
  }
}

var drawCells = function drawCells() {
  for(var i = 0; i < GRID_WIDTH_IN_CELLS; i++) {
    for(var j = 0; j < GRID_HEIGHT_IN_CELLS; j++) {
      if(_simulation.is_cell_populated(i, j)) fillCell(i, j);
      if(_simulation.is_cell_dead(i, j)) clearCell(i, j);
    }
  }
}

var fillCell = function fillCell(x, y) {
  var xCoordinate = x * CELL_SIZE_IN_PIXELS;
  var yCoordinate = y * CELL_SIZE_IN_PIXELS;
  _context.fillRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
}

var clearCell = function clearCell(x, y) {
  var xCoordinate = x * CELL_SIZE_IN_PIXELS;
  var yCoordinate = y * CELL_SIZE_IN_PIXELS;
  _context.clearRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
}

var drawLine = function drawLine(startPoint, endPoint) {
  _context.beginPath();
  _context.moveTo(startPoint.x, startPoint.y);
  _context.lineTo(endPoint.x, endPoint.y);
  _context.closePath();
  _context.stroke();
}

var updateView = function updateView() {
  drawCells();
  drawGrid();
  updateStatus();
}
