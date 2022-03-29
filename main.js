const files = [
    { "type": "csv", "file": "./data/data.csv" },
    { "type": "csv", "file": "./data/dates.csv" } // dataset of every earthquake on Mar 21, 2022 from here: https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php
];
let promises = [];

files.forEach(function (d) {
    if (d.type == "json") {
        promises.push(d3.json(d.file));
    } else {
        promises.push(d3.csv(d.file));
    }
});

Promise.all(promises).then(function (values) {
    drawVis(values[0], values[1])
});

function drawVis(data, dates) {

    console.log(data);
    console.log(dates);
    
    buildTimer();
}
