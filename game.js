
/*
    https://www.w3schools.com/graphics/canvas_reference.asp
*/
var canvasElement;
var ctx;
var bar;
var dir = {
    "left" : 0,
    "right" : 0
};
var firing = 0;
var fireRate = 300;
var firingTrigger = 0;
var addBombRate = 3000;

var gameBoard;

var bombSerialId = 0; // increment

class GameBoard {
    bullets = new Array();
    bulletLocation = [[]];
    bulletRate = 300;
    bombs = new Array();
    bombLocation = [[]];
    bombRate = 3000;
    
    deleteBulletHit( b ) {
        var bulletCurrentLocation = this.getLocationKey(b);
        var bombPointAtBulletHit = this.getPointAtBulletHit(b);
        var bomb = this.bombLocation[bombPointAtBulletHit.x][bombPointAtBulletHit.y];
        var bombIndex = this.bombs.indexOf(bomb);
        var bulletIndex = this.bullets.indexOf(b);
        
        if( bulletIndex > -1 ) {
            this.bullets[bulletIndex] = null;
            delete this.bullets[bulletIndex];
        }
        
        if( bombIndex > -1 ) {
            this.bombs[bombIndex] = null;
            delete this.bombs[bombIndex];
        }

        delete this.bulletLocation[bulletCurrentLocation.x][bulletCurrentLocation.y];
        
        delete this.bombLocation[bombPointAtBulletHit.x][bombPointAtBulletHit.y];
        this.bombLocation[bombPointAtBulletHit.x] = [];
    }
    
    removeBulletFromBoard( b ) {
        var bulletCurrentLocation = this.getLocationKey(b);
        delete this.bulletLocation[bulletCurrentLocation.x][bulletCurrentLocation.y];
    }
    
    removeBombFromBoard( b ) {
        var bombCurrentLocation = this.getLocationKey(b);
        delete this.bombLocation[bombCurrentLocation.x][bombCurrentLocation.y];
        this.bombLocation[bombCurrentLocation.x] = [];
    }
    
    getLocationKey( b ) {
        return b.getLocation();
    }
    
    getPrevLocationKey( b ) {
        return b.getPrevLocation();
    }
    
    addBomb() {
        var b = new Bomb();
        var location = this.getLocationKey(b);
        this.bombs.push(b);
        if( ! this.bombLocation[location.x] ) {
            this.bombLocation[location.x] = [];
        }
        this.bombLocation[location.x][location.y] = b;
    }
    
    addBullet() {
        var b = new Bullet();
        var location = this.getLocationKey(b);
        this.bullets.push(b);
        if( ! this.bulletLocation[location.x] ) {
            this.bulletLocation[location.x] = [];
        }
        this.bulletLocation[location.x][location.y] = b;
    }
    
    updateBombLocation( b ) {
        var preLocation = this.getPrevLocationKey(b);
        var location = this.getLocationKey(b);
        this.bombLocation[preLocation.x][preLocation.y] = null;
        delete this.bombLocation[preLocation.x][preLocation.y];
        if( ! this.bombLocation[location.x] ) {
            this.bombLocation[location.x] = [];
        }
        this.bombLocation[location.x][location.y] = b;
    }
    
    updateBulletLocation( b ) {
        var preLocation = this.getPrevLocationKey(b);
        var location = this.getLocationKey(b);
        this.bulletLocation[preLocation.x][preLocation.y] = null;
        delete this.bulletLocation[preLocation.x][preLocation.y];
        if( ! this.bulletLocation[location.x] ) {
            this.bulletLocation[location.x] = [];
        }
        this.bulletLocation[location.x][location.y] = b;
    }
    
    getPointAtBulletHit( b ) {
        var location = this.getLocationKey(b);
        var bombSize = 23; // see Bomb class, will fix later
        var x = parseInt(location.x - (bombSize/2));
        
        for( var i = 0; i < bombSize; i++ ) {
            if( this.bombLocation[x+i] ) {
                if( this.bombLocation[x+i][location.y] ) {
                    debugLog("bomb '" + this.bombLocation[x+i][location.y].id + "' hit at: (" + (x+i) + "," + location.y + ")")
                    return {
                        x : x + i,
                        y : location.y
                    };
                }
            }
        }
        
        return null;
    }
    
