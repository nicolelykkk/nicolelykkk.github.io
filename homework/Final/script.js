URL = "https://api.covid19api.com/summary";

function fetchData() {

    d3.json(URL, function(error, data) {
    console.log(data);

    var data = []
    data.push(data);

    })

};

fetchData(); 


var svg = d3.select("#viz")
        .attr("width", width)
        .attr("height", height);

    svg.select("#ocean")
    .attr("width", width)
    .attr("height", height);

    var map = svg.select("#map");

    var zoom = d3.zoom()
    .translateExtent([
        [0, 0],
        [width, height]
    ])
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

    function zoomed() {
    map.attr("transform", d3.event.transform);
    }

    svg.call(zoom)
    .on("dblclick.zoom", null);

    d3.json("../topojson/world-alpha3.json", function(error, world) {

    var geoJSON = topojson.feature(world, world.objects.countries);

    geoJSON.features = geoJSON.features.filter(function(d) {
        return d.id !== "ATA";
    });

    var projection = d3.geoMercator()
        .fitSize([width, height], geoJSON);

    var path = d3.geoPath()
        .projection(projection);

    var countries = map.selectAll("path")
        .data(geoJSON.features);

    countries.enter().append("path")
        .attr("d", path)
        .attr("fill", "#004400")
        .attr("stroke", "#008800");

    var points = [
        {"name": "Boston", "coords": [-71.0589, 42.3601]},
        {"name": "London", "coords": [-0.1278, 51.5074]}
    ];

    var circles = map.selectAll("circle")
        .data(points);

    circles.enter().append("circle")
        .attr("transform", function(d) {
        return "translate(" + projection(d.coords) + ")";
        })
        .attr("r", 10)
        .attr("fill", "#cc0000");

    });
