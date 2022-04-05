const files = {
    bloom: {
        pth: "./data/data.csv",
        parse: function(j) {
            return {
                AD: j.AD,
                date: +j.date,
                reconstructed: j.reconstructed,
                data_type_code: j.data_type_code,
                century: +j.century,
                temp_bin: j.temp_bin,
                date_as_date: j.date_as_date,
                i: +j.i
            }
        },
    },
    dates: {
        pth: "./data/dates.csv",
        parse: function(j) {
            return {
                date: +j.date,
                month: j.month,
                month_name: j.month_name,
                day: j.day,
                i: +j.i,
                century: +j.century,
                sd: j.sd,
                date_is_median: j.date_is_median
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

function drawVis(data, dates) {

    let width = window.innerWidth*.8;
    let height = window.innerHeight*.9;
    const margin = {top: 20, left: 50, right: 10, bottom: 50};

    let centuries = uniqueArray(data, "century");
    console.log(centuries);
    let days = uniqueArray(dates, "date").sort(function(a, b) {return a - b});

    const svg = d3.select(".main")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // addDivs("wrapper", centuries.length, width -margin.left - margin.right, (height - margin.top - margin.bottom)/13);

    const xScale = d3.scaleBand()
        .domain(days)
        .range([margin.left, width-margin.right])
        .padding(0.05);

    const yScale = d3.scaleBand()
        .domain(centuries)
        .range([height-margin.bottom, margin.top])
        .padding(0.05);

    const fillScale = d3.scaleOrdinal()
        .domain([">=9", ">=6 & <9", ">=3 & <6", "<3"])
        .range(["#ED0A7E", "#F17098", "#F7ACB4", "#FEE5D4"]);

    const sdFillScale = d3.scaleOrdinal()
        .domain(["1", "2", "3"])
        .range(["#99C5DC", "#6494BA", "#286699"]);

    const sdFillOpacity = d3.scaleOrdinal()
        .domain(["TRUE", "FALSE"])
        .range([.7, .3]);
    
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    const bars = svg.selectAll("rect")
        .data(dates)
        .enter()
        .append("rect")
            .attr("x", function(d) { return xScale(d.date); })
            .attr("y", function(d) { return yScale(d.century); })
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", function(d) {return sdFillScale(d.sd); })
            .attr("fill-opacity", function(d) {return sdFillOpacity(d.date_is_median); });

    const points = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.date); })
            .attr("cy", function(d) { return yScale(d.century); })
            .attr("r", 0)
            .attr("fill", function(d) { return fillScale(d.temp_bin);});


        points
            .transition()
            .delay(function(d) {return d.i*500})
            .attr("r", 5)
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

    drawVis(data, dates);

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
