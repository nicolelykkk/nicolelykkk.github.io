var width = window.innerWidth;
var height = window.innerHeight;

var margin = {
        top: 20,
        left: 20,
        right: 100,
        bottom: 50
        };

var chartWidth = width - margin.left - margin.right;
var chartHeight = height - margin.top - margin.bottom;

var svg = d3.select("#chart")
        // .append("svg")
        .attr("width",width)
        .attr("height",height);

var scaleWidth = width;
var scaleHeight = 20;
var scaleX = margin.left + chartWidth / 2 - scaleWidth / 2;
var scaleY = margin.top + 500;

var scale = svg.select("#scale")
.attr("transform", "translate(" + scaleX + "," + scaleY + ")");

scale.select("#scaleRect")
    .attr("width", scaleWidth)
    .attr("height", scaleHeight);

var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
var frequency = 10 * 100; 

function fetchData() {

    d3.json(realtimeURL, function(error, users) {
    console.log(users);

    var data = []
    data.push(users);

    var maximum = d3.max(data, function(d) {
        return d;
    });

    var circleColor = d3.scaleSequential(d3.interpolateRainbow)
    .domain([0, 10]);

    var stops = d3.range(0, 1.25, 0.25) 
    console.log(stops);

    svg.select("#colorGradient").selectAll("stop")
                .data(stops).enter().append("stop")
                .attr("offset", function(d){
                    return d * 100 + "%";
                })
                .attr("stop-color", function(d){
                    return circleColor(d * maximum);
                });

            var gradientScale = d3.scaleLinear()
                .domain([0, maximum])
                .range([0, scaleWidth]);

            var gradientAxis = d3.axisBottom(gradientScale);

            scale.select("#scaleAxis")
            .attr("transform", "translate(0, " + scaleHeight + ")") 
            .transition().duration(frequency / 2)
            .call(gradientAxis);

            
            
    // var circles = svg.select("#shapes").selectAll(".circle")
    // .data(data, function(d) {
    // return d.timestamp;
    // });


    var circle = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", "transparent")
            .attr("r", data);

    var circle = d3.selectAll("circle");

    var c = svg.selectAll("circle") 
        .data(data);

    c.enter().append("circle") 
        .attr("cx", 200)
        .attr("cy", 200)
        .attr("fill", function(d){
            return circleColor(d);
        })
        .attr("r", data)
    .merge(c)
        .transition()
        .duration(1000)
        .attr("cx", 200)
        .attr("cy", 200)
        .attr("fill", function(d){
            return circleColor(d);
        })
        .attr("r", data);
    
    c.exit().remove();


                var circle1 = svg.selectAll("circle1")
                .data(data)
                .enter()
                .append("circle")
                .attr("fill", "transparent")
                .attr("r", data);

                var circle1 = d3.selectAll("circle1");

                var e = svg.selectAll("circle1") 
                .data(data);

                e.enter().append("circle") 
                .attr("cx", width - 200)
                .attr("cy", 200)
                .attr("fill", function(d){
                    return circleColor(d);
                })
                .attr("r", data)
                .merge(e)
                .transition()
                .duration(1000)
                .attr("cx", width - 200)
                .attr("cy", 200)
                .attr("fill", function(d){
                    return circleColor(d);
                })
                .attr("r", data);

                e.exit().remove();
                
    });
}

fetchData(); 
setInterval(fetchData, frequency);