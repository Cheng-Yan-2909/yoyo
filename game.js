
/*
    https://www.w3schools.com/graphics/canvas_reference.asp
*/
var canvasElement;
var ctx;
var bar;
var bullets = new Array();
var bombs = new Array();
var dir = {
    "left" : 0,
    "right" : 0
};
var firing = 0;
var fireRate = 300;
var firingTrigger = 0;
var addBombRate = 3000;

function Bomb() {
    this.location = {
        "x" : 0,
        "y" : 0
    };
    
    this.imgSize = {
        "width" : 23,
        "height" : 59
    };
    
    this.speed = 1;
    this.img = new Image();
    
    this.init = function() {
        maxScreenXY = bar.getMaxStartLocation();
        
        this.location.x = Math.floor(Math.random() * 1001) % maxScreenXY.x;

        this.img.src = "bomb-3-s.jpg";
        
        return this;
    }
    
    this.draw = function() {
        ctx.drawImage(this.img, this.location.x, this.location.y);

        this.location.y = this.location.y + this.speed;
    }
    
    this.isBombGone = function() {
        return (this.location.y > bar.getMaxStartLocation().y );
    }
}

function Bullet() {
    this.location = {
	    "x" : 0,
        "y" : 0
	};
    this.r = 50;
    this.speed = 3;
    this.img = new Image();
    
    this.draw = function() {
        //ctx.beginPath();
        //ctx.arc(x, this.location.y - this.r - this.r, this.r, 0, 2 * Math.PI);
        //ctx.fill();

        ctx.drawImage(this.img, this.location.x, this.location.y - this.r - bar.getBarThickness());

        this.location.y = this.location.y - this.speed;
    }

    this.init = function() {
	    this.location = bar.getLocation();
        this.location.x = this.location.x + (bar.getWidth() / 2);

        this.img.src = "sword-s.png";
        
        return this;
    }

    this.isBulletGone = function() {
	    return ( (this.location.y + this.r) < 0 ); 
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
	this.barMoveSpeed = 2;
    
    this.getMaxStartLocation = function() {
        return {
            "x" : this.maxStartLocation.x,
            "y" : this.maxStartLocation.y
        }
    }
	
	this.init = function() {
		this.setMaxStartLocation();
		this.location.y = this.maxStartLocation.y;
	}
	
	this.getWidth = function() {
		return (this.width + 0);
	}
	
	this.getLocation = function() {
		return {
            "x" : this.location.x,
            "y" : this.location.y
        };
	}
    
    this.getBarThickness = function() {
        return (this.thickness + 0);
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
	
	if( dir.left == 1 ) {
		bar.moveLeft();
	}
	else if( dir.right == 1 ) {
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
    
    var bombCount = bombs.length;
    for( var i = 0; i < bombCount; i = i + 1 ) {
        var b = bombs.shift();
        b.draw();
        if( ! b.isBombGone() ) {
            bombs.push(b);
        }
    }
}

function fireSword() {
    if( firing ) {
        bullets.push( (new Bullet()).init() );
        firingTrigger = setTimeout( fireSword, fireRate);
    }
}

function createBombs() {
    bombs.push( (new Bomb()).init() );
    setTimeout( createBombs, addBombRate);
}

function run() {
    window.setInterval(autoDraw, 10);
    setTimeout( createBombs, addBombRate);
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
		dir.left = 1;
	}
	if( key == 39 ) {
		dir.right = 1;
	}
	if( key == 32 ) {
        if( firing == 0 ) {
            firing = 1;
            fireSword();
        }
	}
}

function keyUpAction(event) {
	var key = (event.which || event.keyCode);
    
    if( key == 37 ) { 
        dir.left = 0;
    }
    if( key == 39 ) {
        dir.right = 0;
    }
    if( key == 32 ) {
        clearTimeout( firingTrigger );
	    firing = 0;
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

