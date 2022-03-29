// Title Timer
// Build the timer between the days from the data
function timer(date_min, date_max) {
    let start = date_min;
    let end = date_max;
    var counter = start;
    let monthId = document.getElementById('month');
    let dayId = document.getElementById('days');

    function buildTimer() {

        function setTime() {
            if (counter < end) {
                counter++;
                dayId.innerHTML = `${counter}`;
            } else {
                clearInterval(monthId);
                clearInterval(dayId);
            }
        }

        setInterval(setTime, 250);
    };

    document.getElementById("reset").addEventListener("click", function(e) {
        counter = start;
    });

    buildTimer();
}
