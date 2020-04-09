// Data goes here!!!!

// URL = "https://api.covid19api.com/summary";

//         function fetchData() {

//             d3.json(URL, function(error, data) {
//             console.log(data);

//             var data = []
//             data.push(data);

//             var dataObject = {
//                 Country: country,
//                 NewConfirmed: + NewConfirmed,
//                 TotalConfirmed: + TotalConfirmed,
//                 NewDeaths: + NewDeaths,
//                 TotalDeaths: +TotalDeaths,
//                 NewRecovered: + NewRecovered,
//                 TotalRecovered: +TotalRecovered
//             };

//             });

//         }

//         fetchData(); 





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
            // figure.select("").text(response.index + 1);
            // figure.select("svg").updateLineChart1(response.index);!!!


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
        init();











// First line chart goes here!!!!!!
        d3.csv("./data/COVID1.csv", function(error, data) {
                console.log(data);

            var lineChartWidth = document.querySelector("#lineChart").clientWidth;
            var lineChartHeight = document.querySelector("#lineChart").clientHeight;
            var lineChartMargin = {top: 50, left: 100, right: 50, bottom: 50};

            var filtered_data = data.filter(function(d){
                return d.Entity === "Asia excl. China";
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

            var xAxis = lineChart.append("g")
                .attr("class","axis")
                .attr("transform", `translate(0,${lineChartHeight-lineChartMargin.bottom})`)
                .call(d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")));

            var yAxis = lineChart.append("g")
                .attr("class","axis")
                .attr("transform", `translate(${lineChartMargin.left},0)`)
                .call(d3.axisLeft().scale(yScale));


            var path = lineChart.append("path")
                .datum(filtered_data)
                .attr("d", function(d) { return line(d); })
                .attr("stroke","red")
                .attr("fill","none")
                .attr("stroke-width",2);

            var xAxisLabel = lineChart.append("text")
                .attr("class","axisLabel")
                .attr("x", lineChartWidth/2)
                .attr("y", lineChartHeight-lineChartMargin.bottom/2 + 15)
                .text("Date");

            var yAxisLabel = lineChart.append("text")
                .attr("class","axisLabel")
                .attr("transform","rotate(-90)")
                .attr("x",-lineChartHeight/2 - 40)
                .attr("y",lineChartMargin.left/2)
                .text("Confirmed Numbers");

// second line chart will go here!

    var filtered_data1 = data.filter(function(d){
        return d.Entity === "Italy";
    });

    var lineChart1 = d3.select("#lineChart")
        // .append("svg")
        .attr("width", lineChartWidth)
        .attr("height", lineChartHeight);

    var Confirmed1 = {
        min: d3.min(filtered_data1, function(d) { return +d.Confirmed; }),
        max: d3.max(filtered_data1, function(d) { return +d.Confirmed; })
    };

    var Day = {
        min: d3.min(filtered_data1, function(d) { return new Date(d.Date); }),
        max: d3.max(filtered_data1, function(d) { return new Date(d.Date); })
    };

    var line = d3.line()
        .x(function(d) { return xScale(new Date(d.Date)); })
        .y(function(d) { return yScale(d.Confirmed); })
        .curve(d3.curveLinear);

    var xAxis = lineChart1.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${lineChartHeight-lineChartMargin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")));

    var yAxis = lineChart1.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${lineChartMargin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    var path = lineChart1.append("path")
        .datum(filtered_data1)
        .attr("d", function(d) { return line(d); })
        .attr("stroke","green")
        .attr("fill","none")
        .attr("stroke-width",2);

// third line chart will go here!

        var filtered_data1 = data.filter(function(d){
            return d.Entity === "Spain";
        });

        var lineChart2 = d3.select("#lineChart")
            // .append("svg")
            .attr("width", lineChartWidth)
            .attr("height", lineChartHeight);

        var Confirmed1 = {
            min: d3.min(filtered_data1, function(d) { return +d.Confirmed; }),
            max: d3.max(filtered_data1, function(d) { return +d.Confirmed; })
        };

        var Day = {
            min: d3.min(filtered_data1, function(d) { return new Date(d.Date); }),
            max: d3.max(filtered_data1, function(d) { return new Date(d.Date); })
        };

        var line = d3.line()
            .x(function(d) { return xScale(new Date(d.Date)); })
            .y(function(d) { return yScale(d.Confirmed); })
            .curve(d3.curveLinear);

        var xAxis = lineChart2.append("g")
            .attr("class","axis")
            .attr("transform", `translate(0,${lineChartHeight-lineChartMargin.bottom})`)
            .call(d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")));

        var yAxis = lineChart2.append("g")
            .attr("class","axis")
            .attr("transform", `translate(${lineChartMargin.left},0)`)
            .call(d3.axisLeft().scale(yScale));

        var path = lineChart2.append("path")
            .datum(filtered_data1)
            .attr("d", function(d) { return line(d); })
            .attr("stroke","purple")
            .attr("fill","none")
            .attr("stroke-width",2);

// forth line chart will go here!

        var filtered_data1 = data.filter(function(d){
            return d.Entity === "United States";
        });

        var lineChart3 = d3.select("#lineChart")
            // .append("svg")
            .attr("width", lineChartWidth)
            .attr("height", lineChartHeight);

        var Confirmed1 = {
            min: d3.min(filtered_data1, function(d) { return +d.Confirmed; }),
            max: d3.max(filtered_data1, function(d) { return +d.Confirmed; })
        };

        var Day = {
            min: d3.min(filtered_data1, function(d) { return new Date(d.Date); }),
            max: d3.max(filtered_data1, function(d) { return new Date(d.Date); })
        };

        var line = d3.line()
            .x(function(d) { return xScale(new Date(d.Date)); })
            .y(function(d) { return yScale(d.Confirmed); })
            .curve(d3.curveLinear);

        var xAxis = lineChart3.append("g")
            .attr("class","axis")
            .attr("transform", `translate(0,${lineChartHeight-lineChartMargin.bottom})`)
            .call(d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y-%m-%d")));

        var yAxis = lineChart3.append("g")
            .attr("class","axis")
            .attr("transform", `translate(${lineChartMargin.left},0)`)
            .call(d3.axisLeft().scale(yScale));

        var path = lineChart3.append("path")
            .datum(filtered_data1)
            .attr("d", function(d) { return line(d); })
            .attr("stroke","blue")
            .attr("fill","none")
            .attr("stroke-width",2);




        });







// Geomap goes here!!!!!!!!

        var width = document.querySelector("#banner").clientWidth;
        var height = document.querySelector("#banner").clientHeight;

        var svg = d3.select("#viz")
                .attr("width", width)
                .attr("height", height);

            svg.select("#ocean")
                .attr("width", width)
                .attr("height", height);

            var map = svg.select("#map");

            // var zoom = d3.zoom()
            //     .translateExtent([
            //         [0, 0],
            //         [width, height]
            // ])
            //     .scaleExtent([1, 8])
            //     .on("zoom", zoomed);

            // function zoomed() {
            // map.attr("transform", d3.event.transform);
            // }

            // svg.call(zoom)
            // .on("dblclick.zoom", null);

            d3.json("./world-alpha3.json", function(error, world) {

                var geoJSON = topojson.feature(world, world.objects.countries);

                geoJSON.features = geoJSON.features.filter(function(d) {
                    return d.id !== "ATA";
                });

                var projection = d3.geoMercator()
                    .fitSize([width, height], geoJSON);

                var path = d3.geoPath()
                    .projection(projection);

                console.log(geoJSON);
                console.log(width);
                console.log(height);

                var countries = map.selectAll("path")
                    .data(geoJSON.features);

                countries.enter().append("path")
                    .attr("d", path)
                    .attr("fill", "white")
                    .attr("stroke", "grey");

                var points = [
                    {"name": "Boston", "coords": [-71.0589, 42.3601]}
                ];

                var circles = map.selectAll("circle")
                    .data(points);

                circles.enter().append("circle")
                    .attr("transform", function(d) {
                    return "translate(" + projection(d.coords) + ")";
                    })
                    .attr("r", 10)
                    .attr("fill", "#33558b");

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

