
function Clock() {
    weekDayList = [ "Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat" ];

    this.showDate = function( id ) {
        var t = new Date();
        var weekDay = weekDayList[ t.getDay() ]; // 0 is Sunday
        var fullDate = t.getFullYear() + "/" + (t.getMonth() + 1 ) + "/" + t.getDate();
        var time = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();

        document.getElementById( id ).innerHTML = weekDay + ",  " + fullDate + ",  " + time;

        return 1;
    }
}

setTimeout( 
    function() {
        var clock = new Clock();
        runner.addFunc( clock.showDate, "clock" );
    },
    100
);
