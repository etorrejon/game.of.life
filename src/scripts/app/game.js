define(['jquery', 'lib/utilities', 'lib/world'], 
function($, utilities, world) {

    var CANVAS_ELEMENT_ID = 'game_of_life';
    var CELL_SIZE_IN_PIXELS = 10;
    var GRID_WIDTH_IN_CELLS = 80;
    var GRID_HEIGHT_IN_CELLS = 40;
    var CELL_AGE_COLOR_MULTIPLIER = 5;
    var TICK_INTERVAL_IN_MS = 100;

    var canvas;
    var context;
    var theWorld;
    var intervalId;

    $('#game_of_life').mousedown(function(e) {
        var cellCoordinates = windowToCellCoordinates(e.pageX, e.pageY);
        theWorld.populateCell(cellCoordinates.x, cellCoordinates.y);
        updateView();
    });

    $("#start_button").click(function () {
        intervalId = window.setInterval(function() { nextTick(); }, TICK_INTERVAL_IN_MS);
    });

    $("#pause_button").click(function () {
        window.clearInterval(intervalId);
    });

    $("#reset_button").click(function () {
        theWorld.reset();
        updateView();
    });

    var prepareWorld = function () {
        theWorld = world(GRID_WIDTH_IN_CELLS, GRID_HEIGHT_IN_CELLS);
        theWorld.debug();
        prepareCanvas();
        updateView();
    }

    var prepareCanvas = function () {
        canvas = document.getElementById(CANVAS_ELEMENT_ID);
        canvas.width = GRID_WIDTH_IN_CELLS * CELL_SIZE_IN_PIXELS;
        canvas.height = GRID_HEIGHT_IN_CELLS * CELL_SIZE_IN_PIXELS;

        context = canvas.getContext('2d');
        context.translate(0.5, 0.5); // shift half a pixel to avoid blurry lines
        context.strokeStyle = "#eee";
    }

    var updateStatus = function () {
        $("#current_tick").html(theWorld.tickCount());
        $("#current_population").html(theWorld.populationSize());
    }

    var windowToCellCoordinates = function (x, y) {
        var bounding_box = canvas.getBoundingClientRect();

        var canvas_x = x - bounding_box.left * (canvas.width / bounding_box.width);
        var cell_x = Math.floor( ( canvas_x / CELL_SIZE_IN_PIXELS ) - 0.5 );

        var canvas_y = y - bounding_box.top * (canvas.height / bounding_box.height);
        var cell_y = Math.floor( ( canvas_y / CELL_SIZE_IN_PIXELS ) - 0.5 );

        return { x: cell_x, y: cell_y };
    }

    var nextTick = function () {
        theWorld.tick();
        theWorld.debug();
        updateView();
    }

    var drawGrid = function () {
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

    var drawCells = function () {
        for(var i = 0; i < GRID_WIDTH_IN_CELLS; i++) {
            for(var j = 0; j < GRID_HEIGHT_IN_CELLS; j++) {
                if(theWorld.isCellPopulated(i, j)) fillCell(i, j);
                if(theWorld.isCellDead(i, j)) clearCell(i, j);
            }
        }
    }

    var fillCell = function (x, y) {
        var xCoordinate = x * CELL_SIZE_IN_PIXELS;
        var yCoordinate = y * CELL_SIZE_IN_PIXELS;
        var cell_age = theWorld.cellAge(x, y);

        var color = {
            r: (cell_age * CELL_AGE_COLOR_MULTIPLIER) % 255,
            g: (cell_age * CELL_AGE_COLOR_MULTIPLIER) % 255,
            b: 0
        };

        context.save();
        context.fillStyle = 'rgb({r}, {g}, {b})'.supplant(color);
        context.fillRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
        context.restore();
    }

    var clearCell = function (x, y) {
        var xCoordinate = x * CELL_SIZE_IN_PIXELS;
        var yCoordinate = y * CELL_SIZE_IN_PIXELS;
        context.clearRect(xCoordinate, yCoordinate, CELL_SIZE_IN_PIXELS, CELL_SIZE_IN_PIXELS);
    }

    var drawLine = function (startPoint, endPoint) {
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.closePath();
        context.stroke();
    }

    var updateView = function () {
        drawCells();
        drawGrid();
        updateStatus();
    }

    $(function() { prepareWorld(); });
});
