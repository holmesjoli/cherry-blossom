function buildTimer() {
    var totalSeconds = 0;
    
    function setTime() {
        ++totalSeconds;
        document.getElementById('days').innerHTML = `${totalSeconds} days`;
    };
    
    setInterval(setTime, 100);
};
