// Title Read path
// param pth str. The path or url to read the data from
// param parse func. A parsing function specific to that data
// param promises array. Empty array
export function read(pth, parse, promises) {
    let ext = pth.split(".").pop();

    if (ext === "csv") {
        promises.push(d3.csv(pth, parse));
    } else if (ext === "json" || ext === "geojson") {
        promises.push(d3.json(pth, parse));
    } else if (ext === "svg") {
        promises.push(d3.xml(pth, parse));
    } else {
        console.error("unknown file extension");
    }
}

// Title Set Date
// param params
// param callbaxk
export function setDate(params, callback) {

    let monthId = document.getElementById('month');
    let dayId = document.getElementById('days');

    var git = setInterval(function () {

        if (params.i < params.limit + 1) {

            let filteredDates = params.dates.filter(function(d) {
                return d.i === params.i;
            });

            dayId.innerHTML = `${filteredDates[0].day}`;
            monthId.innerHTML =  `${filteredDates[0].month_name}`;

            callback(`${filteredDates[0].date}`);
            
        } else {
            clearInterval(monthId);
            clearInterval(dayId);
            clearInterval(git);
        }

        if (params.play) {
            params.i++;
        };
    }, params.speed);
}

// Title Unique Array
// Returns the unique values of a variable in a dataset as an array
export function uniqueArray(data, variable) {
    let all = data.map(function (d) {
        return d[variable];
    });

    return [...new Set(all)];
}

// Title Autopopulation divs
// Param selectorId the selector id
// Param n the number of divs to create
export function addDivs(selectorId, n, width, height) {
    let element = "";

    for (let i = 0; i < n; i++) {
        element += `<div width=${width} height=${height} class="century-container"><svg width=${width} height=${height} id="century-${i}"></svg></div>`;
    }

    document.getElementById(selectorId).innerHTML = element;
}