/**
 * Plugin statusbar of jExcel Pro
 * 
 * @version 1.1.2
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * @description Add status bar on bottom of JExcel
 * 
 * 
 * @license This plugin is distribute under MIT License
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
       
        el.after(statusBarElement);
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
        var RangeStart = jexcel.getColumnNameFromId([RangeSelection[0],RangeSelection[1]]);
        if(RangeSelection[0]!=RangeSelection[2] || RangeSelection[1]!=RangeSelection[3]) {
            var RangeEnd = jexcel.getColumnNameFromId([RangeSelection[2],RangeSelection[3]]);
        } else {
            var RangeEnd = "";
        }
        
        var parameters = {};
        parameters["range"] = RangeStart + (RangeEnd!=""?":"+RangeEnd:"")
        parameters["x1"] = RangeSelection[0];
        parameters["y1"] = RangeSelection[1];
        parameters["x2"] = RangeSelection[2];
        parameters["y2"] = RangeSelection[3];
        
        
        // Execute all formulas
        for(var label_formula in plugin.options.formulas) {
            var formula = plugin.options.formulas[label_formula];
            if(formula.substr(0,1)=="=") {
                if(!isEmpty) {
                    if(info!="") {
                        info += "<span class='divisor'></span>";
                    }
                    info += label_formula + " : " + instance.executeFormula(prepareFormula(formula, parameters));
                } else {

                }
            } else {
                if(info!="") {
                    info += "<span class='divisor'></span>";
                }
                info += label_formula + " : " + prepareFormula(formula, parameters);
            }
        }
        
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
