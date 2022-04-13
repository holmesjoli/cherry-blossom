import { uniqueArray } from "./helper_functions.js";

// Create days label
// Description an array for each date 
// Return array
function daysLabel(days, dates) {
    let days2 = []
    days.forEach(function(d) {

        let x = dates.filter(function(j) {
            return j.date === d;
        });
        days2.push(x[0].day)
    })

    return days2;
}

// Title Simulation
// Description Uses a force simulation to spread the blooms out
export function sim(svg, data, speed, xScale, yScale, fillScale, rStart, rEnd) {

    // let filteredData = data;

    // let filteredData = data.filter(function(d) {
    //     return d.date <= date;
    // })

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    var simulation = d3.forceSimulation(data)
        .force('x', d3.forceX().x(function (d) {
            return xScale(+d.date);
        }).strength(.1))
        .force('y', d3.forceY().y(function (d) {
            return yScale(+d.century);
        }).strength(.1))
        .force('collision', d3.forceCollide().radius(rEnd).strength(1))
        .on('tick', ticked);

    function ticked() {

        var u = svg
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('class', function(d) {return d.data_type_code.replace(/\s/g, '')})
            .attr('cx', function (d) { return d.x + xScale.bandwidth()/2; })
            .attr('cy', function (d) { return d.y + yScale.bandwidth()/2; })
            .attr("fill", "#ffffff")
            .attr('r', 0)
            .attr('opacity', 0);

            u.on('mouseover', function (event, d) {

                tooltip.style("visibility", "visible")
                    .style("left", event.offsetX + "px")
                    .style("top", event.offsetY + "px")
                    .html(`Data collection type: ${d.data_type_code}`);

                let type = d.data_type_code.replace(/\s/g, '');

                let sameType = d3.selectAll("." + type)

                u.attr("opacity", 0.25);
                sameType.attr("opacity", 1).raise()

                d3.select(this).attr("stroke", "#FFFFFF").attr("stroke-width", 1)

            }).on('mouseout', function (event, d) {
                tooltip.style("visibility", "hidden")
                u.attr("opacity", 1);
                d3.selectAll('circle').attr("stroke", null)
            });

        u
            .transition()
            .ease(d3.easeCircleIn)
            .delay(function(d) {return d.i*speed})
            .attr("fill", function(d) { return fillScale(d.temp_bin); })
            .attr("r", rEnd)
            .attr("opacity", 1)
    }
}

// Title Draw grid
// Description draws the grid, and all of the axis labels
export function drawGrid(svg, dates, xScale, yScale, sdFillScale) {

    const width = 500;
    const height = 300;

    const margin = {top: 20, left: 50, right: 10, bottom: 50};
    const innerWidth = width - margin.left - margin.right;
    const xWidth = innerWidth/39;

    let days = uniqueArray(dates, "date").sort(function(a, b) {return a - b});
    let days2 = daysLabel(days, dates);

    const sdFillOpacity = d3.scaleOrdinal()
        .domain(["TRUE", "FALSE"])
        .range([.7, .3]);
    
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickValues(days)
        .tickFormat((d, i) => days2[i]));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    const march = svg.append("text")
        .attr("class","axis--label")
        .attr("x", margin.left + xWidth*5/2)
        .attr("y", height-margin.bottom/2)
        .text("March");

    const april = svg.append("text")
        .attr("class","axis--label")
        .attr("x", margin.left + xWidth*5 + xWidth*30/2)
        .attr("y", height-margin.bottom/2)
        .text("April");

    const may = svg.append("text")
        .attr("class","axis--label")
        .attr("x", margin.left + xWidth*35 + xWidth*4/2)
        .attr("y", height-margin.bottom/2)
        .text("May");

    const yAxisLabel = svg.append("text")
        .attr("class","axis--label")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("Century");

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
}
