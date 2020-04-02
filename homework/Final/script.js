URL = "https://api.covid19api.com/summary";

function fetchData() {

    d3.json(URL, function(error, data) {
    console.log(data);

    var data = []
    data.push(data);

    var dataObject = {
        Country: country,
        NewConfirmed: + NewConfirmed,
        TotalConfirmed: + TotalConfirmed,
        NewDeaths: + NewDeaths,
        TotalDeaths: +TotalDeaths,
        NewRecovered: + NewRecovered,
        TotalRecovered: +TotalRecovered
    };

    });

}

fetchData(); 





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
            figure.select("p").text(response.index + 1);
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
                debug: true
            })
            .onStepEnter(handleStepEnter);

            // setup resize event
            window.addEventListener("resize", handleResize);
        }

        // kick things off
        init();












d3.csv("./data/COVID.csv", function(error, data) {
        console.log(data);

    var width = document.querySelector("#barchart1").clientWidth;
    var height = document.querySelector("#barchart1").clientHeight;
    var margin = {top: 50, left: 150, right: 50, bottom: 150};

    var filtered_data = data.filter(function(d){
        return d.Country === "China";
    });

    // var svg = d3.select("#barchart1")
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", height);

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
        .range([margin.left, width-margin.right]);

    var yScale = d3.scaleLinear()
        .domain([Confirmed.min, Confirmed.max])
        .range([height-margin.bottom, margin.top]);

    var line = d3.line()
        .x(function(d) { return xScale(d.Day); })
        .y(function(d) { return yScale(d.Confirmed); })
        .curve(d3.curveLinear);

    var xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));

    var yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


    var path = svg.append("path")
        .datum(filtered_data)
        .attr("d", function(d) { return line(d); })
        .attr("stroke","steelblue")
        .attr("fill","none")
        .attr("stroke-width",2);

    var xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Date");

    var yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("Confirmed Numbers");

});

// var svg = d3.select("#viz")
//         .attr("width", width)
//         .attr("height", height);

//     svg.select("#ocean")
//     .attr("width", width)
//     .attr("height", height);

//     var map = svg.select("#map");

//     var zoom = d3.zoom()
//     .translateExtent([
//         [0, 0],
//         [width, height]
//     ])
//     .scaleExtent([1, 8])
//     .on("zoom", zoomed);

//     function zoomed() {
//     map.attr("transform", d3.event.transform);
//     }

//     svg.call(zoom)
//     .on("dblclick.zoom", null);

//     d3.json("../topojson/world-alpha3.json", function(error, world) {

//     var geoJSON = topojson.feature(world, world.objects.countries);

//     geoJSON.features = geoJSON.features.filter(function(d) {
//         return d.id !== "ATA";
//     });

//     var projection = d3.geoMercator()
//         .fitSize([width, height], geoJSON);

//     var path = d3.geoPath()
//         .projection(projection);

//     var countries = map.selectAll("path")
//         .data(geoJSON.features);

//     countries.enter().append("path")
//         .attr("d", path)
//         .attr("fill", "#004400")
//         .attr("stroke", "#008800");

//     var points = [
//         {"name": "Boston", "coords": [-71.0589, 42.3601]},
//         {"name": "London", "coords": [-0.1278, 51.5074]}
//     ];

//     var circles = map.selectAll("circle")
//         .data(points);

//     circles.enter().append("circle")
//         .attr("transform", function(d) {
//         return "translate(" + projection(d.coords) + ")";
//         })
//         .attr("r", 10)
//         .attr("fill", "#cc0000");

//     });

