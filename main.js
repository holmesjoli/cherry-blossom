const files = {
    bloom: {
        pth: "./data/data.csv",
        parse: null,
    },
    dates: {
        pth: "./data/dates.csv",
        parse: function(j) {
            return {
                date: j.date,
                month: j.month,
                month_name: j.month_name,
                day: j.day,
                i: +j.i
            }
        },
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
