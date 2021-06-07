/**
 * Plugin advanced actions for rows in context menu for jExcel Pro / jSpreadSheet
 * 
 * @version 1.2.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description add item on contextmenu for rows
 * 
 * @license This plugin is distribute under MIT License
 * 
 * ReleaseNote :
 * 1.2 : Add Integration top menu
 * 1.1 : Add compatibility NPM
 */

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_contextmenu_rowAdvancedActions = factory();
        // Compatibility Old version
    global.jexcel_contextmenu_rowAdvancedActions = global.jss_contextmenu_rowAdvancedActions;
}(this, (function () {
    return (function(instance, options) {    
        // Plugin object
        var plugin = {};

        // Set options
        plugin.options = Object.assign({},options);

        // Options
        var defaultOptions = {
              icon_moveup:'arrow_upward',
              icon_movedown:'arrow_downward',
              icon_duplicate:'content_copy',
              text_moveup: 'Move up row(s) selected',
              text_movedown: 'Move down row(s) selected',
              text_duplicate: 'Duplicate row(s) selected'
        }

       // Set default value
       if(plugin.options==null) {
           plugin.options = {};
       }
       for(var property in defaultOptions) {
            if (!plugin.options.hasOwnProperty(property) || plugin.options[property]==null ) {
                plugin.options[property] = defaultOptions[property];
            }

            if(property.substring(0,5)==="text_") {
                var propertyText = "contextmenurowsadvancedactions_" + property.substring(5,property.length);
                if(instance.options.text[propertyText]) {
                    plugin.options[property] = instance.options.text[propertyText];
                }
            }
       }


        /**
         * Run on the context menu
         */
        plugin.contextMenu = function(obj, x, y, e, items) {
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
                                var y = parseInt(row.getAttribute('data-y'));
                                obj.moveRow(y,y-1);
                            });

                            // Update selection
                            var x1 = 0;
                            var y1 = parseInt(rows[0].getAttribute('data-y'));
                            var x2 = obj.options.data[0].length-1;
                            var y2 = parseInt(rows[rows.length-1].getAttribute('data-y'));
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
                                var y = parseInt(row.getAttribute('data-y'));
                                obj.moveRow(y,y+1);
                            });

                            // Update selection
                            var x1 = 0;
                            var y1 = parseInt(rows[0].getAttribute('data-y'));
                            var x2 = obj.options.data[0].length-1;
                            var y2 = parseInt(rows[rows.length-1].getAttribute('data-y'));
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
                        var indexLastRow = parseInt(rows[rows.length-1].getAttribute('data-y'));

                        var dataRowsSelected = obj.getData(true);

                        // Duplicate rows
                        dataRowsSelected.forEach(function (row) {
                            obj.insertRow(row, indexLastRow);
                            indexLastRow++;
                        });

                        // Update selection
                        var x1 = 0;
                        var y1 = parseInt(rows[0].getAttribute('data-y'));
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
                                    var y = parseInt(row.getAttribute('data-y'));
                                    obj.moveRow(y,y-1);
                                });

                                // Update selection
                                var x1 = 0;
                                var y1 = parseInt(rows[0].getAttribute('data-y'));
                                var x2 = obj.options.data[0].length-1;
                                var y2 = parseInt(rows[rows.length-1].getAttribute('data-y'));
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
                                    var y = parseInt(row.getAttribute('data-y'));
                                    obj.moveRow(y,y+1);
                                });

                                // Update selection
                                var x1 = 0;
                                var y1 = parseInt(rows[0].getAttribute('data-y'));
                                var x2 = obj.options.data[0].length-1;
                                var y2 = parseInt(rows[rows.length-1].getAttribute('data-y'));
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
                            var indexLastRow = parseInt(rows[rows.length-1].getAttribute('data-y'));

                            var dataRowsSelected = obj.getData(true);

                            // Duplicate rows
                            dataRowsSelected.forEach(function (row) {
                                obj.insertRow(row, indexLastRow);
                                indexLastRow++;
                            });

                            // Update selection
                            var x1 = 0;
                            var y1 = parseInt(rows[0].getAttribute('data-y'));
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

        return plugin;
    });
    
}))); 