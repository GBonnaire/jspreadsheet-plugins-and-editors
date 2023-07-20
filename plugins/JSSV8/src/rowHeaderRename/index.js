/**
 * Plugin for rename row header (Index) for jSpreadsheet Pro
 * 
 * @deprecated on version 8, please use rows title property
 * 
 * @version 2.0.3
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description Can row index rename and header of index, resize row index
 * 
 * @license This plugin is distribute under MIT License
 * 
 * ReleaseNote
 * 2.0 Migration to JSS v8 
 * 1.2 compatibility NPM
 */
if (! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet');
}
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_rowHeaderRename = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {
        // check Version of JSS
        if(parseInt(jspreadsheet.version().version.split(".")[0]) < 8) {
            console.error("Plugin \"row Header Rename\" not compatible with jspreadsheet " + jspreadsheet.version().version + ", Please use an older version of this plugin compatible. Go to https://github.com/GBonnaire/jspreadsheet-plugins-and-editors/");
            return {};
        }
        
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
         * onload worksheet
         * @param {type} worksheet
         * @returns {undefined}
         */
        plugin.init = function(worksheet) {
            var role = worksheet.options.role;
            if(role == null) {
                role = [];
            } else if(typeof role == "string") {
                role = [role];
            }
            
            if(role.indexOf("headerRename")!=-1 || spreadsheet.worksheets.length == 1) {
                if(plugin.options.headerIndexTitle) {
                    var HeaderIndex = worksheet.table.querySelector('.jss_selectall');
                    if(HeaderIndex) {
                        HeaderIndex.innerHTML = plugin.options.headerIndexTitle;
                        HeaderIndex.style.textAlign = "center";
                    }
                }

                if(plugin.options.widthRowIndex != 50) {
                   var colGroup = worksheet.table.querySelector('colgroup');
                   var firstCol = colGroup.firstElementChild;
                   firstCol.width = plugin.options.widthRowIndex;
                }
                
                if(plugin.options.rowIndexTitle!=null) {
                    renameRowsHeader(worksheet);
                }
            }
        }

        /**
         * renameRowsHeader
         * @param {type} worksheet
         * @returns {undefined}
         */
        function renameRowsHeader(worksheet) {
            if(!worksheet.options.rows) {
                worksheet.options.rows = {};
            }
            if(typeof plugin.options.rowIndexTitle == "object" && Array.isArray(plugin.options.rowIndexTitle)) {
                for(var y=0; y<worksheet.options.data.length; y++) {
                    if(!worksheet.options.rows[y]) {
                        worksheet.options.rows[y] = {};
                    }
                    worksheet.options.rows[y].title = plugin.options.rowIndexTitle[y % plugin.options.rowIndexTitle.length];
                    if(worksheet.rows[y].element) {
                        worksheet.rows[y].element.firstElementChild.innerHTML = worksheet.options.rows[y].title;
                    }
                }
            } else if(typeof plugin.options.rowIndexTitle == "object") {
                for(var y=0; y<worksheet.options.data.length; y++) {
                    if(plugin.options.rowIndexTitle[y]) {
                        if(!worksheet.options.rows[y]) {
                            worksheet.options.rows[y] = {};
                        }
                        worksheet.options.rows[y].title = plugin.options.rowIndexTitle[y];
                        if(worksheet.rows[y].element) {
                            worksheet.rows[y].element.firstElementChild.innerHTML = worksheet.options.rows[y].title;
                        }
                    }
                }
            } else if(typeof plugin.options.rowIndexTitle == "function") {
                for(var y=0; y<worksheet.options.data.length; y++) {
                    if(!worksheet.options.rows[y]) {
                        worksheet.options.rows[y] = {};
                    }
                    worksheet.options.rows[y].title  = plugin.options.rowIndexTitle(y);
                    if(worksheet.rows[y].element) {
                        worksheet.rows[y].element.firstElementChild.innerHTML = worksheet.options.rows[y].title;
                    }
                }
            } else {
                for(var y=0; y<worksheet.options.data.length; y++) {
                    if(!worksheet.options.rows[y]) {
                        worksheet.options.rows[y] = {};
                    }
                    worksheet.options.rows[y].title  = plugin.options.rowIndexTitle;
                    if(worksheet.rows[y].element) {
                        worksheet.rows[y].element.firstElementChild.innerHTML = worksheet.options.rows[y].title;
                    }
                }
            }
        }

        return plugin;
    });

    
})));