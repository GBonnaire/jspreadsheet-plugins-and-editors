/**
 * Plugin statusbar for JSpreadsheet Pro
 *
 * @version 2.1.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @summary Add status bar on bottom of JExcel
 * @namespace jss_statusbar
 *
 * @requires Formula or Formula-Pro
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
 * Release notes
 * Version 2.1.0: add compatibility v9
 * Version 2.0.1: compatibility ES6
 * Version 2.0.0: migration v8
 * Version 1.3.2: Fix compatibility
 * Version 1.3.1: Transform jexcel to jspreadsheet
 * Version 1.3.0: Compatibility for project dev in ES2015
 * Version 1.2.1: Fix bug with fullscreen + bug formula with 1 cell
 * Version 1.2.0: Add formula execute by cells selected (i.e. with results)
 */

if(! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

if (! formula && typeof(require) === 'function') {
    var formula = require('formula');
}

if (! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.jss_statusbar = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {
        // Plugin object
        const plugin = {};
        let RangeSelection = null;
        let statusBarElement = null;

        // Set options
        plugin.options = Object.assign({},options);


        // Options
        const defaultOptions = {
            showAddRowButton: true,
            formulas: {
                "Range":"{range}",
                "SUM":"=SUM({range})",
                "MAX":"=MAX({range})",
                "MIN":"=MIN({range})"
            },
            text_AddRowButton: jSuites.translate("Add {*} row(s)"), // {*} = Input number
        };

        // Set default value
        if(plugin.options==null) {
            plugin.options = {};
        }
        for(var property in defaultOptions) {
            if (!plugin.options.hasOwnProperty(property) || plugin.options[property]==null ) {
                plugin.options[property] = defaultOptions[property];
            }
        }

        /**
         * JSpreadsheet events
         * @private
         */
        plugin.onevent = function(event, worksheet) {
            if(event == "onload") {
                plugin.createStatusbar(worksheet); // Here worksheet = workbook
            } else if(event == "onselection") {
                const x1 = arguments[2];
                const y1 = arguments[3];
                const x2 = arguments[4];
                const y2 = arguments[5];

                RangeSelection = [x1,y1,x2,y2];
                plugin.generateInformation();
            } else if(event == "onblur") {
                const statusBarInformationElement = getStatusBarInformationElement();
                if(statusBarInformationElement) {
                    statusBarInformationElement.innerHTML = "";
                }
            }
        };

        /**
         * Create all element of statusbar
         * @memberOf jss_statusbar
         * @param {Workbook} workbook - spreadsheet
         * @returns {undefined}
         */
        plugin.createStatusbar = function (workbook) {
            const el = workbook.element;
            const content = el.querySelector(":scope > .jtabs-content");

            statusBarElement = document.createElement("div");
            statusBarElement.classList.add("jss_statusbar");

            // Add Row Element
            const textButton = plugin.options.text_AddRowButton.split('{*}');
            const divAddRows = document.createElement("div");
            divAddRows.classList.add("jss_statusbar_addrows");
            if(!plugin.options.showAddRowButton) {
                divAddRows.style.display = "none";
            }

            const inputAddRows = document.createElement("input");
            inputAddRows.setAttribute("type","number");
            inputAddRows.setAttribute("min","1");
            inputAddRows.setAttribute("step","1");
            inputAddRows.value = 1;

            const buttonAddRows = document.createElement("button");
            buttonAddRows.innerHTML = textButton[0];
            buttonAddRows.onclick = function (e) {
                if(plugin.options.showAddRowButton) {
                    const worksheet = getCurrentWorksheet();
                    if (worksheet.options.allowInsertRow) {
                        worksheet.insertRow(parseInt(inputAddRows.value));
                    }
                }
            };

            const spanAddRows = document.createElement("span");
            spanAddRows.innerHTML = textButton[1];

            // Append all elements
            divAddRows.appendChild(buttonAddRows);
            divAddRows.appendChild(inputAddRows);
            divAddRows.appendChild(spanAddRows);

            // Apprend Add Row Element
            statusBarElement.appendChild(divAddRows);

            // Information Element
            const statusBarInformationElement = document.createElement("div");
            statusBarInformationElement.classList.add("jss_statusbar_information");

            // Append Information Element
            statusBarElement.appendChild(statusBarInformationElement);

            content.after(statusBarElement);
        };

        /**
         * Generation information
         * @memberOf jss_statusbar
         * @returns {undefined}
         */
        plugin.generateInformation = function() {
            let info = "";
            const instance = getCurrentWorksheet();
            // Test if data is Empty
            const isEmpty = (instance.getData(true).join("") == "");

            // Create all parameters
            if(RangeSelection==null) {
                RangeSelection = instance.selectedCell;
            }
            let RangeStart = jspreadsheet.helpers.getColumnNameFromCoords(RangeSelection[0],RangeSelection[1]);
            let RangeEnd;
            if(RangeSelection[0]!=RangeSelection[2] || RangeSelection[1]!=RangeSelection[3]) {
                RangeEnd = jspreadsheet.helpers.getColumnNameFromCoords(RangeSelection[2],RangeSelection[3]);
            } else {
                RangeEnd = "";
            }

            // Convert range tokens
            const tokensUpdate = function(tokens) {
                const f = [];
                const token = tokens.split(':');

                if(!token[1]) {
                    return "[" + token[0] + "]";
                }

                const e1 = jspreadsheet.helpers.getCoordsFromColumnName(token[0]);
                const e2 = jspreadsheet.helpers.getCoordsFromColumnName(token[1]);

                let x1, x2, y1, y2;
                if (e1[0] <= e2[0]) {
                    x1 = e1[0];
                    x2 = e2[0];
                } else {
                    x1 = e2[0];
                    x2 = e1[0];
                }

                if (e1[1] <= e2[1]) {
                    y1 = e1[1];
                    y2 = e2[1];
                } else {
                    y1 = e2[1];
                    y2 = e1[1];
                }

                for(let j = y1; j <= y2; j++) {
                    for(let i = x1; i <= x2; i++) {
                        if(instance.results == null || instance.results.indexOf(j)!=-1) {
                            f.push(jspreadsheet.helpers.getColumnNameFromCoords(i, j));
                        }
                    }
                }
                return "[" + f.join(',') + "]";
            };

            const parameters = {};
            parameters.range = RangeStart + (RangeEnd!=""?":"+RangeEnd:"");
            parameters.cells = tokensUpdate(parameters["range"]);
            parameters.x1 = parseInt(RangeSelection[0]);
            parameters.y1 = parseInt(RangeSelection[1]);
            parameters.x2 = parseInt(RangeSelection[2]);
            parameters.y2 = parseInt(RangeSelection[3]);


            // Execute all formulas
            for(let label_formula in plugin.options.formulas) {
                const formula = plugin.options.formulas[label_formula];
                if(formula.substr(0,1)=="=") {
                    if(!isEmpty) {
                        if(info!="") {
                            info += "<span class='divisor'></span>";
                        }
                        const result = instance.executeFormula(prepareFormula(formula, parameters));
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
            const statusBarInformationElement = getStatusBarInformationElement();
            if(statusBarInformationElement != null) {
                statusBarInformationElement.innerHTML = info;
            }
        };

        /**
         * Prepare function with formula
         * @private
         * @param {String} formula
         * @param {Object} parameters
         * @returns {String}
         */
        function prepareFormula(formula, parameters) {
            for(let parameter in parameters) {
                formula = formula.replace(new RegExp("{[ ]?"+parameter+"[ ]?}", "gi"), parameters[parameter]);
            }

            return formula;
        }

        /**
         * Return Element of status bar information area
         * @private
         * @returns {HTMLElement}
         */
        function getStatusBarInformationElement() {
            return statusBarElement.querySelector(".jss_statusbar_information");
        }

        /**
         * get current worksheet
         * @returns {object}
         */
        function getCurrentWorksheet() {
            if(jspreadsheet.current) {
                return jspreadsheet.current;
            }
            if(spreadsheet.getWorksheetActive() != null) {
                return spreadsheet.worksheets[spreadsheet.getWorksheetActive()];
            }
            return spreadsheet.worksheets[0];
        }


        return plugin;
    });

})));