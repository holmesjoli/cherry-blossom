function timer() {
    var totalSeconds = 87;
    let monthId = document.getElementById('month');
    let dayId = document.getElementById('days');

    function buildTimer() {

        function setTime() {
            if (totalSeconds < 125) {
                totalSeconds++;
                dayId.innerHTML = `${totalSeconds}`;
            } else {
                clearInterval(monthId);
                clearInterval(dayId);
            }
        }

        setInterval(setTime, 250);
    };

    document.getElementById("reset").addEventListener("click", function(e) {
        totalSeconds = 87;
    });

    buildTimer();
}
