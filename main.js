import * as Helper from "./modules/helper_functions.js";
import * as Vis from "./modules/visualization.js";

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
    Helper.read(fl.pth, fl.parse, promises);
}


let svg = d3.select("#chart")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500)

svg.append("g")

var points = [
	[0, 80],
	[100, 100],
	[200, 30],
	[300, 50],
	[400, 40],
	[500, 80]
];

let d = "M12.41,15.53c-.47,17.23,18.76,3.36,2.6-2.12,16.41,6.3,8.57-17.41-1.03-2.82-.09-.09-.15-.15-.27-.21C25.32-2.53-.01-3.71,10.83,10.36,.8-3.52-6.29,19.62,9.59,13.35c0,.09,.03,.18,.06,.24-16.6,4.37,3.05,19.08,2.54,1.94h.21Z"

svg.select('g')
	.selectAll('path')
	.data(points)
	.join('path')
	.attr('transform', function(d) {
		return 'translate(' + d + ')';
	})
    .attr('d', d);


// Promise.all(promises).then(function (values) {
//     draw(values[0], values[1], values[2]);
// });

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
                speed: 500
            }

    Vis.drawVis(data, dates, params);

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

        Helper.setDate(params, function (x) {
        // console.log(x)
        // return x;
    });
}
