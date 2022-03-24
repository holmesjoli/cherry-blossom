function buildTimer() {
    var totalSeconds = 0;
    
    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    };
    
    function setTime() {
        ++totalSeconds;
        document.getElementById('seconds').innerHTML = pad(totalSeconds % 60);
        document.getElementById('minutes').innerHTML = pad(parseInt(totalSeconds / 60));
    };
    
    setInterval(setTime, 1000);
};
