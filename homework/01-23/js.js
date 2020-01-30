            var realtimeURL = "https://whiteboard.datawheel.us/api/google-analytics/realtime/random";
            var frequency = 1 * 1000;

            var dataMax = 5;
            var data = [];

            var width = 1500;
            var height = window.innerHeight / 2;

            var margin = {top: 50, left: 150, right: 50, bottom: 150};

            var svg = d3.select("#chart")
                .attr("width", width)
                .attr("height", height);
        
            var barWidth = 100;

            var yAxis = svg.append("g")
                .attr("class","axis")
                .attr("transform", `translate(${margin.left},0)`)

            var xAxis = svg.append("g")
                .attr("class","axis")
                .attr("transform", `translate(0,${height-margin.bottom})`)

            function fetchData() {
        
                d3.json(realtimeURL, function(error, users) {
                    
                        var dataObject = {
                            users: users,
                            timestamp: new Date()
                        };
                        
                        // var formatTime = d3.timeFormat("%B %d, %Y");
                        //     formatTime(new Date);

                        data.unshift(dataObject);
                        if (data.length > dataMax) {
                            data.pop();
                        }
                        console.log(data);

                        var maximum = d3.max(data, function(d) {
                            return d.users;
                        });

                        var x = d3.scaleLinear()
                            .domain([dataMax, 1]) //domain comes before range
                            .range([margin.left, width - barWidth]);

                        var barHeight = d3.scaleLinear()
                            .domain([0, maximum])
                            // .range([0, height]);
                            .range([height-margin.bottom, margin.top]);

                        var xScale = d3.axisBottom()
                            .scale(x)
                            .tickFormat(function(d) {
                                if (d % 1) return "";
                                if (data[d - 1]) return data[d - 1].timestamp;
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
                            // .attr("height", 0)
                            // .attr("y", height)
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
                            // .attr("height", function(d){
                            //     return barHeight(d.users);
                            // })
                            // .attr("y", function(d){
                            //     var h = barHeight(d.users);
                            //     return height - h;
                            // })
                            .attr("height", function(d){
                                return barHeight(0)-barHeight(d.users);
                            })
                            .attr("y", function(d){
                                return barHeight(d.users);
                            })
                            .attr("x", function(d, i){
                                return x( i + 1 );
                        });

                        bars.exit()
                            // .transition().duration(frequency / 2)
                            // .attr("height", 0)
                            // .attr("y", height)
                            // .remove();
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