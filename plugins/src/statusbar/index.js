/**
 * Plugin statusbar for jExcel Pro / jSpreadsheet
 * 
 * @version 1.3.2
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @summary Add status bar on bottom of JExcel
 * @namespace jss_statusbar
 * 
 * @property {Object} options - List options of plugin
 * @property {Boolean} [options.showAddRowButton=false] - Add button on right of bar for add row
 * @property {String} [text_AddRowButton="Add {*} row(s)"] - Text for button, {*} is input field 
 * @property {Object} [options.formulas] - Formulas showed on statusbar. object.key = title of formula, object.value = formula. In formula you can use this shortcut {range} (Ref to range selected), {cells} (Ref to array of cells selected), {x1} (Ref to start col of selection), {y1} (Ref to start row of selection), {x2} (Ref to end col to selection), {y2} (Ref to end row to selection)
 * 
 * @link https://github.com/Guillaume-Bo/jexcel-plugins-and-editors/blob/master/plugins/statusbar/README.md Documentation official
 * 
 * @example 
 * jexcel(document.getElementById('spreadsheet'), {
 *	plugins: [
 *       { name:'statusBar', plugin:jss_statusbar },
 *     ],
 * });
 * @license This plugin is distribute under MIT License
 * 
 * @description Status bar is a plugin for add a status bar on bottom of the sheet like Excel. On this status bar you can add new row with button, and show information on selection (Range selected, Formulas, etc.)
 * <h3>Release notes</h3>
 * <ul>
 * <li><h4>Version 1.3.2</h4>Fix compatibility</li>
 * <li><h4>Version 1.3.1</h4>Transform jexcel to jspreadsheet</li>
 * <li><h4>Version 1.3.0</h4>Compatibility for project dev in ES2015</li>
 * <li><h4>Version 1.2.1</h4>Fix bug with fullscreen + bug formula with 1 cell</li>
 * <li><h4>Version 1.2.0</h4>Add formula execute by cells selected (i.e. with results)</li>
 * </ul>
 */

if (! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet-pro');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_statusbar = factory();
    // Compatibility Old version
    global.jexcel_statusbar = global.jss_statusbar;
}(this, (function () {
    return (function(instance, options) {
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
         * @private
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
         * @memberOf jss_statusbar
         * @param {HTMLElement} el - Element of Jexcel
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
                jspreadsheet.current.insertRow(parseInt(inputAddRows.value));
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
         * @memberOf jss_statusbar
         * @returns {undefined}
         */
        plugin.generateInformation = function() {
            var info = "";

            // Test if data is Empty
            var isEmpty = (instance.getData(true).join("") == "");

            // Create all parameters
            if(RangeSelection==null) {
                RangeSelection = instance.selectedCell;
            }
            var RangeStart = jspreadsheet.getColumnNameFromId([RangeSelection[0],RangeSelection[1]]);
            if(RangeSelection[0]!=RangeSelection[2] || RangeSelection[1]!=RangeSelection[3]) {
                var RangeEnd = jspreadsheet.getColumnNameFromId([RangeSelection[2],RangeSelection[3]]);
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

                var e1 = jspreadsheet.getIdFromColumnName(token[0], true);
                var e2 = jspreadsheet.getIdFromColumnName(token[1], true);

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
                            f.push(jspreadsheet.getColumnNameFromId([i, j]));
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
         * Prepare function with formula
         * @private
         * @param {String} formula
         * @param {Object} parameters
         * @returns {String}
         */
        function prepareFormula(formula, parameters) {
            for(var parameter in parameters) {
                formula = formula.replace(new RegExp("{[ ]?"+parameter+"[ ]?}", "gi"), parameters[parameter]);
            }

            return formula;
        }


        return plugin;
    });
    
})));