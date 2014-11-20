var CANVAS_ELEMENT_ID = 'game_of_life';
var CELL_SIZE_IN_PIXELS = 10;

function startSimulation() {
  var context = createContext(CANVAS_ELEMENT_ID);
  drawBoard(context);
}


function drawBoard(context) {
  drawGrid(context);
}

function populateCell(context, position) {
  context.fillRect(position.x, position.y, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
}

function drawGrid(context) {
  var gridWidth = context.canvas.width;
  var gridHeight = context.canvas.height;
  var numberOfGridLines = gridWidth / CELL_SIZE_IN_PIXELS;

  for(var i = 0; i < numberOfGridLines; i++) {
    var start_offset = CELL_SIZE_IN_PIXELS * i;
    log("start_offset: {offset}".supplant({ offset: start_offset }));

    var verticalStartPoint = { x: start_offset, y: 0 };
    var verticalEndPoint = { x: start_offset, y: gridHeight };

    var horizontalStartPoint = { x: 0, y: start_offset };
    var horizontalEndPoint = { x: gridWidth, y: start_offset };

    drawLine(context, verticalStartPoint, verticalEndPoint);
    drawLine(context, horizontalStartPoint, horizontalEndPoint);
  }
}

function createContext(canvasElementId) {
  var canvas = document.getElementById(canvasElementId)
  var context = canvas.getContext('2d');
  context.translate(0.5, 0.5); // shifts lines half a pixel - to avoid blurry lines
  context.strokeStyle = "#eee";
  return context;
}

function log(message) {
  $("#log").prepend( "<p>{m}</p>".supplant({m: message}) ); 
}

function drawLine(context, startPoint, endPoint) {
  log("drawing line from ({x1}, {y1}) to ({x2}, {y2})".supplant({ x1: startPoint.x + 0.5, 
                                                                  y1: startPoint.y + 0.5, 
                                                                  x2: endPoint.x + 0.5, 
                                                                  y2: endPoint.y + 0.5}));

  context.beginPath();
  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(endPoint.x, endPoint.y);
  context.closePath();
  context.stroke();
}

