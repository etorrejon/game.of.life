var CANVAS_ELEMENT_ID = 'game_of_life';
var CELL_SIZE_IN_PIXELS = 10;
var GRID_WIDTH_IN_CELLS = 80;
var GRID_HEIGHT_IN_CELLS = 80;

var _context;
var _cells = [];

function startSimulation() {
  initializeSimulation(); 
  var seed = [ {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2} ];
  populateCells(seed);
}

function initializeSimulation(gridSize) {
  initializeCanvas();
  drawGrid();
}

function initializeCanvas() {
  var canvas = document.getElementById(CANVAS_ELEMENT_ID);
  canvas.width = GRID_WIDTH_IN_CELLS * CELL_SIZE_IN_PIXELS;
  canvas.height = GRID_HEIGHT_IN_CELLS * CELL_SIZE_IN_PIXELS;

  _context = canvas.getContext('2d');
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

function populateCells(cellPositions) {
  var i;
  for(i = 0; i < cellPositions.length; i++) {
    populateCell(cellPositions[i]);
  }
}

function populateCell(position) {
  _cells[_cells.length] = position;
  var xCoordinate = position.x * CELL_SIZE_IN_PIXELS;
  var yCoordinate = position.y * CELL_SIZE_IN_PIXELS;
  _context.fillRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
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
