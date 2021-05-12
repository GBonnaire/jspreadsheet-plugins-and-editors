/**
 * Plugin for auto width cols
 * 
 * @version 1.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description auto size width of columns
 * - autosize all columns without width property
 * 
 * @license This plugin is distribute under MIT License
 */

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_autoWidth = factory();
}(this, (function () {
    return (function(instance, options) {

        // Plugin object
        var plugin = {};
        var oldValue_styleTable = "";

        /**
         * Jexcel events
         */
        plugin.onevent = function(event) {
            if(event=="onload" || event=="onresizecolumn") {      
                init();
            } 
        }
        
        /**
         * run calculate width of columns and apply
         * @returns {undefined}
         */
        function init() {
            saveStyle();
            setLayoutAuto();
            var colsWidth = getWidthColumns();
            removeLayoutAuto();
            setWidthColumn(colsWidth);
        }
        
        /**
         * save old style before change
         * @returns {undefined}
         */
        function saveStyle() {
            oldValue_styleTable = instance.table.style.cssText;
        }
        
        /**
         * set style table layout
         * @returns {undefined}
         */
        function setLayoutAuto() {
            instance.table.style.tableLayout="auto";
        }
        
        /**
         * remove style table layout
         * @returns {undefined}
         */
        function removeLayoutAuto() {
            instance.table.style.cssText = oldValue_styleTable;
        }
        
        /**
         * get Width offset of columns
         * @returns {jexcel.autoWidthL#16.jexcel.autoWidthL#16#L#17.getWidthColumns.cols}
         */
        function getWidthColumns() {
            var cols = [];
            var tr = instance.table.querySelector("tbody>tr");
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
        function setWidthColumn(colsWidth) {
            // Autorize changement colsWidth
            var editable = instance.options.editable;
            instance.options.editable = true;
            instance.ignoreEvents = true;
            instance.ignoreCloud = true;
            instance.ignoreHistory = true;
            instance.ignorePersistance = true;
            
            if(instance.options.defaultColWidth==null || instance.options.defaultColWidth=="" || instance.options.defaultColWidth=="auto") {
                instance.options.defaultColWidth = 50;
            } else if(typeof instance.options.defaultColWidth == "string") {
                instance.options.defaultColWidth = parseInt(instance.options.defaultColWidth);                
            }
            
            // Parse cols
            for(var ite_col=0; ite_col<instance.options.columns.length; ite_col++) {
                var column = instance.options.columns[ite_col];
                if(column.width==="auto") {
                    if(colsWidth[ite_col]) {
                        var newWidth = Math.max(instance.options.defaultColWidth, colsWidth[ite_col]);
                    } else {
                        var newWidth = instance.options.defaultColWidth;
                    }
                    instance.setWidth(ite_col, newWidth);
                }
            }
            
            // Resize old value
            instance.ignoreEvents = false;
            instance.ignoreCloud = false;
            instance.ignoreHistory = false;
            instance.ignorePersistance = false;
            instance.options.editable = editable;
        }
        
        // Set default auto width on columns without width
        for(var ite_col=0; ite_col<instance.options.columns.length; ite_col++) {
            var column = instance.options.columns[ite_col];
            if(column.width==null || column.width=='') {
                instance.options.columns[ite_col].width="auto";
            }
        }
        
        return plugin;
    });

})));

// Compatibility Old version
window.jexcel_autoWidth = jss_autoWidth;