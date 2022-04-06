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
        }
    },
    flower: {
        pth: "./svg/flower.svg",
        parse: null
    }
};

let promises = [];

for (var key of Object.keys(files)) {
    var fl = files[key];
    read(fl.pth, fl.parse, promises);
}

Promise.all(promises).then(function (values) {
    draw(values[0], values[1], values[2]);
});

function drawVis(data, dates, params) {

    let width = window.innerWidth*.8;
    let chartHeight = window.innerHeight*.85;
    let legendHeight = window.innerHeight*.15;
    const margin = {top: 20, left: 50, right: 10, bottom: 50};

    let centuries = uniqueArray(data, "century");
    console.log(centuries);
    let days = uniqueArray(dates, "date").sort(function(a, b) {return a - b});

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", chartHeight);

    // addDivs("wrapper", centuries.length, width -margin.left - margin.right, (height - margin.top - margin.bottom)/13);

    const xScale = d3.scaleBand()
        .domain(days)
        .range([margin.left, width-margin.right])
        .padding(0.05);

    const yScale = d3.scaleBand()
        .domain(centuries)
        .range([chartHeight-margin.bottom, margin.top])
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
        .attr("transform", `translate(0,${chartHeight-margin.bottom})`)
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

    var simulation = d3.forceSimulation(data)
        .force('x', d3.forceX().x(function (d) {
            return xScale(+d.Rating);
        }).strength(0.1))
        // .force('y', d3.forceY().y(function (d) {
        //     return yScale(d.Country_of_Bean_Origin);
        // }).strength(0.8))
        .force('y', d3.forceY().y(function (d) {
            return chartHeight / 2;
        }).strength(0.8))
        .force('collision', d3.forceCollide().radius(function (d) { // prevent circle overlap when collide
            return 5;
        }).strength(0.8))
        // .force('charge', d3.forceManyBody().strength(-5)) // send nodes away from eachother
        .on('tick', ticked);

    function ticked() {
        // console.log("tick");
        var u = svg
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 5)
            .attr('fill', function (d) {
                return fillScale(d.temp_bin);
            })
            .attr('cx', function (d) {
                return xScale(d.date);
            })
            .attr('cy', function (d) {
                return yScale(d.century);
            });
    }

    // const points = svg.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //         .attr("cx", function(d) { return xScale(d.date); })
    //         .attr("cy", function(d) { return yScale(d.century); })
    //         .attr("r", 0)
    //         .attr("fill", function(d) { return fillScale(d.temp_bin);});

    //     points
    //         .transition()
    //         .delay(function(d) {return d.i*params.speed})
    //         .attr("r", 5)

    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", width)
        .attr("height", legendHeight);
}

function draw(data, dates, flower) {

    console.log(data);
    console.log(dates);
    console.log(flower);
    
    let start = d3.min(dates, function(d) {return +d.i});
    let limit = d3.max(dates, function(d) {return +d.i});
    let i = start;
    let play = true;

    let params = {
                dates: dates, 
                limit: limit, 
                play: play, 
                i: i,
                speed: 1000
            }

    drawVis(data, dates, params);

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
