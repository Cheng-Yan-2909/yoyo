
function Runner() {

    this.funcList = new Array();
    
    this.addFunc = function( name, args ) {
        this.funcList.push( { "name" : name, "args" : args } );
    }

    this.run = function() {
        var self = this;
        if( this.funcList.length > 0 ) {
            var func = this.funcList.shift();
            var funcName = func["name"];
            var funcArgs = func["args"];
            
            try {
                 funcName( funcArgs );
            }
            catch( err ) {
                console.log( "Error function: " + funcName );
                console.log( err );
            }
        }

        setTimeout( function() { self.run(); }, 10 );
    }
}

var runner = new Runner();

setTimeout( function(){ runner.run(); }, 100 );

