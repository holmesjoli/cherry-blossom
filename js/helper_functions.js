function timer() {
    let start = 87;
    let end = 125;
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
