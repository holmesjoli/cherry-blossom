import { uniqueArray } from "./helper_functions.js";

// Title Creates the standard deviations legend
function sdLegend(width, legendHeight, margin, xScale, yScale, sdFillScale, sd) {

    const legend = d3.select("#sd-legend")
        .append("svg")
        .attr("width", width)
        .attr("height", legendHeight);

    sd.forEach(function(d, i) {

        legend
            .append("rect")
            .attr("x", margin.left + (xScale.bandwidth()+2)*i)
            .attr("y", 0)
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", sdFillScale(d))
            .attr("fill-opacity", .25)

        legend
            .append("text")
            .attr("x", margin.left + (xScale.bandwidth())*i + xScale.bandwidth()/2)
            .attr("y", yScale.bandwidth()/2)
            .text(d)
    });
}

// Title Creates the temperature legend
function colorLegend(width, legendHeight, margin, fillScale, temp, r) {

    const legend = d3.select("#color-legend")
        .append("svg")
        .attr("width", width)
        .attr("height", legendHeight);

    temp.forEach(function(d, i) {

        legend
            .append("circle")
            .attr("cx", 10 + 50*i)
            .attr("cy", 15)
            .attr("r", 10)
            .attr("fill", fillScale(d))

        legend
            .append("text")
            .attr("x", 10 + 50*i)
            .attr("y", 40)
            .text(d)
    });
}

export function drawVis(data, dates, params) {

    let width = window.innerWidth*.8;
    let chartHeight = window.innerHeight*.85;
    let legendHeight = window.innerHeight*.15;
    const sd = ["1", "2", "3"];
    const temp = [">=9", ">=6 & <9", ">=3 & <6", "<3"];
    const margin = {top: 20, left: 50, right: 10, bottom: 50};
    const r = 5;

    let centuries = uniqueArray(data, "century");
    let days = uniqueArray(dates, "date").sort(function(a, b) {return a - b});

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", chartHeight);

    const xScale = d3.scaleBand()
        .domain(days)
        .range([margin.left, width-margin.right])
        .padding(0.05);

    const yScale = d3.scaleBand()
        .domain(centuries)
        .range([chartHeight-margin.bottom, margin.top])
        .padding(0.05);

    const fillScale = d3.scaleOrdinal()
        .domain(temp)
        .range(["#ED0A7E", "#F17098", "#F7ACB4", "#FEE5D4"]);

    const sdFillScale = d3.scaleOrdinal()
        .domain(sd)
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
        // .force('charge', d3.forceManyBody().strength(0)) // send nodes away from eachother
        .force('center', d3.forceCenter(width / 2, chartHeight / 2)) // pull nodes to a central point
        .force('x', d3.forceX().x(function (d) {
            return xScale(+d.date);
        }).strength(.1))
        .force('y', d3.forceY().y(function (d) {
            return yScale(+d.century);
        }).strength(.1))
        .force('collision', d3.forceCollide().radius(r).strength(1))
        .on('tick', ticked);

    function ticked() {

        var u = svg
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 0)
            .attr("fill", function(d) { return fillScale(d.temp_bin); })
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y - margin.bottom; });

        u
            .transition()
            .delay(function(d) {return d.i*params.speed})
            .attr("r", r)
    }

    sdLegend(width*.5, legendHeight, margin, xScale, yScale, sdFillScale, sd);
    colorLegend(width*.5, legendHeight, margin, fillScale, temp, r);
}