import * as Helper from "./modules/helper_functions.js";
import * as Vis from "./modules/visualization.js";
import * as Legend from "./modules/legend.js";
import { uniqueArray } from "./modules/helper_functions.js";

// File data and parsing functions
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
                day: +j.day,
                i: +j.i,
                century: +j.century,
                sd: j.sd,
                date_is_median: j.date_is_median
            }
        }
    }
};

let promises = [];

for (var key of Object.keys(files)) {
    var fl = files[key];
    Helper.read(fl.pth, fl.parse, promises);
}

Promise.all(promises).then(function (values) {
    draw(values[0], values[1]);
});

// Title Draw
// Description main draw function
function draw(data, dates) {

    let start = d3.min(dates, function(d) {return +d.i});
    let limit = d3.max(dates, function(d) {return +d.i});
    let i = start;
    let play = true;
    let days = uniqueArray(dates, "date").sort(function(a, b) {return a - b});
    let centuries = uniqueArray(data, "century");
    const margin = {top: 30, left: 50, right: 10, bottom: 50};
    const padding = .05;
    const width = 1000;
    const height = 550;
    const temp = [">=9", ">=6 & <9", ">=3 & <6", "<3"];
    const sd = ["1", "2", "3"];
    const rStart = 0;
    const rEnd = 3;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        // .attr("viewBox", `0 0 ${width} ${height}`)
        // .attr("preserveAspectRatio", "xMidYMid meet");

    const xScale = d3.scaleBand()
        .domain(days)
        .range([margin.left, width-margin.right])
        .padding(padding);

    const yScale = d3.scaleBand()
        .domain(centuries)
        .range([height-margin.bottom, margin.top])
        .padding(padding);

    const sdFillScale = d3.scaleOrdinal()
        .domain(sd)
        .range(["#99C5DC", "#6494BA", "#286699"]);

    const fillScale = d3.scaleOrdinal()
        .domain(temp)
        .range(["#ED0A7E", "#F17098", "#F7ACB4", "#FEE5D4"]);

    let params = {
                dates: dates, 
                limit: limit, 
                play: play, 
                i: i,
                speed: 1000
            }

    Vis.drawGrid(svg, dates, xScale, yScale, sdFillScale);
    Legend.drawLegend(fillScale, xScale, yScale, sdFillScale, temp, sd, rEnd);
    Vis.sim(svg, data, params.speed, xScale, yScale, fillScale, rStart, rEnd);

    const dispatch = d3.dispatch("params");

    // dispatch event handlers
    dispatch.on("params", ()=>{
        params.play = play;
    });

    d3.select("#reset")
        .on("click", function() {
            params.i = start;
        });

    Helper.setDate(params, function (date) {
    });
}
