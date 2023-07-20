/**
 * Plugin for top menu
 *
 * @version 2.0.5
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description add top menu on sheet
 * ReleaseNote:
 * 2.0 : Migrate on JSS v8
 * 1.1 : New organisation item
 * 1.0 : Init plugin
 * @license This plugin is distribute under MIT License
 */
if(! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

if(! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.jss_topmenu = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {
        let shortcut_base = "Ctrl +";
        if(/(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/.test(window.navigator.userAgent)) {
            shortcut_base = "⌘ +";
        }

        // Plugin object
        const plugin = {};

        // Set options
        plugin.options = Object.assign({},options);

        // var global
        plugin.topmenu = null;
        plugin.menus = [];

        // var
        let contextMenuElement = null;
        let contextMenu = null;

        let activeElement = null;
        let flagActiveMenu = false;

        // Options
        let defaultOptions = {
            text_file: jSuites.translate('File'),
            text_edit: jSuites.translate('Edit'),
            text_view: jSuites.translate('View'),
            text_item_rename: jSuites.translate('Rename'),
            text_item_insert: jSuites.translate('Insert'),
            text_item_delete: jSuites.translate('Delete'),
            text_item_newworksheet : jSuites.translate('New worksheet'),
            text_item_fullscreenexit: jSuites.translate('Exit fullscreen'),
            text_item_fullscreenenter: jSuites.translate('Enter fullscreen'),
            text_item_resetfilters: jSuites.translate('Reset filter(s)'),
            menus: {
                "File": function(el, i, menuButton) {
                    let items = [];

                    let tabSelected = el.tabs.headers.querySelector(".jtabs-selected");
                    let WorksheetIndex = spreadsheet.getWorksheetActive();
                    let countTab = Array.isArray(el.jspreadsheet) ? el.jspreadsheet.length : 1;

                    if(spreadsheet.config.tabs != false && spreadsheet.config.tabs.allowCreate == true) {
                        items.push({
                            icon: 'tab',
                            disabled: !i.options.editable,
                            title: plugin.options.text_item_newworksheet,
                            onclick: function() {
                                i.createWorksheet();
                            }
                        });



                        if(tabSelected && spreadsheet.config.allowRenameWorksheet == true) {
                            items.push({
                                icon: 'edit',
                                disabled: !i.options.editable,
                                title: jSuites.translate('Rename this worksheet')  + ` (${tabSelected.innerText})`,
                                onclick: function() {
                                    if(tabSelected!=null) {
                                        let newNameWorksheet = prompt(jSuites.translate('Rename this worksheet') , tabSelected.innerText);
                                        if(newNameWorksheet) {
                                            spreadsheet.renameWorksheet(WorksheetIndex, newNameWorksheet);
                                        }
                                    }
                                }
                            });
                        }

                        if(tabSelected && spreadsheet.config.allowDeleteWorksheet == true && countTab>1) {
                            items.push({
                                icon: 'tab_unselected',
                                disabled: !i.options.editable,
                                title: jSuites.translate('Delete this worksheet') + ` (${tabSelected.innerText})`,
                                onclick: function () {
                                    if(tabSelected!=null) {
                                        if(confirm(jSuites.translate('Are you sure to delete this worksheet?'), tabSelected.innerText)) {
                                            spreadsheet.deleteWorksheet(WorksheetIndex);
                                        }
                                    }
                                }
                            });
                        }

                        items.push({
                            type:'line'
                        });
                    }

                    if(spreadsheet.config.allowExport == true) {
                        items.push({
                            icon: 'save',
                            title: jSuites.translate('Save as')+` CSV`,
                            shortcut:shortcut_base + ' S',
                            onclick: function() {
                                i.download();
                            }
                        });

                        items.push({
                            type:'line'
                        });
                    }
                    if(spreadsheet.config.about) {
                        items.push({
                            icon: 'info',
                            title: jSuites.translate('About'),
                            onclick: function() {
                                if(spreadsheet.config.about === true) {
                                    alert(jspreadsheet.version(true));
                                } else {
                                    alert(spreadsheet.config.about);
                                }
                            }
                        });
                    }
                    return items;
                },
                "Edit": function(el, i, menuButton) {
                    let items = [];

                    items.push({
                        icon: 'undo',
                        title: jSuites.translate('Undo'),
                        disabled: !i.options.editable,
                        shortcut:shortcut_base + ' Z',
                        onclick: function() {
                            if(jspreadsheet.current) {
                                jspreadsheet.current.undo();
                            } else {
                                i.undo();
                            }
                        }
                    });

                    items.push({
                        icon: 'redo',
                        title: jSuites.translate('Redo'),
                        disabled: !i.options.editable,
                        shortcut:shortcut_base + ' Y',
                        onclick: function() {
                            if(jspreadsheet.current) {
                                jspreadsheet.current.redo();
                            } else {
                                i.redo();
                            }
                        }
                    });

                    items.push({
                        type:'line'
                    });

                    items.push({
                        icon: 'content_cut',
                        title: jSuites.translate('Cut'),
                        shortcut:shortcut_base + ' X',
                        onclick: function() {
                            if(jspreadsheet.current) {
                                jspreadsheet.current.copy(true);
                            } else {
                                i.copy(true);
                            }
                        }
                    });

                    items.push({
                        icon: 'content_copy',
                        title: jSuites.translate('Copy'),
                        shortcut:shortcut_base + ' C',
                        onclick: function() {
                            if(jspreadsheet.current) {
                                jspreadsheet.current.copy();
                            } else {
                                i.copy();
                            }
                        }
                    });

                    if(navigator && navigator.clipboard && navigator.clipboard.readText) {
                        items.push({
                            icon: 'content_paste',
                            title: jSuites.translate('Paste'),
                            disabled: !i.options.editable,
                            shortcut: shortcut_base + ' V',
                            onclick: function () {
                                if(i.selectedCell) {
                                    navigator.clipboard.readText().then(function (text) {
                                        if(text) {
                                            jspreadsheet.current.paste(i.selectedCell[0], i.selectedCell[1], text);
                                        }
                                    });
                                }
                            }
                        });
                    }



                    if(i.selectedCell!=null) {
                        items.push({
                            type:'line'
                        });

                        let itemsInsert = [];
                        let itemsDelete = [];
                        let itemsRename = [];


                        let cellStart = jspreadsheet.helpers.getColumnNameFromCoords(i.selectedCell[0], i.selectedCell[1]);
                        let cellEnd = jspreadsheet.helpers.getColumnNameFromCoords(i.selectedCell[2], i.selectedCell[3]);

                        let rangeColumnStart = cellStart.substring(0, cellStart.length - (""+(+i.selectedCell[1]+1)).length);
                        let rangeColumnEnd = cellEnd.substring(0, cellEnd.length - (""+(+i.selectedCell[3]+1)).length);

                        let rangeColumn;
                        if(rangeColumnStart!=rangeColumnEnd) {
                            rangeColumn = `${rangeColumnStart} - ${rangeColumnEnd}`;
                        } else {
                            rangeColumn = rangeColumnStart;
                        }

                        if(i.options.allowInsertColumn == true) {
                            itemsInsert.push({
                                title: jSuites.translate('Insert a new column before') + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.insertColumn(1, parseInt(i.selectedCell[0]), 1);
                                }
                            });
                            itemsInsert.push({
                                title: jSuites.translate('Insert a new column after') + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.insertColumn(1, parseInt(i.selectedCell[0]), 0);
                                }
                            });
                        }

                        if(i.options.allowDeleteColumn == true) {
                            itemsDelete.push({
                                title: jSuites.translate('Delete selected columns') + ` (${rangeColumn})`,
                                disabled: !i.options.editable,
                                onclick: function () {
                                    i.deleteColumn(i.getSelectedColumns().length ? undefined : parseInt(i.selectedCell[0]));
                                }
                            });
                        }

                        if(i.options.allowRenameColumn == true) {
                            itemsRename.push({
                                title: jSuites.translate('Rename this column') + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.setHeader(parseInt(i.selectedCell[0]));
                                }
                            });
                        }

                        let rangeRowStart = (+i.selectedCell[1] + 1);
                        let rangeRowEnd = (+i.selectedCell[3] + 1);
                        let rangeRow;
                        if(rangeRowStart != rangeRowEnd) {
                            rangeRow = `${rangeRowStart} - ${rangeRowEnd}`;
                        } else {
                            rangeRow = rangeRowStart;
                        }

                        if(i.options.allowInsertRow == true) {
                            itemsInsert.push({
                                title: jSuites.translate('Insert a new row before') + ` (${rangeRowStart})`,
                                onclick: function () {
                                    i.insertRow(1, parseInt(i.selectedCell[1]), 1);
                                }
                            });
                            itemsInsert.push({
                                title: jSuites.translate('Insert a new row after') + ` (${rangeRowStart})`,
                                onclick: function () {
                                    i.insertRow(1, parseInt(i.selectedCell[1]));
                                }
                            });
                        }

                        if(i.options.allowDeleteRow == true) {
                            itemsDelete.push({
                                title: jSuites.translate('Delete selected rows') + ` (${rangeRow})`,
                                disabled: !i.options.editable,
                                onclick: function () {
                                    i.deleteRow(i.getSelectedRows().length ? undefined : parseInt(i.selectedCell[1]));
                                }
                            });
                        }

                        if(itemsInsert.length>0) {
                            items.push({
                                title: plugin.options.text_item_insert,
                                icon: 'add',
                                submenu: itemsInsert
                            });
                        }

                        if(itemsDelete.length>0) {
                            items.push({
                                title: plugin.options.text_item_delete,
                                icon: 'remove',
                                submenu: itemsDelete
                            });
                        }

                        if(itemsRename.length>0) {
                            items.push({
                                title: plugin.options.text_item_rename,
                                icon: 'edit',
                                submenu: itemsRename
                            });
                        }


                    }

                    return items;
                },
                "View": function(el, i, menuButton) {
                    let items = [];

                    if(el.classList.contains("fullscreen")) {
                        items.push({
                            icon: 'fullscreen_exit',
                            title: plugin.options.text_item_fullscreenexit,
                            onclick: function() {
                                getCurrentWorksheet().fullscreen(false);
                            }
                        });
                    } else {
                        items.push({
                            icon: 'fullscreen',
                            title: plugin.options.text_item_fullscreenenter,
                            onclick: function() {
                                getCurrentWorksheet().fullscreen(true);
                            }
                        });
                    }

                    if(i.selectedCell!=null) {
                        const cellStart = jspreadsheet.helpers.getColumnNameFromCoords(i.selectedCell[0], i.selectedCell[1]);
                        //const cellEnd = jspreadsheet.helpers.getColumnNameFromCoords(i.selectedCell[2], i.selectedCell[3]);

                        const rangeColumnStart = cellStart.substring(0, cellStart.length - (""+(+i.selectedCell[1]+1)).length);

                        if(i.options.columnSorting == true) {
                            items.push({
                                type: 'line'
                            });
                            items.push({
                                title: jSuites.translate('Order ascending')  + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.orderBy(parseInt(i.selectedCell[0]), 0);
                                }
                            });
                            items.push({
                                title: jSuites.translate('Order descending')  + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.orderBy(parseInt(i.selectedCell[0]), 1);
                                }
                            });
                        }
                    }

                    if(i.options.filters == true) {
                        items.push({
                            type: 'line'
                        });
                        items.push({
                            title: plugin.options.text_item_resetfilters,
                            onclick: function() {
                                i.resetFilters();
                            }
                        });
                    }

                    return items;
                }
            }
        };


        // Set default value
        if(plugin.options==null) {
            plugin.options = {};
        }
        for(let property in defaultOptions) {
            if(!plugin.options.hasOwnProperty(property) || plugin.options[property]==null ) {
                plugin.options[property] = defaultOptions[property];
            }
        }

        /**
         * JSS events
         */
        plugin.onevent = function(event, worksheet) {
            if(event == "onload") {
                load();
            }
        };

        /**
         * JSpreadsheet contextmenu
         */
        plugin.contextMenu = function(obj, x, y, e, items) {
            if(isChildren(plugin.topmenu,e.target)) {
                return [];
            }

            return items;
        };

        /**
         * create main element for top menu
         * @private
         * @returns {undefined}
         */
        function init() {
            parseMenu();
            createTopmenubar();
            createMenus();


            document.addEventListener("keydown", function(e) {
                if(e.which == 27 && flagActiveMenu == true) { // Escape
                    closeMenu();
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            // When click out of topmenu
            document.addEventListener("click", function(e) {
                if(flagActiveMenu && (!isChildren(plugin.topmenu, e.target) || e.target == plugin.topmenu)) {
                    closeMenu();
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        }

        /**
         * Loading all element on document
         * @returns {undefined}
         */
        function load() {
            spreadsheet.tools.insertBefore(plugin.topmenu, spreadsheet.tools.firstChild);

            contextMenuElement = document.createElement("DIV");
            contextMenuElement.className = 'jss_contextmenu';

            contextMenu = jSuites.contextmenu(contextMenuElement, {
                onclick:function() {
                    closeMenu();
                }
            });

            spreadsheet.el.append(contextMenuElement);
        }

        /**
         * parseMenu
         * @private
         * @returns {undefined}
         */
        function parseMenu() {
            for(let menuName in plugin.options.menus) {
                plugin.menus.push({name:menuName, items:plugin.options.menus[menuName]});
            }
        }

        /**
         * create element top menu
         * @private
         * @returns {undefined}
         */
        function createTopmenubar() {
            plugin.topmenu = document.createElement("DIV");

            plugin.topmenu.classList.add("jss-topmenu");
            plugin.topmenu.classList.add('jexcel_object');
        }


        /**
         * Check if DOMElement is children of parent or = parent
         * @private
         * @param {type} parent
         * @param {type} child
         * @returns {Boolean}
         */
        function isChildren(parent, child) {
            if(child==parent) {
                return true;
            }
            if(child==document) {
                return false;
            }
            return isChildren(parent, child.parentNode);
        }


        /**
         * CreateMenus
         * @private
         * @returns {undefined}
         */
        function createMenus() {
            for(let ite_menu=0; ite_menu<plugin.menus.length; ite_menu++) {
                const item = plugin.menus[ite_menu];

                const menuItem = document.createElement("BUTTON");
                switch(item.name) {
                    case "File":
                        menuItem.innerHTML = plugin.options.text_file;
                        break;
                    case "Edit":
                        menuItem.innerHTML = plugin.options.text_edit;
                        break;
                    case "View":
                        menuItem.innerHTML = plugin.options.text_view;
                        break;
                    default:
                        menuItem.innerHTML = item.name;
                }

                menuItem.addEventListener("click", function(menuItems, name) {
                    return function(e) {
                        if(flagActiveMenu) {
                            if(this==activeElement) {
                                closeMenu();
                                return;
                            }
                        }

                        flagActiveMenu = true;
                        setActiveButton(this);

                        let clientRect = e.target.getBoundingClientRect();
                        let clientX = clientRect.left;
                        let clientY = clientRect.top+clientRect.height;

                        let coords = {x:clientX, y:clientY};

                        // Init items
                        let items;
                        if(typeof menuItems == "function") {
                            items = menuItems(spreadsheet.el, getCurrentWorksheet(), this);
                        } else {
                            items = menuItems.slice();
                        }

                        // Override with plugins
                        for(let pluginName in spreadsheet.plugins) {
                            let pluginJSS = spreadsheet.plugins[pluginName];
                            if(pluginJSS.topMenu && typeof pluginJSS.topMenu == "function") {
                                items = pluginJSS.topMenu(name, items, this, shortcut_base);
                            }
                        }

                        contextMenu.open(coords, items);

                        e.preventDefault();
                        e.stopPropagation();
                    };
                }(item.items, item.name));

                menuItem.addEventListener("mouseover", function(e) {
                    if(flagActiveMenu && e.target != activeElement) {
                        this.dispatchEvent(new Event("click"));
                    }
                });


                plugin.topmenu.append(menuItem);
            }
        }

        /**
         * setActiveButton
         * @private
         * @param {DOMElement} el
         * @returns {undefined}
         */
        function setActiveButton(el) {
            if(activeElement!=null) {
                removeActiveButton(activeElement);
            }
            el.classList.add("active");
            activeElement = el;
        }

        /**
         * removeActiveButton
         * @private
         * @param {DOMElement} el
         * @returns {undefined}
         */
        function removeActiveButton(el) {
            if(activeElement==el) {
                activeElement = null;
            }

            if(el==null) {
                return;
            }

            el.classList.remove("active");
            contextMenu.close();
        }

        /**
         * closeMenu
         * @private
         * @returns {undefined}
         */
        function closeMenu() {
            contextMenu.close();
            removeActiveButton(activeElement);
            flagActiveMenu = false;
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

        /**
         * add menu
         * @param {String} title
         * @param {Array|function} items
         * @param {int} [position]
         * @returns {undefined}
         */
        plugin.add = function(title, items, position) {
            if(plugin.topmenu != null) {
                if(items==null) {
                    items=[];
                }
                if(position!=null) {
                    plugin.menus.splice(position, 0, {name: title, items: items});
                } else {
                    plugin.menus.push({name: title, items: items});
                }

                plugin.refresh();
            } else {
                console.error("Topmenu bar is not loaded");
            }
        };
        spreadsheet.addTopmenu = plugin.add;

        /**
         * Refresh top menu
         * @returns {undefined}
         */
        plugin.refresh = function() {
            plugin.topmenu.innerHTML = "";
            createMenus();
        };

        init();
        return plugin;
    });

})));