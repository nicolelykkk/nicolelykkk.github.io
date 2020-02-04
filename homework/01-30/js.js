var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
var frequency = 1 * 1000;

var dataMax = 10;
var data = [];

var width = window.innerWidth - 150;
var height = window.innerHeight / 2;

var margin = {top: 50, left: 150, right: 50, bottom: 150};

var svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

var barWidth = 100;

var yAxis = svg.append("g")
    .attr("class","axis")
    .attr("transform", `translate(${margin.left},0)`);

var xAxis = svg.append("g")
    .attr("class","axis")
    .attr("transform", `translate(0,${height-margin.bottom})`);

function fetchData() {

    d3.json(realtimeURL, function(error, users) {

        var dataObject = {
            users: users,
            timestamp: new Date()
        };
        
        var formatTime = d3.timeFormat("%B %d,%H:%M:%S");

        data.unshift(dataObject);
        if (data.length > dataMax) {
            data.pop();
        }
        console.log(data);

        var maximum = d3.max(data, function(d) {
            return d.users;
        });

        var x = d3.scaleLinear()
            .domain([dataMax, 1])
            .range([margin.left, width - barWidth]);

        var barHeight = d3.scaleLinear()
            .domain([0, maximum])
            .range([height-margin.bottom, margin.top]);

        var xScale = d3.axisBottom()
            .scale(x)
            .tickFormat(function(d) {
                if (d % 1) return "";
                if (data[d - 1]) return formatTime (data[d - 1].timestamp);
                return "";
            });

        xAxis.transition().duration(frequency / 2)
            .call(xScale);

        yAxis.transition().duration(frequency / 2)
            .call(d3.axisLeft().scale(barHeight));

        var bars = svg.selectAll(".bar")
            .data(data, function(d){
                return d.timestamp;
            });

        var enter = bars.enter().append("rect")
            .attr("class", "bar")
            .attr("width", barWidth)
            .attr("height", function (d) {
                return barHeight(0) - barHeight(d.users);
            })
            .attr("y", function (d) {
                return barHeight(d.users);
            })
            .attr("x", function(d, i) {
                return x( i + 1 );
            })
            .attr("fill", "brown");

        bars.merge(enter)
            .transition().duration(frequency / 2)
            .attr("height", function(d){
                return barHeight(0)-barHeight(d.users);
            })
            .attr("y", function(d){
                return barHeight(d.users);
            })
            .attr("x", function(d, i){
                return x( i + 1 );
        });





        var labels = svg.selectAll(".label")
            .data(data, function(d) {
                return d.timestamp;
            });

        var fontSize = 20;

        var enterLabels = labels.enter().append("text")
            .attr("class", "label")
            .attr("font-size", fontSize)
            .attr("y", height)
            .attr("x", function(d, i) {
                return x( i + 1 );
            })
            .attr("width", barWidth)
            .attr("height", 0);

        labels.merge(enterLabels)
            .transition()
            .duration(frequency / 2)
            // .attr("y", function (d, i) {
            //     var h = barHeight(d.users);
            //     return height - ( h - 20);
            // })
            // .attr("x", function (d, i) {
            //     return (x(i + 1)) + (barWidth/2);
            // })
            .attr("height", function(d){
                return barHeight(0)-barHeight(d.users);
            })
            .attr("y", function(d){
                return barHeight(d.users);
            })
            .attr("x", function(d, i){
                return x( i + 1 )
            })
            
        .each(function(d, i) {
            var textElement = d3.select(this);
            textElement.text("");

            var myText = "There are currently " + d.users + " users on your website.";
            var words = myText.split(" ");
            var tspan = textElement.append("tspan");
            var line = 0;

            words.forEach ( function (word) {

                var sentence = tspan.text();
                tspan.text(sentence + " " + word);

                var domElement = tspan.node();
                var tspanWidth = domElement.getBoundingClientRect().width;
                console.log(tspanWidth);

                if (tspanWidth > barWidth) {
                    line++;
                    tspan.text(sentence);
                    tspan = textElement.append("tspan")
                    // .attr("y", fontSize * line )
                    .attr("y", barHeight(d.users) + fontSize * line)
                    .attr("x", x( i + 1 ))
                        .text(word);
                }
            })
        });

            labels.exit().remove();




            bars.exit()
                .transition().duration(frequency / 2)
                .attr("height", function(d){
                    return barHeight(0)-barHeight(d.users);
                })
                .attr("y", function(d){
                    return barHeight(d.users);
                })
                .remove();


    });
};

fetchData();
setInterval(fetchData, frequency);