    getObjAtBulletPoint( b ) {
        var p = this.getPointAtBulletHit(b);
        if( p ) {
            return this.bombLocation[p.x][p.y]
        }
        
        return null;
    }
    
    isBulletHit( b ) {
        return !(this.getPointAtBulletHit(b) == null);
    }
}

class Bomb {
    id = 0;
    
    location = {
        "x" : 0,
        "y" : 0
    };
    
    prevLocation = {
        "x" : 0,
        "y" : 0
    }
    
    imgSize = {
        "width" : 23,
        "height" : 59
    };
    
    speed = 1;
    img = new Image();
    
    constructor() {
        var maxScreenXY = bar.getMaxStartLocation();
        
        this.location.x = Math.floor(Math.random() * 1001) % maxScreenXY.x;
        this.img.src = "bomb-3-s.jpg";
        this.id = bombSerialId;
        bombSerialId++;
        
        return this;
    }
    
    init() {
        return this;
    }
    
    draw() {
        ctx.drawImage(this.img, this.location.x, this.location.y);
        
        this.prevLocation.y = this.location.y;
        this.location.y = this.location.y + this.speed;
        
        gameBoard.updateBombLocation(this);
    }
    
    isBombGone() {
        return (this.location.y > bar.getMaxStartLocation().y );
    }
    
    getLocation() {
        return {
            x : this.location.x,
            y : this.location.y
        };
    }
    
    getPrevLocation() {
        return {
            x : this.prevLocation.x,
            y : this.prevLocation.y
        };
    }
}

class Bullet {
    location = {
	    "x" : 0,
        "y" : 0
	};
    
    prevLocation = {
        "x" : 0,
        "y" : 0
    }
    
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

        this.prevLocation.y = this.location.y;
        this.location.y = this.location.y - this.speed;
        
        gameBoard.updateBulletLocation(this);
    }

    constructor() {
	    this.location = bar.getLocation();
        this.location.x = this.location.x + (bar.getWidth() / 2);

        this.img.src = "sword-s.png";
        
        return this;
    }
    
    init() {
        return this;
    }

    isBulletGone() {
	    return ( (this.location.y + this.r) < 0 ); 
    }
    
    getLocation() {
        return {
            x : this.location.x,
            y : this.location.y
        };
    }
    
    getPrevLocation() {
        return {
            x : this.prevLocation.x,
            y : this.prevLocation.y
        };
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
	
	constructor() {
		this.setMaxStartLocation();
		this.location.y = this.maxStartLocation.y;
	}
    
    init() {
        return this;
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

    var bulletCount = gameBoard.bullets.length;
    for( var i = 0; i < bulletCount; i = i + 1) {
	    var b = gameBoard.bullets.shift();
        if( !b ) {
            continue;
        }
        
	    b.draw();
        
        if( gameBoard.isBulletHit(b) ) {
            console.log("A direct hit");
            gameBoard.deleteBulletHit(b)
        }
        else if( ! b.isBulletGone() ) {
	        gameBoard.bullets.push(b);
        }
        else {
            gameBoard.removeBulletFromBoard(b);
        }
    }
    
    var bombCount = gameBoard.bombs.length;
    for( var i = 0; i < bombCount; i = i + 1 ) {
        var b = gameBoard.bombs.shift();
        if( !b ) {
            continue;
        }
        
        b.draw();
        if( ! b.isBombGone() ) {
            gameBoard.bombs.push(b);
        }
        else {
            gameBoard.removeBombFromBoard(b);
        }
    }
}

function fireSword() {
    if( firing ) {
        gameBoard.addBullet();
        firingTrigger = setTimeout( fireSword, fireRate);
    }
}

function createBombs() {
    gameBoard.addBomb();
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
    
    gameBoard = new GameBoard();
    
    bar = new Bar();
    bar.init();
    
    document.onkeydown = keyDownAction;
    document.onkeyup = keyUpAction;

    debugLog("init");
}

function debugLog( a ) {
    console.log( a );
}

