// Title Creates the temperature legend
function colorLegend(margin, width, height, spacing, fillScale, temp, r) {

    let textScale = d3.scaleOrdinal()
        .domain(temp)
        .range(["greater than 48˚F (9˚C)", "less than 37˚F (3˚C)", "between 37˚F (3˚C) and 43˚F (6˚C)", "between 43˚F (6˚C) and 48˚F (9˚C)"]);

    const legend = d3.select("#legend")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    legend
        .append("text")
        .attr("class", "legend--title")
        .attr("y", margin - 30)
        .attr("x", 5)
        .text("Temperature");

    temp.forEach(function(d, i) {

        legend
            .append("circle")
            .attr("cy", margin + spacing*i)
            .attr("cx", 15)
            .attr("r", r*4)
            .attr("fill", "#ffffff")
            .attr("stroke-width", 3)
            .attr("stroke", fillScale(d));

        legend
            .append("text")
            .attr("y", margin + spacing*i)
            .attr("x", 40)
            .text(textScale(d));
    });
}

// Title Creates the standard deviations legend
function sdLegend(margin, width, height, spacing, xScale, yScale, sdFillScale, sd) {

    const legend = d3.select("#legend")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    legend
        .append("text")
        .attr("class", "legend--title")
        .attr("y", margin - 30)
        .attr("x", 5)
        .text("Standard Deviation");

    sd.forEach(function(d, i) {

        legend
            .append("rect")
            .attr("y", margin)
            .attr("x", 5 + spacing*i*1.5)
            .attr("width", xScale.bandwidth()*2.5)
            .attr("height", yScale.bandwidth()*2.5)
            .attr("fill", sdFillScale(d))
            .attr("fill-opacity", .3);

        legend
            .append("text")
            .attr("y", margin - 5)
            .attr("x", 5 + spacing*i*1.5 + xScale.bandwidth()*2.5/2)
            .attr("text-anchor", "middle")
            .text(d);
    });
}

// Title Creates the median
function medianLegend(margin, width, height, xScale, yScale, sdFillScale, sd) {

    const legend = d3.select("#legend")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    legend
        .append("text")
        .attr("class", "legend--title")
        .attr("y", margin - 30)
        .attr("x", 5)
        .text("Median");

    legend
        .append("rect")
        .attr("y", margin)
        .attr("x", 5)
        .attr("width", xScale.bandwidth()*2.5)
        .attr("height", yScale.bandwidth()*2.5)
        .attr("fill", sdFillScale("1"))
        .attr("fill-opacity", .9);

    legend
        .append("text")
        .attr("y", margin - 5)
        .attr("x", 5)
        .text("For each century");
}


// Title Draw Legend
// Draws all of the legends
export function drawLegend(fillScale, xScale, yScale, sdFillScale, temp, sd, r) {
    const width = 300;
    const height = 205;
    const margin = 100;
    const spacing = 30;

    colorLegend(margin, width, height, spacing, fillScale, temp, r);
    sdLegend(margin, width, 150, spacing, xScale, yScale, sdFillScale, sd);
    medianLegend(margin, width, 150, xScale, yScale, sdFillScale, sd);
}
