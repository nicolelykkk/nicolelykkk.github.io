// Data goes here!!!!

URL = "https://api.covid19api.com/summary";

var width = document.querySelector("#banner").clientWidth;
var height = document.querySelector("#banner").clientHeight;

var svg = d3.select("#viz")
        .attr("width", width)
        .attr("height", height);

    svg.select("#ocean")
        .attr("width", width)
        .attr("height", height);

                var margin = {
                top: 20,
                right: 150,
                bottom: 100,
                left: 50
                };

                var chartWidth = width - margin.left - margin.right;
                var chartHeight = height - margin.top - margin.bottom;

                var scaleWidth = 300;
                var scaleHeight = 20;
                var scaleX = margin.left + chartWidth / 2 - (scaleWidth / 2);
                var scaleY = margin.top + chartHeight + 40;
                
                var scale = svg.select("#scale")
                .attr("transform", "translate(" + scaleX + ", " + scaleY + ")");
                
                scale.select("#scaleRect")
                .attr("width", scaleWidth)
                .attr("height", scaleHeight);

                var legendX = margin.left + chartWidth;
                var legendY = margin.top;
                var legendSize = 20;
                var legendPadding = 10;

                var legend = svg.select("#legend")
                    .attr("transform", "translate(" + legendX + ", " + legendY + ")");


var map = svg.select("#map");
    
    function fetchData() {

        d3.json(URL, function(error, Numbers) {
        console.log(Numbers);

            var Numbers = []
            Numbers.push(Numbers);

            d3.json("./world-alpha3.json", function(error, world) {

                var countriesColor = d3.scaleSequential(d3.interpolatePlasma)
                    .domain([0, 10]);

                var legendRects = legend.selectAll("rect")
                    .data(Numbers);

                var legendRectsEnter = legendRects.enter().append("rect");

                legendRects.merge(legendRectsEnter)
                    .attr("x", legendPadding)
                    .attr("y", function(d, i) {
                    return i * legendSize + i * legendPadding;
                    })
                    .attr("width", legendSize)
                    .attr("height", legendSize)
                    .attr("fill", countriesColor);

                var legendTexts = legend.selectAll("text")
                    .data(Numbers);

                var legendTextsEnter = legendTexts.enter().append("text")
                    .attr("baseline-shift", "-100%");

                legendTexts.merge(legendTextsEnter)
                    .attr("x", legendPadding + legendSize + legendPadding / 2)
                    .attr("y", function(d, i) {
                    return i * legendSize + i * legendPadding;
                    })
                    .text(function(d) {
                    return d;
                    });

                // svg.select("#colorGradient").selectAll("stop")
                //     .data(stops).enter().append("stop")
                //     .attr("offset", function(d) {
                //         return d * 100 + "%";
                //     })
                //     .attr("stop-color", function(d) {
                //         return barColor(d * maximum);
                //     });

                var gradientScale = d3.scaleLinear()
                    .domain([0, 10])
                    .range([0, scaleWidth]);

                var gradientAxis = d3.axisBottom(gradientScale);

                scale.select("#scaleAxis")
                    .attr("transform", "translate(0, " + scaleHeight + ")")
                    .transition()
                    .call(gradientAxis);


                var geoJSON = topojson.feature(world, world.objects.countries);

                geoJSON.features = geoJSON.features.filter(function(d) {
                    return d.id !== "ATA";
                });

                var projection = d3.geoMercator()
                    .fitSize([width, height], geoJSON);

                var path = d3.geoPath()
                    .projection(projection);

                // console.log(geoJSON);
                // console.log(width);
                // console.log(height);

                var countries = map.selectAll("path")
                    .data(geoJSON.features);

                countries.enter().append("path")
                    .attr("d", path)
                    .attr("fill", function(d) {
                        return countriesColor(d.users);
                    })
                    .attr("stroke", "grey");

                // var points = [
                //     {"name": "Boston", "coords": [-71.0589, 42.3601]}
                // ];

                // var circles = map.selectAll("circle")
                //     .data(points);

                // circles.enter().append("circle")
                //     .attr("transform", function(d) {
                //     return "translate(" + projection(d.coords) + ")";
                //     })
                //     .attr("r", 10)
                //     .attr("fill", "#33558b");

                        // // The svg
                        // var svg = d3.select("svg"),
                        //     width = +svg.attr("width"),
                        //     height = +svg.attr("height");

                        // // Map and projection
                        // var path = d3.geoPath();
                        // var projection = d3.geoMercator()
                        //     .scale(70)
                        //     .center([0,20])
                        //     .translate([width / 2, height / 2]);

                        // // Data and color scale
                    


            });
                    

        });


        

        }

        fetchData(); 





