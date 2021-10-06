/**
 * Plugin for sync data (json) in jSpreadsheet pro in input
 * 
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description sync data (json) in Jexcel in input
 * ReleaseNote:
 * 2.0 : Migrate on JSS v8
 * @license This plugin is distribute under MIT License
 */

if(! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

if(! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet-pro');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_syncInput = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {

        // Plugin object
        var plugin = {};
        
        // Set options
        plugin.options = Object.assign({},options);


        // Options
        var defaultOptions = {
            inputElement: null,  
            inputId: null,
            checkRow: null, // Function for checkRow before add in sync value function(row, obj, numRows) {return true/false} 
            fieldsRequired:[], // Array with Index column or name column
            processedValues: true,
            worksheetId: null, // String
        }


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
         * JSS events
         */
        plugin.onevent = function(event, worksheet) {
            if(event == "onchange" && getWorksheetId(worksheet) === plugin.options.worksheetId) {
                syncData(worksheet); 
            } 
        }
        
        /**
         * On create worksheet
         */
        plugin.init = function(worksheet) {
            if(plugin.options.worksheetId==null) {
                plugin.options.worksheetId = getWorksheetId(worksheet);
            }
        }
        
        /**
         * On load
         * @type onload
         */
        var baseOnload = spreadsheetConfig.onload;
        spreadsheetConfig.onload = function() {
            // load ended
            if(baseOnload) {
                baseOnload.apply(spreadsheet, arguments);
            }
            init();
            syncData(getWorksheet());
        }
        
        /**
         * sync data to input
         * @returns {undefined}
         */
        function syncData(instance) {
            if(instance == null) {
                return;
            }
            var dataTab = instance.getJson(false, plugin.options.processedValues); 

            if(dataTab.length==1) {
                 var isEmpty = true;
                 for(var ite_data in dataTab[0]) {
                     if(dataTab[0][ite_data]) {
                         isEmpty = false;
                         break;
                     }
                 }
                 if(isEmpty) {
                     dataTab = [[]];
                 }
             }

             var resData = [];
             for(ite_data=0; ite_data<dataTab.length; ite_data++) {
                var row = dataTab[ite_data];
                if(Array.isArray(row) && row.join("") === "") {
                    continue; // Row empty
                } else if(!Array.isArray(row) && Object.values(row).join("") === "") {
                    continue; // Row empty
                }
                var isComplete=true;
                for(var ite_fR=0; ite_fR<plugin.options.fieldsRequired.length; ite_fR++) {
                    var fRName = plugin.options.fieldsRequired[ite_fR];
                    if(row[fRName]==null || row[fRName]=="") {
                        isComplete=false;
                        break;
                    }
                }
                if(!isComplete) {
                    continue;
                }
                if(typeof plugin.options.checkRow == "function") {
                    isComplete = plugin.options.checkRow(row, instance, ite_data);
                }
                
                if(isComplete) {
                    resData.push(row);
                }
             }
             
             // Set Data in inputElement
             plugin.options.inputElement.value = JSON.stringify(resData);
        }
        
        /**
         * Create input
         * @returns {undefined}
         */
        function createInputElement() {
            if(!plugin.options.inputId) {
                generateIdInput();
            } 
            
            var Id = plugin.options.inputId;
            
            var inputEl = document.createElement("input");
            inputEl.id = Id;
            inputEl.name = Id;
            inputEl.type = "hidden";
            spreadsheet.el.append(inputEl);
            plugin.options.inputElement = inputEl;
        } 
        
        /**
         * Generate Id of input
         * @param {int} index
         * @returns {undefined}
         */
        function generateIdInput(index) {
            if(index == null) {
                index = "";
            } 
            if(spreadsheet.el.id) {
                plugin.options.inputId = spreadsheet.el.id+"_DATA"+index;
            } else {
                plugin.options.inputId = "JSS_DATA"+index;
            }
            
            // Check if Id exist
            if(document.getElementById(plugin.options.inputId)) {
                if(index=="") {
                    index=0;
                } 
                generateIdInput(parseInt(index)+1);
            }
        } 
        
        /**
         * init
         * @returns {undefined}
         */
        function init() { 
            if(!plugin.options.inputElement) {
                if(!plugin.options.inputId) {
                    // create Element
                    createInputElement();
                } else {
                    var input = document.getElementById(plugin.options.inputId);
                    if(!input) {
                        // create Element
                        createInputElement();
                    } else {
                        plugin.options.inputElement = input;
                    }
                }
            } 

            // Init required Input
            var worksheet = getWorksheet();

            for(var ite_fR=0; ite_fR<plugin.options.fieldsRequired.length; ite_fR++) {
                var fR = plugin.options.fieldsRequired[ite_fR];
                if(parseInt(fR)+"" === fR+"") { // Check if is columns index
                    // getName
                    var name = worksheet.options.columns[parseInt(fR)].name;
                    if(name) {
                        plugin.options.fieldsRequired[ite_fR] = name;
                    }
                }
            }
        } 
        
        /**
         * get current worksheet
         * @returns {object}
         */
        function getWorksheet() {
            for(var ite_worksheet=0; ite_worksheet<spreadsheet.worksheets.length; ite_worksheet++) {
                var worksheet = spreadsheet.worksheets[ite_worksheet];
                if(plugin.options.worksheetId === getWorksheetId(worksheet)) {
                    return worksheet;
                }
            }
            return null;
        }
        
        /**
         * get worksheet id / serial number
         * @private
         * @param {type} worksheet
         * @returns {string}
         */
        function getWorksheetId(worksheet) {
            var worksheet_sn = worksheet.options.worksheetId;
            if(worksheet_sn === "") {
                worksheet_sn = jSuites.guid();
                worksheet.options.worksheetId = worksheet_sn;
            }
            return worksheet_sn;
        }
        
        return plugin;
    });

})));