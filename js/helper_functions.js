var totalSeconds = 87;
let intervalId = document.getElementById('days');

function buildTimer() {

    function setTime() {
        if (totalSeconds < 125) {
            totalSeconds++;
            intervalId.innerHTML = `${totalSeconds} days`;
        } else {
            clearInterval(intervalId);
        }
    }

    setInterval(setTime, 100);
};

document.getElementById("reset").addEventListener("click", function(e) {
    totalSeconds = 87;
});
