
/*
    https://www.w3schools.com/graphics/canvas_reference.asp
*/
var canvasElement;
var ctx;
var bar;
var bullets = new Array();
var dir = 0; // -1 = left, 0 = stop, 1 = right

function Bullet() {
    this.location = {
	    "x" : 0,
        "y" : 0
	};
    this.r = 50;
    this.speed = 3;
    this.img = new Image();
    
    this.draw = function() {
	    var x = this.location.x + (bar.getWidth() / 2);

        //ctx.beginPath();
        //ctx.arc(x, this.location.y - this.r - this.r, this.r, 0, 2 * Math.PI);
        //ctx.fill();

        ctx.drawImage(this.img, x, this.location.y - this.r);

        this.location.y = this.location.y - this.speed;
    }

    this.init = function() {
	    var l = bar.getLocation();
	    this.location.x = l.x,
        this.location.y = l.y;

        this.img.src = "sword-s.png";
    }

    this.isBulletGone = function() {
	    return ( this.location.y < 0 ); 
    }
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
	this.barMoveSpeed = 3;
	
	this.init = function() {
		this.setMaxStartLocation();
		this.location.y = this.maxStartLocation.y;
	}
	
	this.getWidth = function() {
		return this.width;
	}
	
	this.getLocation = function() {
		return this.location;
	}
	
	this.moveLeft = function() {
		if( this.location.x > 0 ) {
			this.location.x = this.location.x - this.barMoveSpeed;
		}
		else {
			this.location.x = 0;
		}
	}
	
	this.moveRight = function() {
		if( this.location.x < this.maxStartLocation.x ) {
			this.location.x = this.location.x + this.barMoveSpeed;
		}
		else {
			this.location.x = this.maxStartLocation.x;
		}
	}
	
	this.draw = function() {
		ctx.beginPath();
		ctx.lineWidth = this.thickness;
		ctx.moveTo( this.location.x + this.fromSide, this.location.y - this.fromBottom);
		ctx.lineTo( this.location.x + this.fromSide + this.width, this.location.y - this.fromBottom );
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
	
	if( dir == -1 ) {
		bar.moveLeft();
	}
	else if( dir == 1 ) {
		bar.moveRight();
	}
	
    bar.draw();

    var bulletCount = bullets.length;
    for( var i = 0; i < bulletCount; i = i + 1) {
	    var b = bullets.shift();
	    b.draw();
        if( ! b.isBulletGone()) {
	        bullets.push(b);
        }
    }
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
function keyDownAction( event ) {
	var key = (event.which || event.keyCode);
	
	if( key == 37 ) { 
		dir = -1;
	}
	else if( key == 39 ) {
		dir = 1;
	}
	else if( key == 32 ) {
		var b = new Bullet();
		b.init();
		bullets.push( b );
	}
	
	event.stopPropagation();
}

function keyUpAction(event) {
	var key = (event.which || event.keyCode);
    
    if( key == 37 || key == 39 ) { 
        dir = 0;
    }
}

function init( id ) {
	canvasElement = document.getElementById( id );
    ctx = canvasElement.getContext("2d");
    bar = new Bar();
    bar.init();

    document.onkeydown = keyDownAction;
    document.onkeyup = keyUpAction;

    debugLog("init");
}

function debugLog( a ) {
    console.log( a );
}

