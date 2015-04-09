var dicts = {'educacion': 150, 'sanidad': 50};

Template.scanner.helpers({
    dictcount: function(dictname) {
      return dicts[dictname];
    },
    diputados: function() {
      // Dummy data
      dataset = []
      for (i = 0; i < 3; i++) {
        obj = new Object();
        obj.name = "xxx Falciani";
        dataset.push(obj);
      };
      return dataset;
    },
    gps: function() {
      // Dummy data
      dataset = []
      for (i = 0; i < 3; i++) {
        obj = new Object();
        obj.name = "Partido X";
        dataset.push(obj);
      };
      return dataset;
    },
    whatevers: function() {
      // Dummy data
      dataset = []
      for (i = 0; i < 3; i++) {
        obj = new Object();
        obj.name = "Whtvr " + (i+1);
        dataset.push(obj);
      };
      return dataset;
    }
});


Template.scanner.rendered = function() {

    // D3js example: https://raw.githubusercontent.com/Slava/d3-meteor-basic/master/client.js

    var margin = 20,
    diameter = 600;

    var color = d3.scale.linear()
        .domain([-1, 5])
        .range(["hsl(82,60%,100%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.layout.pack()
        .padding(2)
        .size([diameter - margin, diameter - margin])
        .value(function(d) { return d.size; })

    var svg = d3.select("#vizz").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    // https://gist.githubusercontent.com/mbostock/7607535/raw/a05a94858375bd0ae023f6950a2b13fac5127637/flare.json
    d3.json(Meteor.absoluteUrl("/data/fixtures.json"), function(error, root) {
      if (error) return console.error(error);

      var focus = root,
          nodes = pack.nodes(root),
          view;

      var circle = svg.selectAll("circle")
          .data(nodes)
        .enter().append("circle")
          .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
          .style("fill", function(d) { return d.children ? "#000" : null; })
          .style("fill-opacity", function(d) { return d.children ? 0 : 1; })
          .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

      var text = svg.selectAll("text")
          .data(nodes)
        .enter().append("text")
          .attr("class", "label")
          .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
          .style("display", function(d) { return d.parent === root ? null : "none"; })
          .text(function(d) { return d.name; });

      var node = svg.selectAll("circle,text");

      var image = new Image;
      image.src = "https://octodex.github.com/images/original.png";
      image.onload = load;

      function load() {
        circle.append("image")
            .attr("xlink:href", this.src)
            .attr("width", "90%")
            .attr("height", "90%");
      }

      d3.select("#vizz")
          .on("click", function() { zoom(root); });

      zoomTo([root.x, root.y, root.r * 2 + margin]);

      function zoom(d) {

        $("#scanner-title").text(d.name);
        if ($("#scanner-title").text() == "Escaner") {
          console.log("Añade clase hidden");
          $("#scanner-content").addClass("hidden");
        }
        else {
          console.log("Quita clase hidden");
          $("#scanner-content").removeClass("hidden");
        }

        var focus0 = focus; focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
              var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
              return function(t) { zoomTo(i(t)); };
            });

        transition.selectAll("text")
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }

      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
      }
    });

    d3.select(self.frameElement).style("height", diameter + "px");

};