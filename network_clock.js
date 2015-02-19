refresh();
setInterval(function() {
    refresh();
}, 60000);

function refresh() {
    d3.select("svg").remove();
    var svg = d3.select("#chart").append("svg").attr("width", 900).attr("height", 600);
    d3.json('data.json', callback(svg));
    return;
}

function current_time() {
    var now = new Date();
    return now.getUTCHours() + now.getUTCMinutes() / 60.0 + now.getUTCSeconds() / 3600.0;
}

function hour_to_angle(hour) {
    return (hour * Math.PI / 12) - (current_time() * Math.PI / 12);
}

function radius(inner, index, offset) {
    return inner + (index - 1) * 20 + offset;
}

function callback(svg) {
    return function(data) {
        var pi = Math.PI;
        var inner = 50;
        var axis_radius = 200;

        var arc = d3.svg.arc().innerRadius(function(d, index) {
            return radius(inner, index + 1, 0);
        }).outerRadius(function(d, index) {
            return radius(inner, index + 1, 15);
        }).startAngle(function(d) {
            return hour_to_angle(d.start);
        }).endAngle(function(d) {
            return hour_to_angle(d.end);
        });

        var chartContainer = svg.append("g").attr('class', 'some_class').attr("transform", "translate(450, 300)");

        var gr = chartContainer.append("g").attr("class", "r axis");

        gr.append("circle").attr("r", axis_radius);

        var ga = chartContainer.append("g").attr("class", "a axis").selectAll("g").data(d3.range(-180, 180, 15.0)).enter().append("g").attr("transform", function(d) {
            return "rotate(" + (d - 90) + ")";
        });

        ga.append("line").attr("x2", axis_radius);

        ga.append("text").attr("x", axis_radius + 6).attr("dy", ".35em").style("text-anchor", function(d) {
            return d < 90 && d > 270 ? "end" : null;
        }).attr("transform", function(d) {
            return d < 90 && d > 270 ? "rotate(180 " + (axis_radius + 6) + ",0)" : null;
        }).text(function(d) {
            return d/15.0 + "h";
        });

        var arcs = chartContainer.selectAll("path").data(data).enter().append("path").attr("d", arc);

        arcs.style("fill", function(d) {
            return d.color;
        });
    };
}