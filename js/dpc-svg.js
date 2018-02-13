//Namespaces
var dpc = dpc || {};
dpc.svg = dpc.svg || {};

dpc.svg.preBuild = function() {
  dpc.view.cleanErrors();
  console.log("Generating SVG graphic...");
  // TODO : En este punto se debe analizar "dpc.data.parsed" y completar la
  // interfaz
  // con el nombre y tipo de cada coordenada, permitiendo su edición al usuario
  // de alguna "manera."
  // tambien implica algunas modificaciones en la funcion dpc.svg.build

  // Obtengo el titulo ingresado por el usuario
  var title = dpc.view.getSvgTitle();

  dpc.svg.build(dpc.data.parsed, title);
}

dpc.svg.build = function(data, title) {

  // SVG CONFIG

  var margin = {
    top : 50,
    right : 5,
    bottom : 60,
    left : 5
  };

  var width = 900 - margin.left - margin.right;
  var height = 580 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([ 0, width ], 1);
  var y = {};
  var dragging = {};

  var line = d3.svg.line();
  var axis = d3.svg.axis().orient("left");

  // ADDITIONAL FUNCTIONS

  var brushstart = function() {
    d3.event.sourceEvent.stopPropagation();
  }

  var position = function(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  var transition = function(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  var path = function(d) {
    return line(dimensions.map(function(p) {
      return [ position(p), y[p](d[p]) ];
    }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  var brush = function() {
    var actives = dimensions.filter(function(p) {
      return !y[p].brush.empty();
    }), extents = actives.map(function(p) {
      return y[p].brush.extent();
    });
    foreground.style("display", function(d) {
      return actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });
  }

  // BUILD SVG

  console.log("Building SVG graphic...");

  var svg = dpc.view.buildSVGElement(margin, width, height, title)

  // dimension names
  var dimNames = d3.keys(data[0]);

  // first dimensions name
  var firstDimName = d3.keys(data[0])[0];

  // TODO: aca hay que poder crear escalas ordinales, de acuerdo a un parametro
  // extra luego de parseado la información y previo a construir el gráfico

  // Extract the list of dimensions and create a scale for each.
  var dimensions = dimensions = dimNames.filter(function(d) {
    return d != firstDimName
        && (y[d] = d3.scale.linear().domain(d3.extent(data, function(p) {
          return +p[d];
        })).range([ height, 0 ]));
  });

  x.domain(dimensions);

  // Add grey background lines for context.
  background = svg.append("g").attr("class", "background").selectAll("path")
      .data(data).enter().append("path").attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g").attr("class", "foreground").selectAll("path")
      .data(data).enter().append("path").attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension").data(dimensions).enter().append("g")
      .attr("class", "dimension").attr("transform", function(d) {
        return "translate(" + x(d) + ")";
      }).call(
          d3.behavior.drag().origin(function(d) {
            return {
              x : x(d)
            };
          }).on("dragstart", function(d) {
            dragging[d] = x(d);
            background.attr("visibility", "hidden");
          }).on("drag", function(d) {
            dragging[d] = Math.min(width, Math.max(0, d3.event.x));
            foreground.attr("d", path);
            dimensions.sort(function(a, b) {
              return position(a) - position(b);
            });
            x.domain(dimensions);
            g.attr("transform", function(d) {
              return "translate(" + position(d) + ")";
            })
          }).on(
              "dragend",
              function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform",
                    "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background.attr("d", path).transition().delay(500).duration(0)
                    .attr("visibility", null);
              }));

  // Add an axis and title.
  g.append("g").attr("class", "axis").each(function(d) {
    d3.select(this).call(axis.scale(y[d]));
  }).append("text").style("text-anchor", "middle").attr("y", -9).text(
      function(d) {
        return d;
      });

  // Add and store a brush for each axis.
  g.append("g").attr("class", "brush").each(
      function(d) {
        d3.select(this).call(
            y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart)
                .on("brush", brush));
      }).selectAll("rect").attr("x", -8).attr("width", 16);
}
