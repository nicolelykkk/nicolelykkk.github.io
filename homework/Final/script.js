URL = "https://coronavirus-19-api.herokuapp.com/countries";

function fetchData() {

    d3.json(URL, function(error, data) {
    console.log(data);

    var data = []
    data.push(data);

    })

};

fetchData(); 

// d3.csv("./data/covid_19.csv").then(function(data) {

//     var width = document.querySelector("#chart").clientWidth;
//     var height = document.querySelector("#chart").clientHeight;
//     var margin = {top: 50, left: 150, right: 50, bottom: 150};

//     var filtered_data = data.filter(function(d) {
//         return d.Country === "Japan";
//     })
//     console.log(filtered_data);

//     var svg = d3.select("#chart")
//         .append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     var Amount = {
//         min: d3.min(filtered_data, function(d) { return +d.lifeExp; }),
//         max: d3.max(filtered_data, function(d) { return +d.lifeExp; })
//     };


// });