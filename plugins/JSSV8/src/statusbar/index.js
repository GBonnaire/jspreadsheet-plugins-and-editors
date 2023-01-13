/**
 * Plugin statusbar for JSpreadsheet Pro
 * 
 * @version 2.3.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @summary Add status bar on bottom of JSpreadsheet
 * @namespace jss_statusbar
 * 
 * @requires Formula or Formula-Pro
 * 
 * @property {Object} options - List options of plugin
 * @property {Boolean|String} [options.showAddRowButton=true] - Add button on right of bar for add row (value : true / false / "after" / "before")
 * @property {Boolean|String} [options.showAddColButton=true] - Add button on right of bar for add col (value : true / false / "after" / "before")
 * @property {String} [options.label="Add"] - Label for button action
 * @property {int} [options.defaultQuantity=10] - Quantity for button action
 * @property {Object} [options.formulas] - Formulas showed on statusbar. object.key = title of formula, object.value = formula. In formula you can use this shortcut {range} (Ref to range selected), {cells} (Ref to array of cells selected), {x1} (Ref to start col of selection), {y1} (Ref to start row of selection), {x2} (Ref to end col to selection), {y2} (Ref to end row to selection)
 * 
 * @link https://github.com/GBonnaire/jspreadsheet-plugins-and-editors/blob/master/plugins/JSSV8/src/statusbar/README.mdgithub
 * Documentation official
 * 
 * @example 
 * jexcel(document.getElementById('spreadsheet'), {
 *	plugins: [
 *       { name:'statusBar', plugin:jss_statusbar },
 *     ],
 * });
 * @license This plugin is distributed under MIT License
 * 
 * @description Status bar is a plugin for add a status bar on bottom of the sheet like Excel. On this status bar you can add new row with button, and show information on selection (Range selected, Formulas, etc.)
 * Release notes
 * Version 2.3.1: Add property quantity
 * Version 2.3.0: Add possibility to insert after/before row/column
 * Version 2.2.1: Fix style and checker empty selection, add property
 * Version 2.2.0: Add possibility to add column
 * Version 2.1.1: Fix error build on webpack
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
    
    
    ;(function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        global.jss_statusbar = factory();
    }(this, (function () {
        return (function(spreadsheet, options, spreadsheetConfig) {
            const jspreadsheet = this;
            if(!jspreadsheet) {
                throw new Error("JSpreadsheet must loaded before");
            }
            const formula = jspreadsheet.formula;
            if(!formula) {
                throw new Error("Statusbar plugin require formula extension on JSpreadsheet");
            }
    
            // Plugin object
            const plugin = {};
            let RangeSelection = null;
            let statusBarElement = null;
    
            // Set options
            plugin.options = Object.assign({},options);
    
    
            // Options
            const defaultOptions = {
                 showAddRowButton: true,
                 showAddColButton: true,
                 formulas: {
                     "Range":"{range}",
                     "SUM":"=SUM({range})",
                     "MAX":"=MAX({range})",
                     "MIN":"=MIN({range})"
                 },
                 label: jSuites.translate("Add"),
                 defaultQuantity: 10,
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
                const divAddAction= document.createElement("div");
                divAddAction.classList.add("jss_statusbar_addaction");
                if(!plugin.options.showAddRowButton && !plugin.options.showAddColButton) {
                    divAddAction.style.display = "none";
                }
    
                const inputAddQuantity = document.createElement("input");
                inputAddQuantity.setAttribute("type","number");
                inputAddQuantity.setAttribute("min","1");
                inputAddQuantity.setAttribute("step","1");
                inputAddQuantity.addEventListener("keydown", function(e) {
                    e.stopPropagation();
                });
                inputAddQuantity.value = plugin.options.defaultQuantity;
    
                const buttonAddRows = document.createElement("button");
                buttonAddRows.innerHTML = "<svg style=\"width:15px;height:15px\" viewBox=\"0 0 24 24\"> <path fill=\"currentColor\" d=\"M22,10A2,2 0 0,1 20,12H4A2,2 0 0,1 2,10V3H4V5H8V3H10V5H14V3H16V5H20V3H22V10M4,10H8V7H4V10M10,10H14V7H10V10M20,10V7H16V10H20M11,14H13V17H16V19H13V22H11V19H8V17H11V14Z\" /></svg>";
                buttonAddRows.onclick = function (e) {
                    if(plugin.options.showAddRowButton === true || plugin.options.showAddRowButton == "after") {
                        const worksheet = getCurrentWorksheet();
                        if (worksheet.options.allowInsertRow) {
                            // Detect if need insert or add the end
                            if(worksheet.getSelectedRows(true).length == 1 && worksheet.getSelectedColumns().length == worksheet.options.data[0].length) {
                                worksheet.insertRow(parseInt(inputAddQuantity.value), parseInt(worksheet.getSelectedRows(true)[0]));
                            } else {
                                worksheet.insertRow(parseInt(inputAddQuantity.value));
                            }
                        }
                    }
                };
    
                const buttonAddRowsBefore = document.createElement("button");
                buttonAddRowsBefore.innerHTML = "<svg style=\"width:15px;height:15px;transform: rotate(180deg);\" viewBox=\"0 0 24 24\"> <path fill=\"currentColor\" d=\"M22,10A2,2 0 0,1 20,12H4A2,2 0 0,1 2,10V3H4V5H8V3H10V5H14V3H16V5H20V3H22V10M4,10H8V7H4V10M10,10H14V7H10V10M20,10V7H16V10H20M11,14H13V17H16V19H13V22H11V19H8V17H11V14Z\" /></svg>";
                buttonAddRowsBefore.onclick = function (e) {
                    if(plugin.options.showAddRowButton === true || plugin.options.showAddRowButton == "before") {
                        const worksheet = getCurrentWorksheet();
                        if (worksheet.options.allowInsertRow) {
                            // Detect if need insert or add the end
                            if(worksheet.getSelectedRows(true).length == 1 && worksheet.getSelectedColumns().length == worksheet.options.data[0].length) {
                                worksheet.insertRow(parseInt(inputAddQuantity.value), parseInt(worksheet.getSelectedRows(true)[0]), true);
                            } else {
                                worksheet.insertRow(parseInt(inputAddQuantity.value), 0 , true);
                            }
                        }
                    }
                };
    
                const buttonAddCols = document.createElement("button");
                buttonAddCols.innerHTML = "<svg style=\"width:15px;height:15px\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M11,2A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H2V2H11M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M15,11H18V8H20V11H23V13H20V16H18V13H15V11Z\" /></svg>";
                buttonAddCols.onclick = function (e) {
                    if(plugin.options.showAddColButton === true || plugin.options.showAddColButton == "after") {
                        const worksheet = getCurrentWorksheet();
                        if (worksheet.options.allowInsertColumn) {
                            // Detect if need insert or add the end
                            if(worksheet.getSelectedColumns().length == 1 && worksheet.getSelectedRows(true).length == worksheet.options.data.length) {
                                worksheet.insertColumn(parseInt(inputAddQuantity.value), parseInt(worksheet.getSelectedColumns()[0]));
                            } else {
                                worksheet.insertColumn(parseInt(inputAddQuantity.value));
                            }
                        }
                    }
                };
    
                const buttonAddColsBefore = document.createElement("button");
                buttonAddColsBefore.innerHTML = "<svg style=\"width:15px;height:15px;transform: rotate(180deg);\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M11,2A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H2V2H11M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M15,11H18V8H20V11H23V13H20V16H18V13H15V11Z\" /></svg>";
                buttonAddColsBefore.onclick = function (e) {
                    if(plugin.options.showAddColButton === true || plugin.options.showAddColButton == "before") {
                        const worksheet = getCurrentWorksheet();
                        if (worksheet.options.allowInsertColumn) {
                            // Detect if need insert or add the end
                            if(worksheet.getSelectedColumns().length == 1 && worksheet.getSelectedRows(true).length == worksheet.options.data.length) {
                                worksheet.insertColumn(parseInt(inputAddQuantity.value), parseInt(worksheet.getSelectedColumns()[0]), true);
                            } else {
                                worksheet.insertColumn(parseInt(inputAddQuantity.value), 0, true);
                            }
                        }
                    }
                };
    
                const spanAddLabel = document.createElement("span");
                spanAddLabel.innerHTML = plugin.options.label;
    
                // Append all elements
                divAddAction.appendChild(spanAddLabel);
                divAddAction.appendChild(inputAddQuantity);
    
                if(plugin.options.showAddRowButton !== false) {
                    if(plugin.options.showAddRowButton === true || plugin.options.showAddRowButton == "before") {
                        divAddAction.appendChild(buttonAddRowsBefore);
                    }
                    if(plugin.options.showAddRowButton === true || plugin.options.showAddRowButton == "after") {
                        divAddAction.appendChild(buttonAddRows);
                    }
                }
                if(plugin.options.showAddColButton !== false) {
                    if(plugin.options.showAddColButton === true || plugin.options.showAddColButton == "before") {
                        divAddAction.appendChild(buttonAddColsBefore);
                    }
                    if(plugin.options.showAddColButton === true || plugin.options.showAddColButton == "after") {
                        divAddAction.appendChild(buttonAddCols);
                    }
                }
    
                // Apprend Add Row Element
                statusBarElement.appendChild(divAddAction);
    
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
                const isEmpty = (instance.getData(true).join("").replace(/,/gm,"") == "");
    
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