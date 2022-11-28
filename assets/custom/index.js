var body = d3.select("body").node().getBoundingClientRect();

var w = body.width;
var h = 500;
var projection = d3.geo.albersUsa()
    .translate([w / 2, h / 2])
    .scale([1000]);
var path = d3.geo.path()
    .projection(projection);

var getColor = function (value) {
    return value > 300 ? '#013F5A' :
        value > 250 ? '#016C99' :
            value > 200 ? '#249FDA' :
                value > 150 ? '#AFD0EE' : '#D5E5F6';
}

var color = ["#013F5A", "#016C99", "#249FDA", "#AFD0EE", "#D5E5F6"];
var legendText = ["> 300", "250 - 300", "200 - 250", "150 - 200", "150 <"];

var svg = d3.select("#map")
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + w + " " + h);

var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("assets/data/data.csv", function (data) {
    d3.json("assets/data/us-states.json", function (json) {

        for (var i = 0; i < data.length; i++) {

            var dataid = data[i].id;

            var dataName = data[i].name;
            var dataCode = data[i].state_code;
            var dataSpend_2020 = data[i].spend_2020;
            var dataPaid_employer_2020 = data[i].paid_employer_2020;
            var dataMedicare_rent_2020 = data[i].medicare_rent_2020;


            for (var j = 0; j < json.features.length; j++) {
                var jsonid = json.features[j].properties.id1;

                if (dataid == jsonid) {
                    json.features[j].properties.name = dataName;
                    json.features[j].properties.state_code = dataCode;
                    json.features[j].properties.spend_2020 = dataSpend_2020;
                    json.features[j].properties.paid_employer_2020 = dataPaid_employer_2020;
                    json.features[j].properties.medicare_rent_2020 = dataMedicare_rent_2020;
                    break;
                }
            }
        }


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
                str += '<p>2020 Private Health Insurance Total Spending: $' + d.properties.spend_2020 + '</p><p>2020 Medicare Paid by Employers to Hospitals: ' + parseFloat(d.properties.paid_employer_2020).toFixed(2) + '%</p><p>2020 Medicare Rate for Commercial Break Even: ' + d.properties.medicare_rent_2020 + '<p>';
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
        var legend = d3.select("#legend").append("svg")
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
});