//Namespaces
var dpc = dpc || {};
dpc.view = dpc.view || {};

// DOM elements
dpc.view.errorElement = function() {
  return d3.select("#error-container");
}

dpc.view.inputFileElement = function() {
  return d3.select("#input-file");
}

dpc.view.inputTextElement = function() {
  return d3.select("#input-text");
}

dpc.view.inputFileInfoElement = function() {
  return d3.select("#selected-file-info");
}

dpc.view.generateSVGBtn = function() {
  return d3.select("#generate-svg-btn");
}

dpc.view.inputDataInfoElement = function() {
  return d3.select("#additional-input-info");
}

dpc.view.svgTitleElement = function() {
  return d3.select("#svg-title");
}

dpc.view.getSvgTitle = function() {
  return dpc.view.svgTitleElement().property("value");
}

dpc.view.buildSVGElement = function(margin, width, height, title) {
  d3.select("svg").remove();
  var svg = d3.select("#svg-container").append("svg").attr("width",
      width + margin.left + margin.right).attr("height",
      height + margin.top + margin.bottom).append("g").attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // SVG TITLE
  if (title) {
    svg.append("text").attr("x", (width / 2)).attr("y", 0 - (margin.top / 1.4))
        .attr("text-anchor", "middle").attr("id", "title").text(title);
  }

  return svg;
}

// File Info
dpc.view.showFileInfo = function(info) {
  dpc.view.inputFileInfoElement().html(info).style("display", "inherit");
}

dpc.view.cleanFileInfo = function() {
  dpc.view.inputFileInfoElement().html("").style("display", "none");
}

// Data Parsed Info
dpc.view.showDataInfo = function(data) {

  // TODO: contruir algo que permita editar la data extraida de los datos
  // parseados. Por ejemplo, cambiar el tipo de alguno de las dimensiones.

  dpc.view.inputDataInfoElement().property("value",
      "TODO: mostrar editor para los datos parseados");
}

dpc.view.cleanDataInfo = function() {
  dpc.view.inputDataInfoElement().text();
}

// Error Messages
dpc.view.showError = function(error) {
  dpc.view.errorElement().html(error).style("display", "inherit");
}

dpc.view.cleanErrors = function() {
  console.log("Cleaning error view...");
  dpc.view.errorElement().style("display", "none").html("");
}

dpc.view.init = function() {
  console.log("Initializing view...");
  // click boton ejemplo de autos
  d3.select("#cars-example-btn").on("click", dpc.example.loadCars);
  // click boton ejemplo de costo de vida
  d3.select("#cost-of-living-btn").on("click", dpc.example.loadCostOfLiving);
  // click boton de test simple
  d3.select("#test-btn").on("click", dpc.example.loadTest2);
  // selección de archivo local
  dpc.view.inputFileElement().on("change", dpc.data.fileSelectEvt);
  // Input de texto manual
  dpc.view.inputTextElement().on("change", dpc.data.textInputEvt);
  dpc.view.inputTextElement().on("paste", dpc.data.textInputEvt);
  // click boton generar SVG
  dpc.view.generateSVGBtn().on("click", dpc.svg.preBuild);
  // hasta que no se carga un archivo o ingresa texto, el botón esta
  // deshabilitado
  dpc.view.generateSVGBtn().property("disabled", true);
  // Styling para el input file
  $("#input-file").fileinput({
    showPreview : false,
    showCaption : true,
    showRemove : false,
    showUpload : false,
    allowedFileExtensions : [ "csv" ],
    mainClass : "input-group-sm",
    browseClass : "btn btn-primary btn-sm"
  });
  // cleans error view
  dpc.view.cleanErrors()
  // cleans file info view
  dpc.view.cleanFileInfo();
}