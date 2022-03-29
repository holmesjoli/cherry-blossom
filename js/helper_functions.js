// Title Timer
// Build the timer between the days from the data
function timer(dates) {
    let datesExtent = d3.extent(dates, function(d) {return +d.i});

    let start = datesExtent[0];
    let end = datesExtent[1];
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
