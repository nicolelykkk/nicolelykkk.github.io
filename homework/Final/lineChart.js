d3.selectAll("#linechart")
    .on("mousemove", function() {
        d3.select("#tooltip")
        .style("top", d3.event.pageY + 20 + "px")
        .style("left", d3.event.pageX + 20 + "px")
        .text(d.Confirmed);
    })
    .on("mouseout", function() {
        d3.select("#tooltip")
        .style("display", "none");
    });

    //     var tooltip = d3.select("#lineChart")
                                //     .append("div")
                                //     .attr("class","tooltip");
                            
                                //     circle.on("mouseover", function(d){ 
                            
                                //     var cx = +d3.select(this).attr("cx")+20; 
                                //     var cy = +d3.select(this).attr("cy")-15; 
                            
                                //     tooltip.style("visibility","visible")
                                //     .style("left", cx+"px")
                                //     .style("top", cy+"px")
                                //     
                            
                                //     d3.select(this)
                                //     .attr("stroke","#F6C900")
                                //     .attr("stroke-width",2)
                            
                                // }).on("mouseout", function(){
                            
                                //     tooltip.style("visibility", "hidden");
                            
                                //     d3.select(this)
                                //     .attr("stoke","none")
                                //     .attr("stroke-width",0)
                            
                                // })