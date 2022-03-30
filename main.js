const files = {
    bloom: {
        pth: "./data/data.csv",
        parse: function(j) {
            return {
                AD: j.AD,
                data: j.date,
                reconstructed: j.reconstructed,
                data_type_code: j.data_type_code,
                century: +j.century,
                temp_bin: j.temp_bin,
                date_as_date: j.date_as_date
            }
        },
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

    let centuries = uniqueArray(data, "century").sort(function(a, b) {a - b});

    addDivs("chart-container", centuries.length);

    console.log(centuries);
}
