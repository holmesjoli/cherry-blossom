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
    
    let start = d3.min(dates, function(d) {return +d.i});
    let limit = d3.max(dates, function(d) {return +d.i});
    let i = start;
    let play = true;

    let width = window.innerWidth*.8;
    let height = window.innerHeight*.75;

    let centuries = uniqueArray(data, "century").sort(function(a, b) {a - b});

    addDivs("wrapper", centuries.length, width, (height)/13);

    console.log(centuries);

    let params = {
                dates: dates, 
                limit: limit, 
                play: play, 
                i: i,
                speed: 250
            }

    const dispatch = d3.dispatch("params");

    d3.select("#play-pause")
        .on("click", function() {
            let playPauseIcon = document.getElementById("play-pause-icon");

            play = !play;

            if (play) {
                playPauseIcon.className = "fa fa-play";
            } else {
                playPauseIcon.className = "fa fa-pause";
            }
            dispatch.call("params");
        });

    // dispatch event handlers
    dispatch.on("params", ()=>{
        params.play = play;
    });

    d3.select("#reset")
        .on("click", function() {
            params.i = start;
        });

    setDate(params, function (x) {
        // console.log(x)
        // return x;
    });
}
