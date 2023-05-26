import {myDiagram} from './editor.js';
// import {data} from './editor.js';

// Where the tab data is stored
const tabs = [];

// Creates an array of series keys
function seriesKeys(){
  var data = myDiagram.model.toJson();
  var json = JSON.parse(data);
  let nodes = json.nodeDataArray; // Want only the array of nodes

  const series = ["time"]; // time as an option
  for(let i = 0; i < nodes.length; i++){
    if(nodes[i].category == "stock" || nodes[i].category == "variable" || nodes[i].category == "valve"){ // Only stocks, variables, and flows
      series.push(nodes[i].key); // Add the key to the array
    }
  }
  return series;
}

// Adds the options for the x and y axes
function addOptions(){
  const series = seriesKeys();
  let x = document.getElementById("xAxis"); // refers to x-axis select node
  let y = document.getElementById("yAxis"); // refers to y-axis div node
  
  // Configuration for buttons of x-axis
  for(let i = 0; i < series.length; i++){
    const opt = document.createElement("option"); // Creates an option
    var node = document.createTextNode(series[i]); // Assigns text node (used exterally)
    opt.appendChild(node);
    opt.value = series[i]; // Assigns value (used interally)

    x.appendChild(opt);
  }

  // Configuration for buttos for y-axis
  for(let i = 1; i < series.length; i++){ // do not want to include time
    const row = document.createElement("tr"); // row for input
    const d1 = document.createElement("td"); // where checkboxes will go
    const d2 = document.createElement("td"); // where labels will go
    
    const opt = document.createElement("input"); // Creates an input
    opt.type = "checkbox"; // The input is a checkbox
    opt.value = series[i];
    opt.name = "yAxis";
    d1.appendChild(opt);

    const label = document.createElement("label"); // Creates a label
    label.for = i;
    var node = document.createTextNode(series[i]); // Assigns text node to label
    label.appendChild(node);
    d2.appendChild(label);

    // putting into the table
    row.appendChild(d1);
    row.appendChild(d2);
    y.appendChild(row);
  }
}

// Opens and initializes the form popup
function openForm(){
  addOptions(); // dtnamically adds in the options
  let form = document.getElementById("popForm");
  form.style.display = "block"; // display form
}

// Will validate and add tab data
function submit(){
  let inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs.item(i).type == 'checkbox') {
      if (inputs.item(i).checked == true){
        initializeTab(); // add data if valid
        return false; // want to return false to disable default submission
      }
    }
  }
  alert("At least one box must be checked."); // no alert if at least one is checked
}

// Resets the options so that it updates the options
function resetOptions(){
  let x = document.getElementById("xAxis"); // refers to x-axis select node
  while (x.firstChild) { // removes all child elements
    x.removeChild(x.lastChild);
  }

  let y = document.getElementById("yAxis"); // refers to y-axis div node
  while (y.firstChild) { // removes all child elements
    y.removeChild(y.lastChild);
  }
}

// Enter objects into tabs data array
function initializeTab() {
  let form = document.forms["tabConfig"];

  // gets all y axis values
  var ySeries = [];
  let inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs.item(i).type == 'checkbox') {
      if (inputs.item(i).checked == true){
        ySeries.push(inputs.item(i).value);
      }
    }
  }

  var tab = new Graphic(form["model_type"].value, form["xAxis"].value, ySeries); // initializes the Graphic object
  tabs.push(tab); // add to end of array
  document.getElementById("popForm").style.display = "none"; // hide form
  form.reset(); // reset input
  resetOptions(); // reset options

  console.log(tabs); // TO DO: delete later
}

// Array listener
/* @arr array you want to listen to
   @callback function that will be called on any change inside array
 */
function listenChangesinArray(arr,callback){
     // Add more methods here if you want to listen to them
    ['pop','push','reverse','shift','unshift','splice','sort'].forEach((m)=>{
        arr[m] = function(){
                     var res = Array.prototype[m].apply(arr, arguments);  // call normal behaviour
                     callback.apply(arr, arguments);  // finally call the callback supplied
                     return res;
                 }
    });
}

// Configures dynamic tabs
function configTabs(){
  let list = document.getElementById("tabsList");

  // reset for updating
  while (list.firstChild) { // removes all child elements
    list.removeChild(list.lastChild);
  }
  
  for(let i = 0; i < tabs.length; i++){
    const delButton = document.createElement("button"); 
    delButton.innerHTML = '<i style="font-size: 2vw;" class="fa fa-close"></i>'; // Font Awesome 4 icon button
    delButton.style.backgroundColor = "inherit";
    delButton.style.border = "none";
    
    const tab = document.createElement("div"); // Tabs are divs to allow button children
    var node = document.createTextNode("Tab_" + i);  // Tab name based on index
    tab.class = "graphTabs";
    tab.style.border = "1px solid black";
    tab.style.borderRadius = "5px";
    tab.style.fontSize = "2vw";
    tab.style.margin = "5px";
    tab.style.padding = "2px";
    tab.appendChild(delButton);
    tab.appendChild(node);
    list.appendChild(tab);
    
    delButton.addEventListener("click", function tabDelete(){ let i = tab.childNodes[1].nodeValue.charAt(4);  tabs.splice(Number(i), 1); console.log(tabs); /* TODO: delete later */ }); // Relies on name to modify the correct index
    
  }
}

// Updates tabs buttons on side when the array is changed
listenChangesinArray(tabs, configTabs);

// Object class to create charts and tables
class Graphic {
  constructor(type, xAxis, yAxis){
    this.type = type;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }
}

// Event listeners
document.getElementById("addTab").addEventListener("click", function() { openForm(); });
document.getElementById("submitModel").addEventListener("click", function() { submit(); });