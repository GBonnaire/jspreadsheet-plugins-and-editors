/**
 * Plugin for auto width cols
 *
 * @version 2.2.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description auto size width of columns
 * - autosize all columns without width property
 *
 * @license This plugin is distribute under MIT License
 */
if (! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet');
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
        const plugin = {};
        // Set options
        plugin.options = Object.assign({},options);

        let oldValue_styleTable = "";

        let columnsToResize = [];
        let saveIgnore={};

        // Options
        const defaultOptions = {
            fullsizeTable: false,
            parseAllData: true,
        };

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
         * jspreadsheet events
         */
        plugin.onevent = function(event, worksheet) {
            if(event === "onresizecolumn") {
                plugin.beforeinit(worksheet);
                run(worksheet);
            }
        };

        plugin.beforeinit = function(worksheet) {
            columnsToResize = [];
            for(let ite_col=0; ite_col<worksheet.options.columns.length; ite_col++) {
                const column = worksheet.options.columns[ite_col];
                if(column.width == null || column.width === '' || column.width === 'auto') {
                    columnsToResize.push(ite_col);
                    worksheet.options.columns[ite_col].width = 100;
                }
            }
        };

        plugin.init = function(worksheet) {
            run(worksheet);
        };

        /**
         * run calculate width of columns and apply
         * @returns {undefined}
         */
        const run = function(worksheet) {
            saveStyle(worksheet);
            setLayoutAuto(worksheet);
            const colsWidth = getWidthColumns(worksheet);
            removeLayoutAuto(worksheet);
            setWidthColumn(colsWidth, worksheet);
        };

        /**
         * save old style before change
         * @param {object} worksheet
         * @returns {undefined}
         */
        const saveStyle = function(worksheet) {
            oldValue_styleTable = worksheet.table.style.cssText;
        };

        /**
         * set style table layout
         * @param {object} worksheet
         * @returns {undefined}
         */
        const setLayoutAuto = function(worksheet) {
            worksheet.table.style.tableLayout="auto";
        };

        /**
         * remove style table layout
         * @param {object} worksheet
         * @returns {undefined}
         */
        const removeLayoutAuto = function(worksheet) {
            worksheet.table.style.cssText = oldValue_styleTable;
        };

        /**
         * get Width offset of columns
         * @param {object} worksheet
         * @returns {Array}
         */
        const getWidthColumns = function(worksheet) {
            const cols = [];
            if(worksheet.rows.length === 0) {
                return cols;
            }
            const tr = worksheet.rows[0].element;
            if(tr) {
                for(let ite_td=0; ite_td < tr.children.length; ite_td++) {
                    if(ite_td === 0) { // Skip index
                        continue;
                    }
                    const td = tr.children[ite_td];
                    let width = td.offsetWidth;
                    if(plugin.options.parseAllData) {
                        let maxLength = tr.children[0].innerText.length;
                        let widthInit = width;
                        for(let ite_row=0; ite_row<worksheet.rows.length; ite_row++) {
                            let valueRow = worksheet.getValueFromCoords(ite_td-1, ite_row, true);
                            if(typeof valueRow !== "string") {
                                if(valueRow === null) {
                                    valueRow = "";
                                } else {
                                    valueRow = "" + valueRow;
                                }
                            }
                            if(worksheet.rows[ite_row].element == null) {
                                width = Math.max(Math.ceil((valueRow.length / maxLength) * widthInit), width);
                            } else {
                                maxLength = Math.max(valueRow.length, maxLength);
                            }
                        }

                    }
                    cols.push(width);
                }
            }
            return cols;
        };

        /**
         * defined new columns width
         * @param {array} colsWidth
         * @param {object} worksheet
         * @returns {undefined}
         */
        const setWidthColumn = function(colsWidth, worksheet) {

            // Authorize edit colsWidth
            let editable = worksheet.options.editable;
            worksheet.options.editable = true;
            enableIgnoreDispatch(worksheet.parent);

            if(worksheet.options.defaultColWidth == null || worksheet.options.defaultColWidth === "" || worksheet.options.defaultColWidth === "auto") {
                worksheet.options.defaultColWidth = 50;
            } else if(typeof worksheet.options.defaultColWidth == "string") {
                worksheet.options.defaultColWidth = parseInt(worksheet.options.defaultColWidth);
            }

            // Parse cols - calculate good size
            let width_table = 0;
            let cols_size_total = 0;

            // Manage Option fullsizeTable
            if(plugin.options.fullsizeTable) {
                width_table = worksheet.table.parentNode.parentNode.offsetWidth - 26;

                if(!worksheet.table.classList.contains("jss_hidden_index")) {
                    width_table -= 50;
                }

                cols_size_total = colsWidth.reduce(function(accVal,val, index) {
                    if(columnsToResize.indexOf(index) > -1) {
                        if(index === 1 && columnsToResize.indexOf(0) === -1) {
                            return val;
                        } else {
                            return accVal+val;
                        }
                    } else {
                        if(index === 1 && columnsToResize.indexOf(0) === -1) {
                            return 0;
                        } else {
                            return accVal;
                        }
                    }
                });

                for(let ite_col=0; ite_col<worksheet.options.columns.length; ite_col++) {
                    const column = worksheet.options.columns[ite_col];
                    // Exclude hidden column
                    if(column.type === "hidden") {
                        continue;
                    }

                    if(columnsToResize.indexOf(ite_col) === -1) {
                        width_table = Math.max(0, width_table - parseFloat(column.width));
                    } else if(colsWidth[ite_col]<100) {
                        cols_size_total = Math.max(0, cols_size_total + (100-colsWidth[ite_col]));
                    }
                }
            }

            width_table = width_table - 7;

            // Parse cols - set width
            for(let ite_col=0; ite_col<worksheet.options.columns.length; ite_col++) {
                const column = worksheet.options.columns[ite_col];
                let newWidth;
                // Exclude hidden column
                if(column.type === "hidden") {
                    continue;
                }
                if(columnsToResize.indexOf(ite_col) > -1) {
                    if(colsWidth[ite_col]) {
                        newWidth = Math.max(worksheet.options.defaultColWidth, colsWidth[ite_col]);
                    } else {
                        newWidth = worksheet.options.defaultColWidth;
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
        };

        /**
         * enableIgnoreDispatch
         * @param {object} inst
         */
        const enableIgnoreDispatch = function(inst) {
            if(saveIgnore.ignoreEvents==null) {saveIgnore.ignoreEvents = inst.ignoreEvents;}
            inst.ignoreEvents = true;
            if(saveIgnore.ignoreCloud==null) {saveIgnore.ignoreCloud = inst.ignoreCloud;}
            if(saveIgnore.ignoreHistory==null) {saveIgnore.ignoreHistory = inst.ignoreHistory;}
            inst.ignoreHistory = true;
            if(saveIgnore.ignorePersistence==null) {saveIgnore.ignorePersistence = inst.ignorePersistence;}
            inst.ignorePersistence = true;
        };

        /**
         * disableIgnoreDispatch
         * @param {object} inst
         */
        const disableIgnoreDispatch = function(inst) {
            inst.ignoreEvents = saveIgnore.ignoreEvents;
            inst.ignoreHistory = saveIgnore.ignoreHistory;
            inst.ignorePersistence = saveIgnore.ignorePersistence;
            saveIgnore = {};
        };

        return plugin;
    });

})));