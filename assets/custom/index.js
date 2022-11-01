var body = d3.select("body").node().getBoundingClientRect();

var w = body.width;
var h = 500;
var projection = d3.geo.albersUsa()
    .translate([w / 2, h / 2])
    .scale([1000]);
var path = d3.geo.path()
    .projection(projection);

var getColor = function (value) {
    return value > 300 ? '#002c4b' :
        value > 280 ? '#003e69' :
            value > 270 ? '#004778' :
                value > 250 ? '#005087' :
                    value > 220 ? '#005996' :
                        value > 210 ? '#1969a0' :
                            value > 190 ? '#327aab' :
                                value > 140 ? '#4c8ab5' : '#669bc0';
}

var color = ["#002c4b","#003e69","#004778","#005087","#005996","#1969a0","#327aab","#4c8ab5","#669bc0"];
var legendText = ["> 300", "280 - 300", "270 - 280", "250 - 270", "220 - 250", "210 - 220", "190 - 210", "140 - 190", "140 <"];

var svg = d3.select("#map")
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + w + " " + h);

var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("assets/data/us-states.json", function (json) {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "2")
        .style("fill", function (d) {

            var value = parseInt(d.properties.paid_employer_2020);
            return getColor(value);
        })
        .on("mouseover", function (d) {
            str = '<div style="width:100%; border-bottom:1px solid #000; font-weight:bold; text-align:center;">' + d.properties.name + '</div>'
            str += '<p>2020 Private Health Insurance Total Spending: $' + d.properties.spend_2020 + '</p><p>2020 Percent of Medicare Paid by Employers to Hospitals: ' + parseFloat(d.properties.paid_employer_2020).toFixed(2) + '%</p><p>2019 Percent of Medicare Rate for Commercial Break Even: ' + d.properties.medicare_rent_2019 + '%<p>';
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html(str)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })

        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
    var legend = d3.select("#map").append("svg")
        .attr("class", "legend")
        .attr("width", 140)
        .attr("height", 180)
        .selectAll("g")
        .data(color)
        .enter()
        .append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .data(color)
        .style("fill", function (d) { return d; });

    legend.append("text")
        .data(legendText)
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) { return d; });

});
