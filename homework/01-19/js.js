var width = 400;
var height = 400;

var margin = {
        top: 25,
        left: 25,
        right: 25,
        bottom: 25
        };

var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
var frequency = 10 * 100; 

function fetchData() {

    d3.json(realtimeURL, function(error, users) {
    console.log(users);

    var data = []
    data.push(users);

    var svg = d3.select("body")
            .append("svg")
            .attr("width",width)
            .attr("height",height);

    var circle = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .style("fill", "#7abd74")
            .style("opacity", 0.7)
            .attr("r", data);

    var circle = d3.selectAll("circle");

    var c = svg.selectAll("circle") 
        .data(data);

    c.enter().append("circle") 
        .attr("cx", 200)
        .attr("cy", 200)
        .attr("fill", "#7abd74")
        .attr("r", data)
    .merge(c)
        .transition()
        .duration(1000)
        .attr("cx", 200)
        .attr("cy", 200)
        .attr("fill", "#7abd74")
        .attr("opacity", 0.7)
        .attr("r", data);
    
    c.exit().remove();

    });
}

fetchData(); 
setInterval(fetchData, frequency);