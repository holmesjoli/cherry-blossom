const files = {
    bloom: {
        pth: "./data/data.csv",
        parse: null,
    },
    dates: {
        pth: "./data/dates.csv",
        parse: null,
    }
};


let promises = [];

for (var key of Object.keys(files)) {
    var fl = files[key];
    read(fl.pth, fl.parse, promises);
}


Promise.all(promises).then(function (values) {
    drawVis(values[0], values[1])
});

function drawVis(data, dates) {

    console.log(data);
    console.log(dates);
    
    timer(dates);
}
