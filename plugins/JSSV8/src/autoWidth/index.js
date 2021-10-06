/**
 * Plugin for auto width cols
 * 
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description auto size width of columns
 * - autosize all columns without width property
 * 
 * @license This plugin is distribute under MIT License
 */
if (! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet-pro');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_autoWidth = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {
        // check Version of JSS
        if(parseInt(jspreadsheet.version().version.split(".")[0]) < 8) {
            console.error("Plugin \"auto Width\" not compatible with jspreadsheet " + jspreadsheet.version().version + ", Please use an older version of this plugin compatible. Go to https://github.com/GBonnaire/jspreadsheet-plugins-and-editors/");
            return {};
        }
        
        // Plugin object
        var plugin = {};
         // Set options
        plugin.options = Object.assign({},options);
        
        var oldValue_styleTable = "";
        
        // Options
        var defaultOptions = {
            fullsizeTable: false,
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
            if(event=="onresizecolumn") {      
                var worksheet = arguments[1];
                run(worksheet);
            } 
        }
        
        plugin.init = function(worksheet) {
            enableIgnoreDispatch(worksheet.parent);
            for(var ite_col=0; ite_col<worksheet.options.columns.length; ite_col++) {
                var column = worksheet.options.columns[ite_col];
                if(column.width==null || column.width=='') {
                    worksheet.options.columns[ite_col].width="auto";
                }
            }
            disableIgnoreDispatch(worksheet.parent);
            run(worksheet);
        }
        
        /**
         * run calculate width of columns and apply
         * @returns {undefined}
         */
        var run = function(worksheet) {
            saveStyle(worksheet);
            setLayoutAuto(worksheet);
            var colsWidth = getWidthColumns(worksheet);
            removeLayoutAuto(worksheet);
            setWidthColumn(colsWidth, worksheet);
        }
        
        /**
         * save old style before change
         * @returns {undefined}
         */
        function saveStyle(worksheet) {
            oldValue_styleTable = worksheet.table.style.cssText;
        }
        
        /**
         * set style table layout
         * @returns {undefined}
         */
        function setLayoutAuto(worksheet) {
            worksheet.table.style.tableLayout="auto";
        }
        
        /**
         * remove style table layout
         * @returns {undefined}
         */
        function removeLayoutAuto(worksheet) {
            worksheet.table.style.cssText = oldValue_styleTable;
        }
        
        /**
         * get Width offset of columns
         * @returns {jexcel.autoWidthL#16.jexcel.autoWidthL#16#L#17.getWidthColumns.cols}
         */
        function getWidthColumns(worksheet) {
            var cols = [];
            var tr = worksheet.table.querySelector("tbody>tr");
            if(tr) {
                var tds = tr.querySelectorAll("td");
                for(var ite_td=0; ite_td<tds.length; ite_td++) {
                    if(ite_td==0) { // Skip index
                        continue; 
                    }
                    var td = tds[ite_td];
                    cols.push(td.offsetWidth);
                }
            }            
            return cols;
        }
        
        /**
         * defined new columns width
         * @param {array} colsWidth
         * @returns {undefined}
         */
        function setWidthColumn(colsWidth, worksheet) {
            
            // Autorize changement colsWidth
            var editable = worksheet.options.editable;
            worksheet.options.editable = true;
            enableIgnoreDispatch(worksheet.parent);
            
            if(worksheet.options.defaultColWidth==null || worksheet.options.defaultColWidth=="" || worksheet.options.defaultColWidth=="auto") {
                worksheet.options.defaultColWidth = 50;
            } else if(typeof worksheet.options.defaultColWidth == "string") {
                worksheet.options.defaultColWidth = parseInt(worksheet.options.defaultColWidth);                
            }
            
            // Parse cols - calculate good size
            var width_table = 0;
            var cols_size_total = 0;
            
            // Manage Option fullsizeTable
            if(plugin.options.fullsizeTable) {
                width_table = worksheet.table.parentNode.parentNode.offsetWidth - 50 - 5;
                cols_size_total = colsWidth.reduce(function(acc,v) { return acc+v;});
                for(var ite_col=0; ite_col<worksheet.options.columns.length; ite_col++) {
                    var column = worksheet.options.columns[ite_col];
                    // Exclude hidden column
                    if(column.type == "hidden") {
                        continue;
                    }
                    
                    if(column.width !== "auto") {
                        width_table = Math.max(0, width_table - parseFloat(column.width));
                        cols_size_total = Math.max(0, cols_size_total - colsWidth[ite_col])
                    } else if(colsWidth[ite_col]<100) {
                        cols_size_total = Math.max(0, cols_size_total + (100-colsWidth[ite_col]));
                    }
                }
            }
            // Parse cols - set width
            for(var ite_col=0; ite_col<worksheet.options.columns.length; ite_col++) {
                var column = worksheet.options.columns[ite_col];
                // Exclude hidden column
                if(column.type == "hidden") {
                    continue;
                }
                if(column.width==="auto") {
                    if(colsWidth[ite_col]) {
                        var newWidth = Math.max(worksheet.options.defaultColWidth, colsWidth[ite_col]);
                    } else {
                        var newWidth = worksheet.options.defaultColWidth;
                    }
                    if(plugin.options.fullsizeTable && cols_size_total < width_table) {
                        newWidth = (newWidth / cols_size_total) * width_table;
                    }
                    
                    worksheet.setWidth(ite_col, newWidth);
                }
            }
            
            // Resize old value
            disableIgnoreDispatch(worksheet.parent);
            worksheet.options.editable = editable;
        }
        
        var saveIgnore={};
        function enableIgnoreDispatch(inst) {
            if(saveIgnore["ignoreEvents"]==null) {saveIgnore["ignoreEvents"] = inst.ignoreEvents;}
            inst.ignoreEvents = true;
            if(saveIgnore["ignoreCloud"]==null) {saveIgnore["ignoreCloud"] = inst.ignoreCloud;}
            //inst.ignoreCloud = true;
            if(saveIgnore["ignoreHistory"]==null) {saveIgnore["ignoreHistory"] = inst.ignoreHistory;}
            inst.ignoreHistory = true;
            if(saveIgnore["ignorePersistence"]==null) {saveIgnore["ignorePersistence"] = inst.ignorePersistence;}
            inst.ignorePersistence = true;
        }
        
        function disableIgnoreDispatch(inst) {
            inst.ignoreEvents = saveIgnore["ignoreEvents"];
            //inst.ignoreCloud = saveIgnore["ignoreCloud"];;
            inst.ignoreHistory = saveIgnore["ignoreHistory"];;
            inst.ignorePersistence = saveIgnore["ignorePersistence"];
            saveIgnore = {};
        }
        
        return plugin;
    });

})));