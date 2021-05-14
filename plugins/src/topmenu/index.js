/**
 * Plugin for top menu
 * 
 * @version 1.0.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description add top menu on sheet
 * 
 * @license This plugin is distribute under MIT License
 */
if(! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

if(! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet-pro');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_topmenu = factory();
}(this, (function () {
    return (function(instance, options) {
        var shortcut_base = "Ctrl +";
        if(/(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/.test(window.navigator.userAgent)) {
            shortcut_base = "⌘ +";
        }
        
        // Plugin object
        var plugin = {};
        
        // Set options
        plugin.options = Object.assign({},options);
        
        // var global
        plugin.topmenu = null;
        plugin.menus = [];
        
        // var
        var contextMenuElement = null;
        var contextMenu = null;
        
        var activeElement = null;
        var flagActiveMenu = false;
        
        // Options
        var defaultOptions = {
            text_file: 'File',
            text_edit: 'Edit',
            text_view: 'View',
            menus: {
                "File": function(el, i, menuButton) {
                    var items = [];
                    
                    var tabSelected = el.querySelector(".jtabs-selected");
                    var countTab = Array.isArray(el.jspreadsheet) ? el.jspreadsheet.length : 1;

                    if(countTab==1) {
                        var iFirst = i;
                    } else {
                        var iFirst = el.jspreadsheet[0];
                    }
                    
                    if(iFirst.options.tabs == true) {
                        items.push({
                            icon: 'tab',
                            disabled: !i.options.editable,
                            title: `New worksheet`,
                            onclick: function() {
                                i.createWorksheet();
                            }
                        });  
                        
                        
                        
                        if(iFirst.options.allowRenameWorksheet == true) {
                            items.push({
                                icon: 'edit',
                                disabled: !i.options.editable,
                                title: i.options.text.renameThisWorksheet  + ` (${tabSelected.innerText})`,
                                onclick: function() {
                                    if(tabSelected!=null) {
                                        var newNameWorksheet = prompt(i.options.text.renameThisWorksheet, tabSelected.innerText);
                                        if(newNameWorksheet) {
                                            iFirst.renameWorksheet(tabSelected, newNameWorksheet);
                                        }
                                    }
                                }
                            }); 
                        }
                        
                        if(iFirst.options.allowDeleteWorksheet == true && countTab>1) {
                            items.push({
                                icon: 'tab_unselected',
                                disabled: !i.options.editable,
                                title: i.options.text.deleteThisWorksheet + ` (${tabSelected.innerText})`,
                                onclick: function () {
                                    if(tabSelected!=null) {
                                        if(confirm(i.options.text.areYouSureDeleteThisWorksheet, tabSelected.innerText)) {
                                            iFirst.deleteWorksheet(tabSelected);
                                        }
                                    }
                                }
                            })
                        };
                        
                        items.push({
                            type:'line'
                        });
                    }
                    
                    if(i.options.allowExport == true) {
                        items.push({
                            icon: 'save',
                            title: i.options.text.saveAs+` CSV`,
                            shortcut:shortcut_base + ' S',
                            onclick: function() {
                                i.download();
                            }
                        });  
                        
                        items.push({
                            type:'line'
                        });
                    }
                    if(i.options.about) {
                        items.push({
                            icon: 'info',
                            title: i.options.text.about,
                            onclick: function() {
                                if(i.options.about === true) {
                                    alert(jspreadsheet.version(true));
                                } else {
                                    alert(i.options.about);
                                }
                            }
                        }); 
                    }
                            
                    return items;
                },
                "Edit": function(el, i, menuButton) {
                    var items = [];
                    
                    items.push({
                        icon: 'undo',
                        title: i.options.text.undo ? i.options.text.undo : "Undo",
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
                        title: i.options.text.redo ? i.options.text.redo : "Redo",
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
                        title: i.options.text.cut,
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
                        title: i.options.text.copy,
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
                            title: i.options.text.paste,
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
                    };
                    
                    items.push({
                        type:'line'
                    });
                    
                    if(i.selectedCell!=null) {
                        var cellStart = jspreadsheet.getColumnNameFromId([i.selectedCell[0], i.selectedCell[1]]);
                        var cellEnd = jspreadsheet.getColumnNameFromId([i.selectedCell[2], i.selectedCell[3]]);
                        
                        var rangeColumnStart = cellStart.substring(0, cellStart.length - (""+i.selectedCell[1]).length);
                        var rangeColumnEnd = cellEnd.substring(0, cellEnd.length - (""+i.selectedCell[3]).length);
                        
                        if(rangeColumnStart!=rangeColumnEnd) {
                                var rangeColumn = `${rangeColumnStart} - ${rangeColumnEnd}`;
                            } else {
                                var rangeColumn = rangeColumnStart;
                            }
                        
                        if(i.options.allowInsertColumn == true) {                            
                            items.push({
                                title: i.options.text.insertANewColumnBefore + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.insertColumn(1, parseInt(i.selectedCell[0]), 1);
                                }
                            });
                            items.push({
                                title: i.options.text.insertANewColumnAfter + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.insertColumn(1, parseInt(i.selectedCell[0]), 0);
                                }
                            });
                        };
                        
                        if(i.options.allowDeleteColumn == true) {
                            items.push({
                                title: i.options.text.deleteSelectedColumns + ` (${rangeColumn})`,
                                disabled: !i.options.editable,
                                onclick: function () {
                                    i.deleteColumn(i.getSelectedColumns().length ? undefined : parseInt(i.selectedCell[0]));
                                }
                            });
                        }
                        
                        if(i.options.allowRenameColumn == true) {
                            items.push({
                                title: i.options.text.renameThisColumn + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.setHeader(parseInt(i.selectedCell[0]));
                                }
                            });
                        };
                        
                        items.push({
                            type:'line'
                        });
                        
                        var rangeRowStart = (+i.selectedCell[1] + 1);
                        var rangeRowEnd = (+i.selectedCell[3] + 1);
                        if(rangeRowStart != rangeRowEnd) {
                            var rangeRow = `${rangeRowStart} - ${rangeRowEnd}`;
                        } else {
                            var rangeRow = rangeRowStart;
                        }
                        
                        if(i.options.allowInsertRow == true) {
                            items.push({
                                title: i.options.text.insertANewRowBefore + ` (${rangeRowStart})`,
                                onclick: function () {
                                    i.insertRow(1, parseInt(i.selectedCell[1]), 1)
                                }
                            });
                            items.push({
                                title: i.options.text.insertANewRowAfter + ` (${rangeRowStart})`,
                                onclick: function () {
                                    i.insertRow(1, parseInt(i.selectedCell[1]))
                                }
                            });
                        };

                        if(i.options.allowDeleteRow == true) {
                            items.push({
                                title: i.options.text.deleteSelectedRows + ` (${rangeRow})`,
                                disabled: !i.options.editable,
                                onclick: function () {
                                    i.deleteRow(i.getSelectedRows().length ? undefined : parseInt(i.selectedCell[1]));
                                }
                            });
                        }
                    }
                    
                    return items;
                },
                "View": function(el, i, menuButton) {
                    var items = [];
                    
                    if(el.classList.contains("fullscreen")) {
                        items.push({
                            icon: 'fullscreen_exit',
                            title: 'Exit fullscreen',
                            onclick: function() {
                                instance.fullscreen(false);
                            }
                        });
                    } else {
                        items.push({
                            icon: 'fullscreen',
                            title: 'Enter fullscreen',
                            onclick: function() {
                                instance.fullscreen(true);
                            }
                        });
                    }
                    
                    if(i.selectedCell!=null) {
                        var cellStart = jspreadsheet.getColumnNameFromId([i.selectedCell[0], i.selectedCell[1]]);
                        var cellEnd = jspreadsheet.getColumnNameFromId([i.selectedCell[2], i.selectedCell[3]]);
                        
                        var rangeColumnStart = cellStart.substring(0, cellStart.length - (""+i.selectedCell[1]).length);
                        //var rangeColumnEnd = cellEnd.substring(0, cellEnd.length - (""+i.selectedCell[3]).length);
                        
                        if(i.options.columnSorting == true) {
                            items.push({
                                type: 'line'
                            });
                            items.push({
                                title: i.options.text.orderAscending  + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.orderBy(parseInt(i.selectedCell[0]), 0);
                                }
                            });
                            items.push({
                                title: i.options.text.orderDescending  + ` (${rangeColumnStart})`,
                                onclick: function () {
                                    i.orderBy(parseInt(i.selectedCell[0]), 1);
                                }
                            })
                        }
                    }
                    
                    if(i.options.filters == true) {
                        items.push({
                            type: 'line'
                        });
                        items.push({
                           title: 'Reset filter(s)',
                           onclick: function() {
                               i.resetFilters();
                           }
                        });
                    }
                    
                    return items;
                }
            }
        }


       // Set default value
       if(plugin.options==null) {
           plugin.options = {};
       }
       for(var property in defaultOptions) {
            if(!plugin.options.hasOwnProperty(property) || plugin.options[property]==null ) {
                plugin.options[property] = defaultOptions[property];
            }

            if(property.substring(0,5)==="text_") {
                var propertyText = "topmenu_" + property.substring(5,property.length);
                if(instance.options.text[propertyText]) {
                    plugin.options[property] = instance.options.text[propertyText];
                }
            } 
       }
        
        /**
         * Jexcel events
         */
        plugin.onevent = function(event) {
            if(event=="onload") {      
                load();
            } 
        }
        
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
            instance.worksheet.insertBefore(plugin.topmenu, instance.worksheet.firstChild);
            
            contextMenuElement = document.createElement("DIV");
            contextMenuElement.className = 'jexcel_contextmenu';
            
            contextMenu = jSuites.contextmenu(contextMenuElement, {
                onclick:function() {
                    closeMenu();
                }
            });
            
            instance.el.append(contextMenuElement);
        }
        
        /**
         * parseMenu
         * @private
         * @returns {undefined}
         */
        function parseMenu() {
            for(var menuName in plugin.options.menus) {
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
            for(var ite_menu=0; ite_menu<plugin.menus.length; ite_menu++) {
                var item = plugin.menus[ite_menu];
                
                var menuItem = document.createElement("BUTTON");
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

                        var clientRect = e.target.getBoundingClientRect();
                        var clientX = clientRect.left;
                        var clientY = clientRect.top+clientRect.height;

                        var coords = {x:clientX, y:clientY};

                        // Init items
                        if(typeof menuItems == "function") {
                            var items = menuItems(instance.el, instance, this);
                        } else {
                            var items = menuItems.slice();
                        }
                        
                        // Override with plugins
                        for(var pluginName in instance.plugins) {
                            var pluginJSS = instance.plugins[pluginName];
                            if(pluginJSS["topMenu"] && typeof pluginJSS.topMenu == "function") {
                                items = pluginJSS.topMenu(name, items, this, shortcut_base);
                            }
                        }
                        
                        contextMenu.open(coords, items);
                        
                        e.preventDefault();
                        e.stopPropagation();
                    }
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
        }
        instance.addTopmenu = plugin.add;
        
        /**
         * Refresh top menu
         * @returns {undefined}
         */
        plugin.refresh = function() {
            plugin.topmenu.innerHTML = "";
            createMenus();
        }
        
        init();
        return plugin;
    });

})));