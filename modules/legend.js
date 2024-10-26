// Title Creates the temperature legend
function colorLegend(margin, width, height, spacing, fillScale, temp, r) {

    let textScale = d3.scaleOrdinal()
        .domain(temp)
        .range(["greater than 48˚F (9˚C)", "less than 37˚F (3˚C)", "between 37˚F (3˚C) and 43˚F (6˚C)", "between 43˚F (6˚C) and 48˚F (9˚C)"]);

    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    legend
        .append("text")
        .attr("class", "legend--title")
        .attr("y", 12)
        .attr("x", 5)
        .text("temperature");

    temp.forEach(function(d, i) {

        legend
            .append("circle")
            .attr("cy", margin + 20*i -3)
            .attr("cx", 15)
            .attr("r", 3)
            .attr("fill", "#ffffff")
            .attr("stroke-width", 1)
            .attr("stroke", fillScale(d));

        legend
            .append("text")
            .attr("class", "legend--text")
            .attr("y", margin + 20*i)
            .attr("x", 40)
            .text(textScale(d));
    });
}

// Title Creates the standard deviations legend
function sdLegend(margin, width, height, spacing, xScale, yScale, sdFillScale, sd) {

    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    legend
        .append("text")
        .attr("class", "legend--title")
        .attr("y", 12)
        .attr("x", 5)
        .text("standard deviation");

    sd.forEach(function(d, i) {

        legend
            .append("rect")
            .attr("y", margin + 10)
            .attr("x", 5 + spacing*i)
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", sdFillScale(d));

        legend
            .append("text")
            .attr("class", "legend--text")
            .attr("y", margin)
            .attr("x", spacing*i  + xScale.bandwidth()/2)
            .text(d);
    });
}

// Title Creates the median
function medianLegend(margin, width, height, xScale, yScale, sdFillScale, sd) {

    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    legend
        .append("text")
        .attr("class", "legend--title")
        .attr("y", 12)
        .attr("x", 5)
        .text("median");

    legend
        .append("rect")
        .attr("y", margin + 10)
        .attr("x", 5)
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", sdFillScale(3))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2 );

    legend
        .append("text")
        .attr("class", "legend--text")
        .attr("y", margin)
        .attr("x", 5)
        .text("For each century");
}


// Title Draw Legend
// Draws all of the legends
export function drawLegend(fillScale, xScale, yScale, sdFillScale, temp, sd, r) {
    const width = 300;
    const height = 205;
    const margin = 30;
    const spacing = 30;

    colorLegend(margin, width, height, spacing, fillScale, temp, r);
    sdLegend(margin, width, 150, spacing, xScale, yScale, sdFillScale, sd);
    medianLegend(margin, width, 150, xScale, yScale, sdFillScale, sd);
}
