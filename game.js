
/*
    https://www.w3schools.com/graphics/canvas_reference.asp
*/
var canvasElement;
var ctx;
var bar;
var bullets = new Array();

function Bullet() {
	
}

function Bar() {
	
	this.width = 60;
	this.thickness = 3;
	this.location = {
		"x" : 0,
		"y" : 0
	};
	this.fromBottom = 10;
	this.fromSide = 5;
	this.maxStartLocation = {
		"x" : 0,
		"y" : 0
	};
	this.barMoveSpeed = 5;
	
	this.moveLeft = function() {
		if( this.location.x > 0 ) {
			this.location.x = this.location.x - this.barMoveSpeed;
		}
		else {
			this.location.x = 0;
		}
	}
	
	this.moveRight = function() {
		this.setMaxStartLocation();
		if( this.location.x < this.maxStartLocation.x ) {
			this.location.x = this.location.x + this.barMoveSpeed;
		}
		else {
			this.location.x = this.maxStartLocation.x;
		}
	}
	
	this.draw = function() {
		this.setMaxStartLocation();
		
		ctx.beginPath();
		ctx.lineWidth = this.thickness;
		ctx.moveTo( this.location.x + this.fromSide, this.maxStartLocation.y);
		ctx.lineTo( this.location.x + this.fromSide + this.width, this.maxStartLocation.y + this.location.y);
		ctx.stroke();
	}
	
	this.setMaxStartLocation = function() {
		var size = getCavasSize();

        this.maxStartLocation.y = size.y - this.fromBottom;
        this.maxStartLocation.x = size.x - this.fromSide - this.fromSide - this.width;
        
	}
}

function getCanvasCenter() {
    return { "x" : canvasElement.getBoundingClientRect().width / 2,
             "y" : canvasElement.getBoundingClientRect().height / 2
           };
}

function getCavasSize() {
    return { "x" : canvasElement.getBoundingClientRect().width,
             "y" : canvasElement.getBoundingClientRect().height
           };
}

function clearRec() {
    var c = getCavasSize();
    ctx.clearRect( 0, 0, c.x, c.y );
}

function autoDraw() {
	clearRec();
    bar.draw();
}

function run() {
    window.setInterval(autoDraw, 10);
    debugLog("run");
}

/*

    keys:
       37 => left
       39 => right
       32 => space
*/
function keyAction( event ) {
	var key = (event.which || event.keyCode);
	
	if( key == 37 ) {
		bar.moveLeft(); 
	}
	else if( key == 39 ) {
		bar.moveRight();
	}
	else if( key == 32 ) {
		
	}
}

function init( id ) {
	canvasElement = document.getElementById( id );
    ctx = canvasElement.getContext("2d");
    bar = new Bar();

    document.onkeydown = keyAction;

    debugLog("init");
}

function debugLog( a ) {
    console.log( a );
}

