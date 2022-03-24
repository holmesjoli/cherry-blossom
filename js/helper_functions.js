var totalSeconds = 0;

function buildTimer() {
    
    function setTime() {
        ++totalSeconds;
        document.getElementById('days').innerHTML = `${totalSeconds} days`;
    };
    
    setInterval(setTime, 100);
};

document.getElementById("reset").addEventListener("click", function(e) {
    totalSeconds = 0;
});
