function barChart() {
    var margin = {
            top: 10,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 450 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x0)
        .tickSize(0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var color = d3.scale.ordinal()
        .range(["#ca0020", "#f4a582", "#d5d5d5", "#92c5de", "#0571b0", "#00678"]);

    // var svgC = d3.select(".legends")
    //     // .attr("width", width + margin.left + margin.right)
    //     // .attr("height", height + margin.top + margin.bottom + 50)
    //     // .attr('transform', 'translate(40,200)')
    //     .append("g")
    //     .attr("transform", "translate(0,0)");

    d3.json("media/data.json", function (error, data) {

        var categoriesNames = data.map(function (d) {
            return d.category;
        });
        var sexNames = data[0].values.map(function (d) {
            return d.sex;
        });

        x0.domain(categoriesNames);
        x1.domain(sexNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function (category) {
            return d3.max(category.values, function (d) {
                return d.value;
            });
        })]);

        svgContainerM.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svgContainerM.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)", "translate(0,70)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .text("Value");

        svgContainerM.select('.y').transition().duration(500).delay(1300).style('opacity', '1');

        var slice = svgContainerM.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.category) + ",0)";
            });

        slice.selectAll("rect")
            .data(function (d) {
                return d.values;
            })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) {
                return x1(d.sex);
            })
            .style("fill", function (d) {
                return color(d.sex)
            })
            .attr("y", function (d) {
                return y(0);
            })
            .attr("height", function (d) {
                return height - y(0);
            })
            .on("mouseover", function (d) {
                d3.select(this).style("fill", d3.rgb(color(d.sex)).darker(2));
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", color(d.sex));
            });

        slice.selectAll("rect")
            .transition()
            .delay(function (d) {
                return Math.random() * 1000;
            })
            .duration(1000)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            });

        //Legend
        var legend = svgContainerM.selectAll(".legend")
            .data(data[0].values.map(function (d) {
                return d.sex;
            }).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .style("opacity", "0");

        legend.append("rect")
            .attr("x", width - 80)
            .attr("width", 18)
            .attr("height", 10)
            .style("fill", function (d) {
                return color(d);
            });

        legend.append("text")
            .attr("x", width - 80)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        legend.transition().duration(500).delay(function (d, i) {
            return 1300 + 100 * i;
        }).style("opacity", "1");

    });
}