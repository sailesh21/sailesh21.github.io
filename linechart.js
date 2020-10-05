// var CHART_WIDTH = 400;
// var CHART_HEIGHT = 300;

var CHART_WIDTH = 400;
var CHART_HEIGHT = 300;

function drawLineChart(data) {
    var maxValue = 100;
    maxValue = d3.max(data, function (d) {
        return +d.deaths;
    });
    // console.log(maxValue);

    var x = d3.time.scale()
        .range([0, CHART_WIDTH]);

    var y = d3.scale.linear()
        .range([CHART_HEIGHT, 0]);


    var svgContainer_chart = d3.select("body").append("svg")
        .attr("id", "chart")
        .attr("width", 600)
        .attr("height", 600)
        .append("g")
        .attr('transform', 'translate(100,150)');


    var g = d3.select('#chart').select('g');
    d3.select("#chart").append("text").attr("x", 300).attr("y", 40)
        .style("text-anchor", "middle")
        .attr("stroke", "blue")
        .text("Time Series Line Graph")
    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function (d) {
        return +d.deaths;
    }));
    var pathGenerator = d3.svg.line()
        .x(function (d) {
            // console.log(xScale(d.date));
            return x(d.date);
        })
        .y(function (d) {
            return y(d.deaths);

        });


    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").tickSize(6);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").tickSize(6);
    var xGroup = g.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + CHART_HEIGHT + ')')
        .call(xAxis);
    xGroup.append('text')
        .attr('x', 170)
        .attr('y', 40)
        .html('Dates')

    yGroup = g.append('g')
        .attr('class', 'axis')
        .call(yAxis);
    yGroup.append("text")
        .attr("y", -40)
        .attr("x", -40 - (CHART_HEIGHT / 2))
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "center")
        .style("font-size", "16px")
        .text("Number of Deaths");

    g.append('path')
        .style('fill', 'none')
        .style('stroke', 'steelblue')
        .style('stroke-width', '2px')
        .attr('d', pathGenerator(data));
    var div1 = d3.select("body").append("div")
        .attr("class", "tooltip3")
        .style("opacity", 0);
    var marker = svgContainer_chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        //circle radius is increased
        .attr("r", 2.5)
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(+d.deaths);

        })
        .on("click", function (d) {
            d3.selectAll("#points").remove();
            div1.transition()
                .duration(5)
                .style("opacity", 5);
            div1.html("<b>Dated :" + d.orig + "</br>Deaths : " + d.deaths)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
            loadDeathsDay(d.orig);
        })
        .on("mouseover", function (d) {
            d3.selectAll("#points").remove();
            div1.transition()
                .duration(100)
                .style("opacity", 5);
            div1.html("<b>Dated :" + d.orig + "</br>Deaths : " + d.deaths)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");

            loadDeathsDay(d.orig);
        })
        .on("mouseout", function (d) {
            d3.selectAll("#points").remove();
            div1.transition()
                .duration(500)
                .style("opacity", 0);
            getDeaths(1);
        });


}

var parseDate = d3.time.format("%d-%b");

d3.csv('media/deathdays.csv', function (data) {
    data.forEach(function (d) {
        d.orig = d.date;
        d.date = parseDate.parse(d.date);
        // console.log(d.date);
        d.deaths = +d.deaths;
    });


    drawLineChart(data);
});
