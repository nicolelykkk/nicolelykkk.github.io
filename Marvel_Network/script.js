d3.csv("./data/mcu6.csv", parseCSV).then(function(data) {

    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;

    var filtered_dataAvengers = data.filter(function(d) {
        return d.affiliation.indexOf("Avengers") >= 0;
    })

    var filtered_dataHydra = data.filter(function(d) {
        return d.affiliation.indexOf("HYDRA") >= 0; 
    })

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    svg.append("svg:image")
        .attr("xlink:href", "pictures/background3.jpeg")
        .attr("width", width);

    var nodes = [];
    data.forEach(function(d) {
        var datum = {};
        datum.category = d.category;
        datum.real_name = d.real_name;
        datum.affiliation = d.affiliation;
        datum.gender = d.gender;
        datum.images = d.images;
        nodes.push(datum);
    });

    var links = [];
    for(var i = 0; i < data.length-1; i++) {
        var showA = data[i];
        var affiliationA = showA.affiliation;
        for(var j = i + 1; j < data.length; j++) {
            var showB = data[j];
            var affiliationB = showB.affiliation;
            var sharedAffiliation = affiliationA.filter(function(d) {
                return affiliationB.includes(d);
            });
            if(sharedAffiliation.length > 0) {
                links.push({source: showA.real_name, target: showB.real_name, affiliation: sharedAffiliation });
            }
        }
    }

    links = links.filter(function(d) {
        return d.affiliation.length > 1;
    });


    var simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(function(d) { return d.real_name; }).distance(50))
      .force("charge", d3.forceManyBody().strength(-20))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(25));

    var link = svg.append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
            .attr("stroke", "#CECECE")
            .attr("stroke-width", 0.8);

    var radius = 8;

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")

    node.append("circle")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill", "grey")
        .attr("r",radius);

    node.append("text")
        .attr("dx", 15)
        .attr("dy", 3.5)
        .attr("fill", "white")
        .attr("font-size", "5pt")
        .text(function(d) { return d.real_name });
            
    simulation.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return `translate(${d.x},${d.y})`; });
        
        node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(50 + radius, Math.min(height - radius, d.y)); });
            
    });

    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class","tooltip");

    node.on("mouseover", function(d) {
        var cx = d.x + 10;
        var cy = d.y + 10;

        tooltip.style("visibility", "visible")
            .style("left", cx + "px")
            .style("top", cy + "px")
            .style("border-radius", "10px")
            .html( "<img src = 'pictures/" + d.images + " ' width=100 height=100 >" +"<br>" + "Name:" + d.real_name + "<br>" + "Affiliation:" + d.affiliation + "<br>" + "Catogory:" + d.category + "<br>" + "Gender:" + d.gender);
        node.selectAll("circle")
            .attr("opacity",0.2);
        node.selectAll("text")
            .attr("opacity", 0.2);
        link.attr("opacity",0.2);

        d3.select(this).select("circle")
            .attr("opacity",1)
            .attr("fill", "#fbf783");

        var connected = link.filter(function(e) {
            return e.source.affiliation === d.affiliation || e.target.affiliation === d.affiliation;
        });

        connected.attr("opacity",1)
                .attr("stroke", "#fbf783")
                .attr("stroke-width", 0.8);
        connected.each(function(e) {
            node.filter(function(f) {
                return f.affiliation === e.source.affiliation || f.affiliation === e.target.affiliation;
            }).selectAll("circle")
                .attr("opacity",1)
                .attr("fill", "#fbf783");
            node.filter(function(f) {
                return f.affiliation === e.source.affiliation || f.affiliation === e.target.affiliation;
            }).selectAll("text")
                .attr("opacity",1)
                .attr("fill", "#fbf783"); 
        });

    }).on("mouseout", function() {
        tooltip.style("visibility","hidden");
        node.selectAll("circle")
            .attr("opacity",1)
            .attr("fill", "grey");
        node.selectAll("text")
            .attr("opacity", 1)
            .attr("fill", "white");
        link.attr("opacity",1)
            .attr("stroke", "grey")
            .attr("stroke-width", 0.8);
    });

    
    d3.select("#button2").on("click", function() {
        node.selectAll("circle").attr("fill","grey");
        node.selectAll("text").attr("fill","white");
    })

    d3.select("#button3").on("click", function() {

        node.selectAll("circle").attr("fill","grey");
        node.selectAll("text").attr("fill","white");

        node.selectAll("circle").filter(function(d) {
            return d.affiliation.indexOf("Avengers") >= 0;
        }).attr("fill","steelblue");

        node.selectAll("text").filter(function(d) {
            return d.affiliation.indexOf("Avengers") >= 0;
        }).attr("fill","steelblue");
    
    })

    d3.select("#button4").on("click", function() {

        node.selectAll("circle").attr("fill","grey");
        node.selectAll("text").attr("fill","white");

        node.selectAll("circle").filter(function(d) {
            return d.affiliation.indexOf("HYDRA") >= 0;
        }).attr("fill","red");
    
        node.selectAll("text").filter(function(d) {
            return d.affiliation.indexOf("HYDRA") >= 0;
        }).attr("fill","red");
    })
    
});

function parseCSV(data) {

    var d = {};
    d.category = data.category;
    d.real_name = data.real_name;
    d.affiliation = data.affiliation;
    d.gender = data.gender;
    d.images = data.images;

    var affiliations = data.affiliation.split(",");

    for(var i = 0; i < affiliations.length; i++) {
        var a = affiliations[i];
        affiliations[i] = a.trim();
    }

    d.affiliation = affiliations;

    return d;

}