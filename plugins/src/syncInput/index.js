/**
 * Plugin for sync data (json) in Jexcel in input
 * 
 * @version 1.0.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description sync data (json) in Jexcel in input
 * 
 * @license This plugin is distribute under MIT License
 */
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_syncInput = factory();
    // Compatibility Old version
    global.jexcel_syncInput = global.jss_syncInput;
}(this, (function () {
    return (function(instance, options) {

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
            processedValues: true
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
         * Jexcel events
         */
        plugin.onevent = function(event) {
            if(event == "onload") {
                init();
            }
            if(event == "onload" || event == "onchange") {
                syncData(); 
            } 
        }
        
        /**
         * sync data to input
         * @returns {undefined}
         */
        function syncData() {

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
            instance.el.append(inputEl);
            plugin.options.inputElement = inputEl;
        } 
        
        /**
         * Generate Id of input
         * @param {int} index
         * @returns {undefined}
         */
        function generateIdInput(index) {
            if(index == null) {
                index == "";
            } 
            if(instance.el.id) {
                plugin.options.inputId = instance.el.id+"_DATA"+index;
            } else {
                plugin.options.inputId = "JEXCEL_DATA"+index;
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
            for(var ite_fR=0; ite_fR<plugin.options.fieldsRequired.length; ite_fR++) {
                var fR = plugin.options.fieldsRequired[ite_fR];
                if(parseInt(fR)+"" === fR+"") { // Check if is columns index
                    // getName
                    var name = instance.options.columns[parseInt(fR)].name;
                    if(name) {
                        plugin.options.fieldsRequired[ite_fR] = name;
                    }
                }
            }
        } 
        
        return plugin;
    });

})));