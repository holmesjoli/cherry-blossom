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

function git(limit, callback, counter) {
    var i = 0;
    var git = setInterval(function () {
        console.log(i);
        if (i === limit - 1) {
            clearInterval(git);
            callback('done');
        }
        i++;
    }, 800);
}

git(5, function (x) {
  console.log(x);
});

// Title Set Date
// param dates
// param counter
// play boolean variable
function setDate(dates, counter, play, speed = 250) {

    setInterval(function() {

        let end = d3.max(dates, function(d) {return +d.i});
        let monthId = document.getElementById('month');
        let dayId = document.getElementById('days');

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
    }, speed)
}

// Title Timer
// Build the timer between the days from the data
function timer(dates) {

    let start = d3.min(dates, function(d) {return +d.i});
    let counter = start;
    let playPause = document.getElementById("play-pause");
    let playPauseIcon = document.getElementById("play-pause-icon");
    let reset = document.getElementById("reset");
    let play = true;

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

    setDate(dates, counter, play);
}

// Title Unique Array
// Returns the unique values of a variable in a dataset as an array
function uniqueArray(data, variable) {
    let all = data.map(function (d) {
        return d[variable];
    });

    return [...new Set(all)];
}

// Title Autopopulation divs
// Param selectorId the selector id
// Param n the number of divs to create
function addDivs(selectorId, n, width, height) {
    let element = "";

    for (let i = 0; i < n; i++) {
        element += `<div width=${width} height=${height} class="century-container"><svg width=${width} height=${height} id="century-${i}"></svg></div>`;
    }

    document.getElementById(selectorId).innerHTML = element;
}