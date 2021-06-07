/**
 * Plugin for rename row header (Index) for jExcel Pro / jSpreadsheet
 * 
 * @version 1.2.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description Can row index rename and header of index, resize row index
 * 
 * @license This plugin is distribute under MIT License
 * 
 * ReleaseNote
 * 1.2.0 compatibility NPM
 */
if (! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet-pro');
}
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_rowHeaderRename = factory();
    
    // Compatibility Old version
    global.jexcel_rowHeaderRename = global.jss_rowHeaderRename;
}(this, (function () {
    return (function(instance, options) {

        // Plugin object
        var plugin = {};


        // Set options
        plugin.options = Object.assign({},options);


        // Options
        var defaultOptions = {
              headerIndexTitle: '',
              rowIndexTitle: null,
              widthRowIndex: 50,
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
            if(event=="onload") { 
                if(plugin.options.headerIndexTitle) {
                    var HeaderIndex = jspreadsheet.current.worksheet.querySelector('.jexcel_selectall');
                    if(HeaderIndex) {
                        HeaderIndex.innerText = plugin.options.headerIndexTitle;
                        HeaderIndex.style.textAlign = "center";
                    }
                }

                if(plugin.options.widthRowIndex != 50) {
                   var colGroup = jspreadsheet.current.worksheet.querySelector('colgroup');
                   var firstCol = colGroup.firstElementChild;
                   firstCol.width = plugin.options.widthRowIndex;
                }
            }
        }


        /**
         * renameRowIndex
         * @param {Jexcel} table
         * @returns {undefined}
         */
        function renameRowIndex(row, y) {           
            if(typeof plugin.options.rowIndexTitle == "object" && Array.isArray(plugin.options.rowIndexTitle)) {
                row.firstElementChild.innerText = plugin.options.rowIndexTitle[y % plugin.options.rowIndexTitle.length];
            } else if(typeof plugin.options.rowIndexTitle == "object") {
                if(plugin.options.rowIndexTitle[y]) {
                    row.firstElementChild.innerText = plugin.options.rowIndexTitle[y];
                }
            } else if(typeof plugin.options.rowIndexTitle == "function") {
                row.firstElementChild.innerText = plugin.options.rowIndexTitle(y);
            } else {
                row.firstElementChild.innerText = plugin.options.rowIndexTitle;
            }
        }

        // OverRide function createRow for LazyLoading
        var overridecreateRow = instance.createRow;

        /**
         * Override createRow
         */
        instance.createRow = function(y) {
            var row = overridecreateRow(...arguments);
            renameRowIndex(row, y);
            return row;
        }

        return plugin;
    });

    
})));