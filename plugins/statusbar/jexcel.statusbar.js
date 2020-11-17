/**
 * Plugin statusbar of jExcel Pro
 * 
 * @version 1.2.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * @description Add status bar on bottom of JExcel
 * 
 * 
 * @license This plugin is distribute under MIT License
 * 
 * Release Note
 * 1.2.1 : Fix bug with fullscreen + bug formula with 1 cell
 * 1.2.0 : Add formula execute by cells selected (i.e. with results)
 */

var jexcel_statusbar = (function(instance, options) {
    // Plugin object
    var plugin = {};
    var RangeSelection = null;
    var statusBarElement = null;
    var statusBarInformationElement = null;
    
    // Set options
    plugin.options = Object.assign({},options);


    // Options
    var defaultOptions = {
         showAddRowButton: true,
         formulas: {
             "Range":"{range}",
             "SUM":"=SUM({range})",
             "MAX":"=MAX({range})",
             "MIN":"=MIN({range})"
         },
         text_AddRowButton: "Add {*} row(s)", // {*} = Input number
    }
    
    // Set default value
    if(plugin.options==null) {
       plugin.options = {};
    }
    for(var property in defaultOptions) {
        if (!plugin.options.hasOwnProperty(property) || plugin.options[property]==null ) {
            plugin.options[property] = defaultOptions[property];
        }
        
        if(property.substring(0,5)==="text_") {
            var propertyText = "statusbar_" + property.substring(5,property.length);
            if(instance.options.text[propertyText]) {
                plugin.options[property] = instance.options.text[propertyText];
            }
        }
    }

    /**
     * Jexcel events
     */
    plugin.onevent = function(event) {        
        if(event=="onload") {
            plugin.createStatusbar(instance.content);
        } else if(event == "onselection") {
            var x1 = arguments[2];
            var y1 = arguments[3];
            var x2 = arguments[4];
            var y2 = arguments[5];
            
            RangeSelection = [x1,y1,x2,y2];
            plugin.generateInformation();
        } else if(event == "onblur") {
            if(statusBarInformationElement) {
                statusBarInformationElement.innerHTML = "";
            }
        }
    }

    /**
     * Create all element of statusbar
     * @param {type} el
     * @returns {undefined}
     */
    plugin.createStatusbar = function (el) {
        statusBarElement = document.createElement("div");
        statusBarElement.classList.add("jexcel_statusbar");
        
        // Add Row Element
        var textButton = plugin.options.text_AddRowButton.split('{*}');
        var divAddRows = document.createElement("div");
        divAddRows.classList.add("jexcel_statusbar_addrows");
        if(!plugin.options.showAddRowButton || instance.options.allowInsertRow==false) {
            divAddRows.style.display = "none";
        }
        
        var inputAddRows = document.createElement("input");
        inputAddRows.setAttribute("type","number");
        inputAddRows.setAttribute("min","1");
        inputAddRows.setAttribute("step","1");
        inputAddRows.value = 1;
        
        var buttonAddRows = document.createElement("button");
        buttonAddRows.innerHTML = textButton[0];
        buttonAddRows.onclick = function (e) {
            jexcel.current.insertRow(parseInt(inputAddRows.value));
        }
        
        var spanAddRows = document.createElement("span");
        spanAddRows.innerHTML = textButton[1];
        
        // Append all elements
        divAddRows.appendChild(buttonAddRows);
        divAddRows.appendChild(inputAddRows);
        divAddRows.appendChild(spanAddRows);
        
        // Apprend Add Row Element
        statusBarElement.appendChild(divAddRows);
        
        // Information Element
        statusBarInformationElement = document.createElement("div");
        statusBarInformationElement.classList.add("jexcel_statusbar_information");
        
        // Append Information Element
        statusBarElement.appendChild(statusBarInformationElement);
       
        el.appendChild(statusBarElement);
    }
    
    /**
     * Generation information
     * @returns {void}
     */
    plugin.generateInformation = function() {
        var info = "";
        
        // Test if data is Empty
        var isEmpty = (instance.getData(true).join("") == "");
        
        // Create all parameters
        if(RangeSelection==null) {
            RangeSelection = instance.selectedCell;
        }
        var RangeStart = jexcel.getColumnNameFromId([RangeSelection[0],RangeSelection[1]]);
        if(RangeSelection[0]!=RangeSelection[2] || RangeSelection[1]!=RangeSelection[3]) {
            var RangeEnd = jexcel.getColumnNameFromId([RangeSelection[2],RangeSelection[3]]);
        } else {
            var RangeEnd = "";
        }
        
        // Convert range tokens
        var tokensUpdate = function(tokens) {
            var f = [];
            var token = tokens.split(':');
            
            if(!token[1]) {
                return "[" + token[0] + "]"; 
            }
            
            var e1 = jexcel.getIdFromColumnName(token[0], true);
            var e2 = jexcel.getIdFromColumnName(token[1], true);
            
            if (e1[0] <= e2[0]) {
                var x1 = e1[0];
                var x2 = e2[0];
            } else {
                var x1 = e2[0];
                var x2 = e1[0];
            }

            if (e1[1] <= e2[1]) {
                var y1 = e1[1];
                var y2 = e2[1];
            } else {
                var y1 = e2[1];
                var y2 = e1[1];
            }

            for (var j = y1; j <= y2; j++) {
                for (var i = x1; i <= x2; i++) {
                    if(instance.results == null || instance.results.indexOf(j)!=-1) {
                        f.push(jexcel.getColumnNameFromId([i, j]));
                    }
                }
            }
            return "[" + f.join(',') + "]";
        }
        
        var parameters = {};
        parameters["range"] = RangeStart + (RangeEnd!=""?":"+RangeEnd:"");
        parameters["cells"] = tokensUpdate(parameters["range"]);
        parameters["x1"] = parseInt(RangeSelection[0]);
        parameters["y1"] = parseInt(RangeSelection[1]);
        parameters["x2"] = parseInt(RangeSelection[2]);
        parameters["y2"] = parseInt(RangeSelection[3]);
        
        
        // Execute all formulas
        for(var label_formula in plugin.options.formulas) {
            var formula = plugin.options.formulas[label_formula];
            if(formula.substr(0,1)=="=") {
                if(!isEmpty) {
                    if(info!="") {
                        info += "<span class='divisor'></span>";
                    }
                    var result = instance.executeFormula(prepareFormula(formula, parameters));
                    if(result!==null) {
                        info += label_formula + " : " + result;
                    }
                } else {

                }
            } else {
                if(info!="") {
                    info += "<span class='divisor'></span>";
                }
                info += label_formula + " : " + prepareFormula(formula, parameters);
            }
        }
        
        RangeSelection = null;
        
        // Set informations
        statusBarInformationElement.innerHTML = info;
    }
    
    /**
     * (private) Prepare function with formula
     * @param {type} formula
     * @param {type} parameters
     * @returns {unresolved}
     */
    function prepareFormula(formula, parameters) {
        for(var parameter in parameters) {
            formula = formula.replace(new RegExp("{[ ]?"+parameter+"[ ]?}", "gi"), parameters[parameter]);
        }
        
        return formula;
    }
    
    
    return plugin;
});