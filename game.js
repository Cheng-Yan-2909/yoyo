
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

class GameBoard {
    
}

class Bomb {
    location = {
        "x" : 0,
        "y" : 0
    };
    
    imgSize = {
        "width" : 23,
        "height" : 59
    };
    
    speed = 1;
    img = new Image();
    
    init() {
        var maxScreenXY = bar.getMaxStartLocation();
        
        this.location.x = Math.floor(Math.random() * 1001) % maxScreenXY.x;

        this.img.src = "bomb-3-s.jpg";
        
        return this;
    }
    
    draw() {
        ctx.drawImage(this.img, this.location.x, this.location.y);

        this.location.y = this.location.y + this.speed;
    }
    
    isBombGone() {
        return (this.location.y > bar.getMaxStartLocation().y );
    }
}

class Bullet {
    location = {
	    "x" : 0,
        "y" : 0
	};
    imgSize = {
        "width" : 24,
        "height" : 50,
        "r" : 5
    };
    speed = 3;
    img = new Image();
    
    draw() {
        //ctx.beginPath();
        //ctx.arc(this.location.x, this.location.y - this.imgSize.r - this.imgSize.r, this.imgSize.r, 0, 2 * Math.PI);
        //ctx.fill();

        ctx.drawImage(this.img, this.location.x, this.location.y - this.imgSize.height - bar.getBarThickness());

        this.location.y = this.location.y - this.speed;
    }

    init() {
	    this.location = bar.getLocation();
        this.location.x = this.location.x + (bar.getWidth() / 2);

        this.img.src = "sword-s.png";
        
        return this;
    }

    isBulletGone() {
	    return ( (this.location.y + this.r) < 0 ); 
    }
}

class Bar {
	
	width = 60;
	thickness = 3;
	location = {
		"x" : 0,
		"y" : 0
	};
	fromBottom = 10;
	fromSide = 5;
	maxStartLocation = {
		"x" : 0,
		"y" : 0
	};
	barMoveSpeed = 2;
    
    getMaxStartLocation() {
        return {
            "x" : this.maxStartLocation.x,
            "y" : this.maxStartLocation.y
        }
    }
	
	init() {
		this.setMaxStartLocation();
		this.location.y = this.maxStartLocation.y;
	}
	
	getWidth() {
		return (this.width + 0);
	}
	
	getLocation() {
		return {
            "x" : this.location.x,
            "y" : this.location.y
        };
	}
    
    getBarThickness() {
        return (this.thickness + 0);
    }
	
	moveLeft() {
		if( this.location.x > 0 ) {
			this.location.x = this.location.x - this.barMoveSpeed;
		}
		else {
			this.location.x = 0;
		}
	}
	
	moveRight() {
		if( this.location.x < this.maxStartLocation.x ) {
			this.location.x = this.location.x + this.barMoveSpeed;
		}
		else {
			this.location.x = this.maxStartLocation.x;
		}
	}
	
	draw() {
		ctx.beginPath();
		ctx.lineWidth = this.thickness;
		ctx.moveTo( this.location.x + this.fromSide, this.location.y - this.fromBottom);
		ctx.lineTo( this.location.x + this.fromSide + this.width, this.location.y - this.fromBottom );
		ctx.stroke();
	}
	
	setMaxStartLocation() {
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

