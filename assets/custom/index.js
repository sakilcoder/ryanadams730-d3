var body = d3.select("body").node().getBoundingClientRect();

var w = body.width;
var h = 500;
var projection = d3.geo.albersUsa()
    .translate([w / 2, h / 2])
    .scale([1000]);
var path = d3.geo.path()
    .projection(projection);

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

            var value = d.properties.color;
            return value;
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
});
