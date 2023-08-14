/**
 * Plugin for rename row header (Index) for jSpreadsheet Pro
 *
 * @version 2.0.4
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
        // Plugin object
        const plugin = {};

        // Set options
        plugin.options = Object.assign({},options);


        // Options
        const defaultOptions = {
            headerIndexTitle: '',
            rowIndexTitle: null,
            widthRowIndex: 50,
        };

        spreadsheet.config.worksheets[0].rows[0].title = "nok";

        // Set default value
        if(plugin.options==null) {
            plugin.options = {};
        }
        for(let property in defaultOptions) {
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
            let role = worksheet.options.role;
            if(role == null) {
                role = [];
            } else if(typeof role == "string") {
                role = [role];
            }

            if(role.indexOf("headerRename")!=-1 || spreadsheet.worksheets.length == 1) {
                if(plugin.options.headerIndexTitle) {
                    const HeaderIndex = worksheet.table.querySelector('.jss_selectall');
                    if(HeaderIndex) {
                        HeaderIndex.innerHTML = plugin.options.headerIndexTitle;
                        HeaderIndex.style.textAlign = "center";
                    }
                }

                if(plugin.options.widthRowIndex != 50) {
                    const colGroup = worksheet.table.querySelector('colgroup');
                    const firstCol = colGroup.firstElementChild;
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
            if(!worksheet.rows) {
                worksheet.rows = {};
            }
            if(typeof plugin.options.rowIndexTitle == "object" && Array.isArray(plugin.options.rowIndexTitle)) {
                for(let y=0; y<worksheet.rows.length; y++) {
                    if(!worksheet.rows[y]) {
                        worksheet.rows[y] = {};
                    }
                    const title = plugin.options.rowIndexTitle[y % plugin.options.rowIndexTitle.length];
                    worksheet.rows[y].title = title;
                    if(worksheet.rows[y].element) {
                        worksheet.rows[y].element.firstElementChild.innerHTML = title;
                    }
                }
            } else if(typeof plugin.options.rowIndexTitle == "object") {
                for(let y=0; y<worksheet.rows.length; y++) {
                    if(plugin.options.rowIndexTitle[y]) {
                        if(!worksheet.rows[y]) {
                            worksheet.rows[y] = {};
                        }
                        const title = plugin.options.rowIndexTitle[y];
                        worksheet.rows[y].title = title;
                        if(worksheet && worksheet.rows[y].element) {
                            worksheet.rows[y].element.firstElementChild.innerHTML = title;
                        }
                    }
                }
            } else if(typeof plugin.options.rowIndexTitle == "function") {
                for(let y=0; y<worksheet.rows.length; y++) {
                    if(!worksheet.rows[y]) {
                        worksheet.rows[y] = {};
                    }
                    worksheet.rows[y].title  = plugin.options.rowIndexTitle(y);
                    if(worksheet.rows[y].element) {
                        worksheet.rows[y].element.firstElementChild.innerHTML = worksheet.rows[y].title;
                    }
                }
            } else {
                for(let y=0; y<worksheet.data.length; y++) {
                    if(!worksheet.rows[y]) {
                        worksheet.rows[y] = {};
                    }
                    worksheet.rows[y].title  = plugin.options.rowIndexTitle;
                    if(worksheet.rows[y].element) {
                        worksheet.rows[y].element.firstElementChild.innerHTML = worksheet.rows[y].title;
                    }
                }
            }
        }

        return plugin;
    });


})));