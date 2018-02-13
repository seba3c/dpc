//Namespaces
var dpc = dpc || {};
dpc.data = dpc.data || {};

/*
 * Verifica si el browser tiene soporte para la API File HTML5.
 */
dpc.data.checkBrowserFileSupport = function() {
  console.log("Detecting FILE API support browser...");
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("Great success! All the File APIs are supported.");
    return true;
  }
  console.log("This browser do not support FILE API!");
  alert('The File APIs are not fully supported in this browser.');
  return false;
}

/*
 * Intenta parsear un text para detectar el formato del mismo (CSV, JSON).
 * Retornando un array clave valor.
 */
dpc.data.parse = function(text) {
  console.log("Detecting text format...");
  // TODO: detectar que formato tiene y parsear con el parser apropiado
  // Por el momento se parsea asumiendo que el texto es CSV
  var result = d3.csv.parse(text);
  return result;
}

/*
 * Evento de selección para el input de archivos.
 */
dpc.data.fileSelectEvt = function() {
  // GETS FILE OBJECT
  console.log("Reading local file...");
  var f = dpc.view.inputFileElement().property("files")[0];
  var info = "Archivo: " + f.name + " <br>Tipo: " + (f.type || 'n/a')
      + " <br>Tam.: " + (f.size / 1024);
  // + ' Kbytes, Ult. Modificación: '
  // + (f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a');
  console.log("File info: " + info);
  dpc.view.showFileInfo(info);

  // READS FILE OBJECT
  var reader = new FileReader();
  reader.onloadstart = function(e) {
    console.log("Starting to load file " + f.name + "...");
  };
  reader.onloadend = function(e) {
    console.log("File " + f.name + " loaded successfully!");
    dpc.data.load(this.result);
  };
  reader.readAsText(f);
}

/*
 * Evento para entrada de texto (type, change, paste) en el text Area
 */
dpc.data.textInputEvt = function() {
  console.log("Handling input text...");
  var inputText = dpc.view.inputTextElement().property("value");
  dpc.data.load(inputText);
}

dpc.data.load = function(inputText) {
  dpc.view.cleanDataInfo();
  var data = dpc.data.parse(inputText);
  // acceso a los datos parseados
  dpc.data.parsed = data;
  dpc.view.showDataInfo(data);
  dpc.view.generateSVGBtn().property("disabled", false);
}
