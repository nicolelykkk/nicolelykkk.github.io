    var promises = [
        d3.csv("./data/bird-conservation-areas.csv",parseCSV), 
        d3.json("./geojson/nys.json")
    ];


    Promise.all(promises).then(function(data) {


    var conversationData = data[0];


    var nys = data[1];


    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    var projection = d3.geoAlbers()
        .translate([width/2, height/2])
        .center([-71.0589,42.3601])
        .scale(1500)
        .fitExtent([[20,20], [940,480]], nys);


    var geoPath = d3.geoPath().projection(projection);


    svg.selectAll("path")
        .data(nys.features)
        .enter()
        .append("path")
            .attr("fill", "lightgrey")
            .attr("stroke", "none")
            .attr("d", geoPath); 


    conversationData = conversationData.sort(function(a,b) { return a.year - b.year; });


    var slider = d3.select("#selectYear");

    slider
        .property("min", conversationData[0].year)
        .property("max", conversationData[conversationData.length-1].year)
        .property("value", conversationData[conversationData.length-1].year);

    var selectedYear = slider.property("value");


    var yearLabel = svg.append("text")
        .attr("class", "yearLabel")
        .attr("x", 25)
        .attr("y", height - 100)
        .text(selectedYear);
    

    var rScale = d3.scaleSqrt()
        .domain([0, 50])
        .range([0, 25]);


    function updateMap(year) {

        var filtered_data = conversationData.filter(function(d) {
            return d.year == year;
        });

        var c = svg.selectAll("circle")
            .data(filtered_data, function(d) { return d.area; });

        c.enter().append("circle")
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];
            }).attr("r", 0)
            .attr("opacity", 0.7)
            .attr("fill", "#7abd74")
        .merge(c)
            .transition()
            .duration(500)
            .attr("cx", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[0];
            }).attr("cy", function(d) {
                var proj = projection([d.longitude, d.latitude]);
                return proj[1];
            }).attr("r", 10)
            .attr("opacity", 0.7)
            .attr("fill", "#7abd74");

        c.exit()
            .transition()
            .duration(500)
            .attr("r", 0)
            .remove();

        yearLabel.text(year);

        svg.selectAll("circle")
            .on("mouseover", function(d){ 
                var cx = +d3.select(this).attr("cx") + 75;
                var cy = +d3.select(this).attr("cy") + 135;

                tooltip.style("visibility", "visible")
                    .style("left", cx + "px")  
                    .style("top", cy + "px")                      
                    .html(d.area + "<br>" + d.date.toLocaleDateString("en-US") + "<br><img src='pictures/" + d.images + "' width=350 height=225>");

                svg.selectAll("circle")
                    .attr("opacity", 0.2);

                d3.select(this)
                    .attr("opacity", 0.7);

            }).on("mouseout", function(d) {
                tooltip.style("visibility", "hidden");

                svg.selectAll("circle")
                    .attr("opacity", 0.7);
            })
    }


    updateMap(selectedYear);


    slider.on("input", function() {
        var year = this.value;
        console.log(year);

        selectedYear = year;
        updateMap(selectedYear);
    })
    

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");
    

});


function parseCSV(data) {
    var d = {};
    d.area = data.Area;
    d.images = data.Images;
    d.latitude = +data.Latitude;
    d.longitude = +data.Longitude;
    d.date = new Date(data.Date);
    d.year = d.date.getFullYear();

    return d;

}