// Scrolly goes here!!!!!

        // using d3 for convenience
        var main = d3.select("main");
        var scrolly = main.select("#scrolly");
        var figure = scrolly.select("figure");
        var article = scrolly.select("article");
        var step = article.selectAll(".step");

        // initialize the scrollama
        var scroller = scrollama();

        // generic window resize listener event
        function handleResize() {
            // 1. update height of step elements
            var stepH = Math.floor(window.innerHeight * 0.75);
            step.style("height", stepH + "px");

            var figureHeight = window.innerHeight / 2;
            var figureMarginTop = (window.innerHeight - figureHeight) / 2;

            figure
            .style("height", figureHeight + "px")
            .style("top", figureMarginTop + "px");

            // 3. tell scrollama to update new element dimensions
            scroller.resize();
        }

        // scrollama event handlers
        function handleStepEnter(response) {
            console.log(response);
            // response = { element, direction, index }

            // add color to current step only
            step.classed("is-active", function(d, i) {
            return i === response.index;
            });

            // update graphic based on step
            if (response.index === 0){
                drawLineChart("Asia excl. China")
            } 
            if (response.index === 1){
                drawLineChart("United States")
            } 
            if (response.index === 2){
                drawLineChart("Italy")
            } 
            if (response.index === 3){
                drawLineChart("Spain")
            };


        }

        function setupStickyfill() {
            d3.selectAll(".sticky").each(function() {
            Stickyfill.add(this);
            });
        }

        function init() {
            setupStickyfill();

            // 1. force a resize on load to ensure proper dimensions are sent to scrollama
            handleResize();

            // 2. setup the scroller passing options
            // 		this will also initialize trigger observations
            // 3. bind scrollama event handlers (this can be chained like below)
            scroller
            .setup({
                step: "#scrolly article .step",
                offset: 0.33,
                debug: false
            })
            .onStepEnter(handleStepEnter);

            // setup resize event
            window.addEventListener("resize", handleResize);
        }

        // kick things off
        // init();










        var fullData;

        d3.csv("./data/COVID1.csv", function(error, data) {
                console.log(data);

            fullData = data;

            init();




        });



        function drawLineChart(country) {


            var lineChartWidth = document.querySelector("#lineChart").clientWidth;
            var lineChartHeight = document.querySelector("#lineChart").clientHeight;
            var lineChartMargin = {top: 50, left: 100, right: 50, bottom: 50};

            var filtered_data = fullData.filter(function(d){
                return d.Entity === country;
            });

            var lineChart = d3.select("#lineChart")
                // .append("svg")
                .attr("width", lineChartWidth)
                .attr("height", lineChartHeight);

            var Confirmed = {
                min: d3.min(filtered_data, function(d) { return +d.Confirmed; }),
                max: d3.max(filtered_data, function(d) { return +d.Confirmed; })
            };

            var Day = {
                min: d3.min(filtered_data, function(d) { return new Date(d.Date); }),
                max: d3.max(filtered_data, function(d) { return new Date(d.Date); })
            };

            var xScale = d3.scaleLinear()
                .domain([Day.min, Day.max])
                .range([lineChartMargin.left, lineChartWidth-lineChartMargin.right]);

            var yScale = d3.scaleLinear()
                .domain([Confirmed.min, Confirmed.max])
                .range([lineChartHeight-lineChartMargin.bottom, lineChartMargin.top]);

            var line = d3.line()
                .x(function(d) { return xScale(new Date(d.Date)); })
                .y(function(d) { return yScale(d.Confirmed); })
                .curve(d3.curveLinear);

            var xAxis = lineChart.select("#xAxis")
                .attr("class","axis")
                .attr("transform", `translate(0,${lineChartHeight-lineChartMargin.bottom})`)
                .call(d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")));

            var yAxis = lineChart.select("#yAxis")
                .attr("class","axis")
                .attr("transform", `translate(${lineChartMargin.left},0)`)
                .transition()
                .duration(500)
                .delay(200)
                .call(d3.axisLeft().scale(yScale));

            // var path = lineChart.append("path")
            //     .datum(filtered_data)
            //     .attr("d", function(d) { return line(d); })
            //     .attr("stroke","#33558b")
            //     .attr("fill","none")
            //     .attr("stroke-width",2);

            var xAxisLabel = lineChart.append("text")
                .attr("class","axisLabel")
                .attr("x", lineChartWidth/2)
                .attr("y", lineChartHeight-lineChartMargin.bottom/2 + 15)
                .text("Date");

            var yAxisLabel = lineChart.append("text")
                .attr("class","axisLabel")
                .attr("transform","rotate(-90)")
                .attr("x",-lineChartHeight/2 - 50)
                .attr("y",lineChartMargin.left/2 - 10)
                .text("Confirmed Numbers");

            var u = lineChart.selectAll(".lineTest")
                .data([filtered_data]);

            // var path = d3.line()
            //     .x(function(d) { return xScale(new Date(d.Date)); })
            //     .y(function(d) { return yScale(d.Confirmed); })

            u.enter().append("path")
                .attr("class","lineTest")
            .merge(u)
                .transition()
                .duration(1000)
            .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5)
            console.log("hello");

            u.exit()
                .transition()
                .duration(1000)
                .remove();

};





