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
    draw(values[0], values[1])
});

function drawVis(data) {

    let width = window.innerWidth*.8;
    let height = window.innerHeight*.75;
    const margin = {top: 50, left: 100, right: 50, bottom: 100};

    let centuries = uniqueArray(data, "century").sort(function(a, b) {a - b});
    let days = uniqueArray(data, "date");
    console.log(centuries);

    addDivs("wrapper", centuries.length, width, (height)/13);

    const xScale = d3.scaleBand()
        .domain(days)
        .range([margin.left, width-margin.right])
        .padding(0.5);

    const yScale = d3.scaleLinear()
        .domain([50, lifeExp.max])
        .range([height-margin.bottom, margin.top]);
    
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

}

function draw(data, dates) {

    console.log(data);
    console.log(dates);
    
    let start = d3.min(dates, function(d) {return +d.i});
    let limit = d3.max(dates, function(d) {return +d.i});
    let i = start;
    let play = true;

    let params = {
                dates: dates, 
                limit: limit, 
                play: play, 
                i: i,
                speed: 500
            }

    drawVis(data);

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
