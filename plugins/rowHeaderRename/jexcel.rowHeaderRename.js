/**
 * Plugin for rename row header (Index)
 * 
 * @version 1.0.0
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
    function renameRowIndex(table) {
        for (var j = 0; j < table.rows.length; j++) {
            if(!table.rows[j].element) {
                continue;
            }
            if(typeof plugin.options.rowIndexTitle == "object" && Array.isArray(plugin.options.rowIndexTitle)) {
                table.rows[j].element.firstElementChild.innerText = plugin.options.rowIndexTitle[j % plugin.options.rowIndexTitle.length];
            } else if(typeof plugin.options.rowIndexTitle == "object") {
                if(plugin.options.rowIndexTitle[j]) {
                    table.rows[j].element.firstElementChild.innerText = plugin.options.rowIndexTitle[j];
                }
            } else if(typeof plugin.options.rowIndexTitle == "function") {
                table.rows[j].element.firstElementChild.innerText = plugin.options.rowIndexTitle(j);
            } else {
                table.rows[j].element.firstElementChild.innerText = plugin.options.rowIndexTitle;
            }
        }
    }
    
    // OverRide function createRow for LazyLoading
    var timeoutUpdate = null;
    var overridecreateRow = instance.createRow;
    /**
     * OverRide createRow
     * @returns {unresolved}
     */
    instance.createRow = function() {
        if(timeoutUpdate==null && plugin.options.rowIndexTitle!=null)  {
            timeoutUpdate = setTimeout(function() {
                renameRowIndex(jexcel.current);
                timeoutUpdate = null;
            },50);
        }
        
        return overridecreateRow(...arguments);
    }
    
    return plugin;
});