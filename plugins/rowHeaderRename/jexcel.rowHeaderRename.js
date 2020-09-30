/**
 * Plugin for rename row header (Index)
 * 
 * @version 1.1.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * @description Can row index rename and header of index, resize row index
 * 
 * @license This plugin is distribute under MIT License
 */
var jexcel_rowHeaderRename = (function(instance, options) {

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
                var HeaderIndex = jexcel.current.worksheet.querySelector('.jexcel_selectall');
                if(HeaderIndex) {
                    HeaderIndex.innerText = plugin.options.headerIndexTitle;
                    HeaderIndex.style.textAlign = "center";
                }
            }
            
            if(plugin.options.widthRowIndex != 50) {
               var colGroup = jexcel.current.worksheet.querySelector('colgroup');
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
            if(plugin.options.rowIndexTitle[j]) {
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