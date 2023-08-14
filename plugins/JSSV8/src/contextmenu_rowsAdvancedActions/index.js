/**
 * Plugin advanced actions for rows in context menu for jSpreadSheet Pro
 *
 * @version 2.1.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description add item on contextmenu for rows
 *
 * @license This plugin is distribute under MIT License
 *
 * ReleaseNote :
 * 2.1 : Migration v10
 * 2.0 : Migration v8
 * 1.2 : Add Integration top menu
 * 1.1 : Add compatibility NPM
 */
if(! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.jss_contextmenu_rowAdvancedActions = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {
        // Plugin object
        var plugin = {};

        // Set options
        plugin.options = Object.assign({},options);

        // Options
        var defaultOptions = {
            icon_moveup:'arrow_upward',
            icon_movedown:'arrow_downward',
            icon_duplicate:'content_copy',
            text_moveup: jSuites.translate('Move up row(s) selected'),
            text_movedown: jSuites.translate('Move down row(s) selected'),
            text_duplicate: jSuites.translate('Duplicate row(s) selected')
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
         * Run on the context menu
         */
        plugin.contextMenu = function(obj, x, y, e, items) {
            var instance = getCurrentWorksheet();
            if(x==null && obj.getSelectedRows().length) {

                var positionDivisor = 0;
                for(var ite_items in items) {
                    if(items[ite_items].type == "divisor" || items[ite_items].type == "line") {
                        positionDivisor = parseInt(ite_items)+1;
                        break;
                    }
                }

                if(instance.options.rowDrag) {
                    // Move Up
                    var newItem = {
                        title:plugin.options.text_moveup,
                        onclick:function() {
                            var rows = obj.getSelectedRows();
                            rows.forEach(function (row) {
                                var y = row;
                                obj.moveRow(y,y-1);
                            });

                            // Update selection
                            var x1 = 0;
                            var y1 = Math.max(0, rows[0]-1);
                            var x2 = obj.options.data[0].length-1;
                            var y2 = Math.max(0, rows[rows.length-1]-1);
                            obj.updateSelectionFromCoords(x1, y1, x2, y2);
                        }
                    };

                    if(plugin.options.icon_moveup) {
                        newItem.icon = plugin.options.icon_moveup;
                    }

                    items.splice(positionDivisor, 0, newItem);
                    positionDivisor++;

                    // Move Down
                    var newItem = {
                        title:plugin.options.text_movedown,
                        onclick:function() {
                            var rows = obj.getSelectedRows();
                            rows.reverse().forEach(function (row) {
                                var y = row;
                                obj.moveRow(y,y+1);
                            });

                            // Update selection
                            var x1 = 0;
                            var y1 = rows[0]+1;
                            var x2 = obj.options.data[0].length-1;
                            var y2 = rows[rows.length-1]+1;
                            obj.updateSelectionFromCoords(x1, y1, x2, y2);
                        }
                    };

                    if(plugin.options.icon_movedown) {
                        newItem.icon = plugin.options.icon_movedown;
                    }

                    items.splice(positionDivisor, 0, newItem);
                    positionDivisor++;
                }

                // Duplicate
                var newItem = {
                    title:plugin.options.text_duplicate,
                    onclick:function() {
                        var rows = obj.getSelectedRows();
                        var indexLastRow = rows[rows.length-1];

                        var dataRowsSelected = obj.getData(true);
                        // Duplicate rows
                        const dataToAdd = [];
                        dataRowsSelected.forEach(function (rowData) {
                            dataToAdd.push({row: +indexLastRow+1, data: rowData});
                            indexLastRow++;
                        });
                        obj.insertRow(dataToAdd);

                        // Update selection
                        var x1 = 0;
                        var y1 = rows[0];
                        var x2 = obj.options.data[0].length-1;
                        var y2 = indexLastRow;
                        obj.updateSelectionFromCoords(x1, y1, x2, y2);
                    }
                };

                if(plugin.options.icon_duplicate) {
                    newItem.icon = plugin.options.icon_duplicate;
                }

                items.splice(positionDivisor, 0, newItem);
                positionDivisor++;
                items.splice(positionDivisor, 0, {type:"line"});
            }

            return items;
        }

        /**
         * Top menu
         * @param {type} name
         * @param {type} items
         * @param {type} menuButton
         * @param {type} shortcut_base
         * @returns {array}
         */
        plugin.topMenu = function(name, items, menuButton, shortcut_base) {
            if(name == "Edit") {
                var instance = getCurrentWorksheet();
                var obj = instance;
                if(instance.selectedCell!=null) {
                    items.push({type:"line"});
                    if(instance.options.rowDrag) {
                        // Move Up
                        var newItem = {
                            title:plugin.options.text_moveup,
                            onclick:function() {
                                var rows = obj.getSelectedRows();
                                rows.forEach(function (row) {
                                    var y = row;
                                    obj.moveRow(y,y-1);
                                });

                                // Update selection
                                var x1 = 0;
                                var y1 = Math.max(0,rows[0]-1);
                                var x2 = obj.options.data[0].length-1;
                                var y2 = Math.max(0, rows[rows.length-1]-1);
                                obj.updateSelectionFromCoords(x1, y1, x2, y2);
                            }
                        };

                        if(plugin.options.icon_moveup) {
                            newItem.icon = plugin.options.icon_moveup;
                        }

                        items.push(newItem);

                        // Move Down
                        var newItem = {
                            title:plugin.options.text_movedown,
                            onclick:function() {
                                var rows = obj.getSelectedRows();
                                rows.reverse().forEach(function (row) {
                                    var y = row;
                                    obj.moveRow(y,y+1);
                                });

                                // Update selection
                                var x1 = 0;
                                var y1 = rows[0]+1;
                                var x2 = obj.options.data[0].length-1;
                                var y2 = rows[rows.length-1]+1;
                                obj.updateSelectionFromCoords(x1, y1, x2, y2);
                            }
                        };

                        if(plugin.options.icon_movedown) {
                            newItem.icon = plugin.options.icon_movedown;
                        }

                        items.push(newItem);
                    }

                    // Duplicate
                    var newItem = {
                        title:plugin.options.text_duplicate,
                        onclick:function() {
                            var rows = obj.getSelectedRows();
                            var indexLastRow = rows[rows.length-1];

                            var dataRowsSelected = obj.getData(true);

                            // Duplicate rows
                            const dataToAdd = [];
                            dataRowsSelected.forEach(function (rowData) {
                                dataToAdd.push({row: +indexLastRow+1, data: rowData});
                                indexLastRow++;
                            });
                            obj.insertRow(dataToAdd);

                            // Update selection
                            var x1 = 0;
                            var y1 = rows[0];
                            var x2 = obj.options.data[0].length-1;
                            var y2 = indexLastRow;
                            obj.updateSelectionFromCoords(x1, y1, x2, y2);
                        }
                    };

                    if(plugin.options.icon_duplicate) {
                        newItem.icon = plugin.options.icon_duplicate;
                    }

                    items.push(newItem);
                }
            }

            return items;
        }

        /**
         * get current worksheet
         * @returns {object}
         */
        function getCurrentWorksheet() {
            if(jspreadsheet.current) {
                return jspreadsheet.current;
            }
            if(spreadsheet.getWorksheetActive() != null) {
                return spreadsheet.worksheets[spreadsheet.getWorksheetActive()];
            }
            return spreadsheet.worksheets[0];
        }

        return plugin;
    });

}))); 