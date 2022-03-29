// Title Read path
// param pth str. The path or url to read the data from
// param parse func. A parsing function specific to that data
// param promises array. Empty array
function read(pth, parse, promises) {
    let ext = pth.split(".").pop();

    if (ext === "csv") {
        promises.push(d3.csv(pth, parse));
    } else if (ext === "json" || ext === "geojson") {
        promises.push(d3.json(pth, parse));
    } else {
        console.error("unknown file extension");
    }
}

// Title Timer
// Build the timer between the days from the data
function timer(dates) {

    let datesExtent = d3.extent(dates, function(d) {return +d.i});
    let start = datesExtent[0];
    let end = datesExtent[1];
    var counter = start;
    let monthId = document.getElementById('month');
    let dayId = document.getElementById('days');
    let playPause = document.getElementById("play-pause");
    let playPauseIcon = document.getElementById("play-pause-icon");
    let reset = document.getElementById("reset");

    let play = true;

    function buildTimer() {

        function setTime() {
            if (counter < end) {

                let filteredDates = dates.filter(function(d) {
                    return d.i === counter;
                });
                dayId.innerHTML = `${filteredDates[0].day}`;
                monthId.innerHTML = `${filteredDates[0].month_name}`;

                if (play) {
                    counter++;
                }
            } else {
                clearInterval(monthId);
                clearInterval(dayId);
            }
        }

        setInterval(setTime, 250);
    };

    reset.addEventListener("click", function(e) {
        counter = start;
    });

    playPause.addEventListener("click", function(e) {
        play = !play;

        if (play) {
            playPauseIcon.className = "fa fa-play";
        } else {
            playPauseIcon.className = "fa fa-pause";
        }
    });

    buildTimer();
}
