//Namespaces
var dpc = dpc || {};
dpc.example = dpc.example || {};

dpc.example.loadCars = function() {
  console.log("Loading cars example...");
  d3.csv("res/cars.csv", function(error, data) {
    dpc.svg.build(data, "Cars from the ‘70s & ‘80s");
  });
}

dpc.example.loadCostOfLiving = function() {
  console.log("Loading cost of living example...");
  d3.csv("res/cost-of-living.csv", function(error, data) {
    dpc.svg.build(data, "Cities Cost of Living");
  });
}

dpc.example.loadTest2 = function() {
  console.log("Loading simple test example...");
  d3.csv("res/test-2.csv", function(error, data) {
    dpc.svg.build(data);
  });
}
