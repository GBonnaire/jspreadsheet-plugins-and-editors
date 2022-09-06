/**
 * Plugin to add utils feature on jspreadsheet Pro
 *
 * @version 1.3.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description Plugin to add utils feature on jspreadsheet Pro like :
 *  - Move rows
 *  - Duplicate Row
 *  - Hide Sheet
 *  - Hide columns / show columns
 *  - Hide rows / show rows
 *  - Zoom
 *
 *  @event onzoom(worksheet: Object, zoomValue: int) dispatch on onevent in options of JSS
 *
 * @license This plugin is distribute under MIT License
 *
 * ReleaseNote :
 * 1.0 : Create plugin
 * 1.1 : Add zoom feature
 * 1.2 : Add hide / show row feature
 * 1.3 : Add show hidden rows and columns in 1 time
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
            global.jss_utils = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {
        // Plugin object
        const plugin = {};

        // var
        let saveIgnore = {};

        // Set options
        plugin.options = Object.assign({},options);

        // Options
        const defaultOptions = {
            allow: {
                moveRow: true,
                duplicateRow: true,
                hideSheet: true,
                hideColumn: true,
                hideRow: true,
                zoom: true,
            },
            icon: {
                moveUpRow:'arrow_upward',
                moveDownRow:'arrow_downward',
                duplicateRow:'content_copy',
                hideRow:'visibility_off',
                showRow:'visibility',
                showRows: 'visibility',
                hideColumn:'visibility_off',
                showColumn:'visibility',
                showColumns:'visibility',
                hideWorksheet:'visibility_off',
            },
            text: {
                moveUpRow: jSuites.translate('Move up row(s) selected'),
                moveDownRow: jSuites.translate('Move down row(s) selected'),
                duplicateRow: jSuites.translate('Duplicate row(s) selected'),
                hideRow: jSuites.translate('Hide row(s) selected'),
                showRow: jSuites.translate('Show hidden row ({0})'),
                showRows: jSuites.translate('Show hidden rows'),
                hideColumn: jSuites.translate('Hide column(s) selected'),
                showColumn: jSuites.translate('Show hidden column ({0})'),
                showColumns: jSuites.translate('Show hidden columns'),
                hideWorksheet: jSuites.translate("Hide this worksheet"),
            }
        };

        // Set default value
        if(plugin.options==null) {
            plugin.options = {};
        }
        for(const property in defaultOptions) {
            if (!plugin.options.hasOwnProperty(property) || plugin.options[property]==null ) {
                plugin.options[property] = defaultOptions[property];
            } else if(typeof defaultOptions[property] == "object" && !Array.isArray(defaultOptions[property])) {
                for(const subProperty in plugin.options[property]) {
                    if (!plugin.options[property].hasOwnProperty(subProperty) || plugin.options[property][subProperty]==null ) {
                        plugin.options[property][subProperty] = defaultOptions[property][subProperty];
                    }
                }
            }
        }

        /**
         * jSpreadsheet events
         */
        plugin.onevent = function(event, worksheet) {
            if(event == "onload") {
                tab.onload(spreadsheet.element, spreadsheet.element.tabs);
            }
            if(event == "onresize") {
                zoom.updateViewport(arguments[1], arguments[2]);
            }
            if(event == "onopenworksheet" || event == "oncreateworksheet") {
                zoom.update(worksheet);
            }

        };

        /**
         * Run on toolbar
         */
        plugin.toolbar = function(toolbar) {

            const itemZoomIn = {
                type: 'i',
                content: 'zoom_in',
                onclick: function () {
                    zoom.in(10);
                }
            };
            const itemZoomOut = {
                type: 'i',
                content: 'zoom_out',
                onclick: function () {
                    zoom.out(10);
                }
            };
            const itemZoomValue = {
                type: 'label',
                content: '100%',
                id: 'zoom_label',
                onclick: function () {
                    const newValue = prompt(jSuites.translate("Set new zoom value"), zoom.get());
                    zoom.set(newValue);
                },
                updateState(toolbarElement, toolbarInstance, itemElement, worksheet) {
                    itemElement.innerText = zoom.get(worksheet) + "%";
                }
            };

            toolbar.items.push({type: "divisor"});
            toolbar.items.push(itemZoomOut);
            toolbar.items.push(itemZoomValue);
            toolbar.items.push(itemZoomIn);

            return toolbar;
        };


        /**
         * Run on the context menu
         */
        plugin.contextMenu = function(obj, x, y, e, items, target) {
            const instance = getCurrentWorksheet();

            if(x==null && y!=null && obj.getSelectedRows(true).length) {
                let positionDivisor = 0;
                for(const ite_items in items) {
                    if(items[ite_items].type == "divisor" || items[ite_items].type == "line") {
                        positionDivisor = parseInt(ite_items)+1;
                        break;
                    }
                }

                if(instance.options.rowDrag && plugin.options.allow.moveRow) {
                    // Move Up
                    const newItemMoveUp = {
                        title:plugin.options.text.moveUpRow,
                        onclick:function() {
                            const rows = obj.getSelectedRows(true);
                            rows.forEach(function (row) {
                                obj.moveRow(row,row-1);
                            });

                            // Update selection
                            const x1 = 0;
                            const y1 = Math.min(rows);
                            const x2 = obj.options.data[0].length-1;
                            const y2 = Math.max(rows);
                            obj.updateSelectionFromCoords(x1, y1, x2, y2);
                        }
                    };

                    if(plugin.options.icon.moveUpRow) {
                        newItemMoveUp.icon = plugin.options.icon.moveUpRow;
                    }

                    items.splice(positionDivisor, 0, newItemMoveUp);
                    positionDivisor++;

                    // Move Down
                    const newItemMoveDown = {
                        title:plugin.options.text.moveDownRow,
                        onclick:function() {
                            const rows = obj.getSelectedRows(true);
                            rows.reverse().forEach(function (row) {
                                obj.moveRow(row,row+1);
                            });

                            // Update selection
                            const x1 = 0;
                            const y1 = Math.min(rows);
                            const x2 = obj.options.data[0].length-1;
                            const y2 = Math.max(rows);
                            obj.updateSelectionFromCoords(x1, y1, x2, y2);
                        }
                    };

                    if(plugin.options.icon.moveDownRow) {
                        newItemMoveDown.icon = plugin.options.icon.moveDownRow;
                    }

                    items.splice(positionDivisor, 0, newItemMoveDown);
                    positionDivisor++;
                }

                if(instance.options.editable && plugin.options.allow.duplicateRow) {
                    // Duplicate
                    const newItemDuplicateRow = {
                        title: plugin.options.text.duplicateRow,
                        onclick: function () {
                            const rows = obj.getSelectedRows(true);
                            let indexLastRow = Math.max(rows);

                            const dataRowsSelected = obj.getData(true);

                            // Duplicate rows
                            dataRowsSelected.forEach(function (row) {
                                obj.insertRow(row, indexLastRow);
                                indexLastRow++;
                            });

                            // Update selection
                            const x1 = 0;
                            const y1 = Math.min(rows);
                            const x2 = obj.options.data[0].length - 1;
                            const y2 = indexLastRow;
                            obj.updateSelectionFromCoords(x1, y1, x2, y2);
                        }
                    };

                    if (plugin.options.icon.duplicateRow) {
                        newItemDuplicateRow.icon = plugin.options.icon.duplicateRow;
                    }

                    items.splice(positionDivisor, 0, newItemDuplicateRow);
                    positionDivisor++;
                }

                if(plugin.options.allow.hideRow) {
                    // HideRow
                    const newItemHideRow = {
                        title: plugin.options.text.hideRow,
                        onclick: function () {
                            const rows = obj.getSelectedRows(true);
                            // hide rows
                            rows.forEach(function (row) {
                                obj.hideRow(row);
                            });
                        }
                    };

                    if (plugin.options.icon.hideRow) {
                        newItemHideRow.icon = plugin.options.icon.hideRow;
                    }

                    items.splice(positionDivisor, 0, newItemHideRow);
                    positionDivisor++;

                    const startRow = Math.min(...obj.getSelectedRows(true));
                    const endRow = Math.max(...obj.getSelectedRows(true));

                    const rowBefore = obj.getRow(startRow - 1);
                    const rowAfter = obj.getRow(endRow + 1);

                    if (rowBefore && rowBefore.visible === false) {
                        // ShowRowBefore
                        const newItemShowRowBefore = {
                            title: plugin.options.text.showRow.replace("{0}", rowBefore.title ? rowBefore.title : (startRow + 1 - 1) ),
                            onclick: function () {
                                obj.showRow(startRow - 1);
                            }
                        };

                        if (plugin.options.icon.showRow) {
                            newItemShowRowBefore.icon = plugin.options.icon.showRow;
                        }

                        items.splice(positionDivisor, 0, newItemShowRowBefore);
                        positionDivisor++;
                    }

                    if (rowAfter && rowAfter.visible === false) {
                        // ShowRowAfter
                        const newItemShowRowAfter = {
                            title: plugin.options.text.showRow.replace("{0}", rowAfter.title ? rowAfter.title : (endRow + 1 + 1)),
                            onclick: function () {
                                obj.showRow(endRow + 1);
                            }
                        };

                        if (plugin.options.icon.showRow) {
                            newItemShowRowAfter.icon = plugin.options.icon.showRow;
                        }

                        items.splice(positionDivisor, 0, newItemShowRowAfter);
                        positionDivisor++;
                    }

                    if(startRow != endRow) {
                        let flagHaveHideRows = false;
                        for(let ite_row = startRow + 1; ite_row < endRow; ite_row++) {
                            const row = obj.getRow(ite_row);
                            if(row.visible == false) {
                                flagHaveHideRows = true;
                                break;
                            }
                        }

                        if(flagHaveHideRows) {
                            // ShowRows
                            const newItemShowRows = {
                                title: plugin.options.text.showRows,
                                onclick: function (startRow, endRow) {
                                    return function () {
                                        for(let ite_row = startRow + 1; ite_row < endRow; ite_row++) {
                                            const row = obj.getRow(ite_row);
                                            if (row.visible == false) {
                                                obj.showRow(ite_row);
                                            }
                                        }
                                    };
                                }(startRow, endRow)
                            };

                            if (plugin.options.icon.showRows) {
                                newItemShowRows.icon = plugin.options.icon.showRows;
                            }

                            items.splice(positionDivisor, 0, newItemShowRows);
                            positionDivisor++;
                        }
                    }
                }

                items.splice(positionDivisor, 0, {type:"line"});
            } else if(y==null && x!=null &&  obj.getSelectedColumns().length) {
                let positionDivisor = 0;
                for(const ite_items in items) {
                    if(items[ite_items].title === jSuites.translate("Insert a new column before")) {
                        positionDivisor = parseInt(ite_items);
                        break;
                    }
                }

                if(plugin.options.allow.hideColumn) {
                    // HideColumn
                    const newItemHideColumn = {
                        title: plugin.options.text.hideColumn,
                        onclick: function () {
                            const cols = obj.getSelectedColumns();

                            // hide columns
                            cols.forEach(function (col) {
                                obj.hideColumn(col);
                            });
                        }
                    };

                    if (plugin.options.icon.hideColumn) {
                        newItemHideColumn.icon = plugin.options.icon.hideColumn;
                    }

                    items.splice(positionDivisor, 0, newItemHideColumn);
                    positionDivisor++;

                    const startColumn = Math.min(...obj.getSelectedColumns());
                    const endColumn = Math.max(...obj.getSelectedColumns());

                    const colBefore = obj.getColumn(startColumn - 1);
                    const colAfter = obj.getColumn(endColumn + 1);

                    if (colBefore && colBefore.visible === false) {
                        // ShowColumnBefore
                        const newItemShowColumnBefore = {
                            title: plugin.options.text.showColumn.replace("{0}", colBefore.title ? colBefore.title : jspreadsheet.helpers.getColumnName(startColumn - 1)),
                            onclick: function () {
                                obj.showColumn(startColumn - 1);
                            }
                        };

                        if (plugin.options.icon.showColumn) {
                            newItemShowColumnBefore.icon = plugin.options.icon.showColumn;
                        }

                        items.splice(positionDivisor, 0, newItemShowColumnBefore);
                        positionDivisor++;
                    }

                    if (colAfter && colAfter.visible === false) {
                        // ShowColumnAfter
                        const newItemShowColumnAfter = {
                            title: plugin.options.text.showColumn.replace("{0}", colAfter.title ? colAfter.title : jspreadsheet.helpers.getColumnName(endColumn + 1)),
                            onclick: function () {
                                obj.showColumn(endColumn + 1);
                            }
                        };

                        if (plugin.options.icon.showColumn) {
                            newItemShowColumnAfter.icon = plugin.options.icon.showColumn;
                        }

                        items.splice(positionDivisor, 0, newItemShowColumnAfter);
                        positionDivisor++;
                    }

                    if(startColumn != endColumn) {
                        let flagHaveHideColumns = false;
                        for(let ite_col = startColumn + 1; ite_col < endColumn; ite_col++) {
                            const col = obj.getColumn(ite_col);
                            if(col.visible == false) {
                                flagHaveHideColumns = true;
                                break;
                            }
                        }

                        if(flagHaveHideColumns) {
                            // ShowColumns
                            const newItemShowColumns = {
                                title: plugin.options.text.showColumns,
                                onclick: function (startColumn, endColumn) {
                                    return function () {
                                        for(let ite_col = startColumn + 1; ite_col < endColumn; ite_col++) {
                                            const col = obj.getColumn(ite_col);
                                            if (col.visible == false) {
                                                obj.showColumn(ite_col);
                                            }
                                        }
                                    };
                                }(startColumn, endColumn)
                            };

                            if (plugin.options.icon.showColumns) {
                                newItemShowColumns.icon = plugin.options.icon.showColumns;
                            }

                            items.splice(positionDivisor, 0, newItemShowColumns);
                            positionDivisor++;
                        }
                    }
                }
            } else if (x==null && y==null && target == "tabs") {
                let countTab = Array.isArray(spreadsheet.el.jspreadsheet) ? spreadsheet.el.jspreadsheet.length : 1;

                if(countTab > 1) {
                    if(plugin.options.allow.hideSheet) {
                        const newItemHideWorksheet = {
                            title: plugin.options.text.hideWorksheet,
                            onclick: function () {
                                let tabSelected = spreadsheet.el.tabs.headers.querySelector(".jtabs-selected");
                                if (tabSelected) {
                                    tabSelected.style.display = "none";
                                    //let WorksheetIndex = spreadsheet.getWorksheetActive();
                                    const WorksheetIndex = Array.prototype.indexOf.call(spreadsheet.el.tabs.headers.children, tabSelected);
                                    let direction = +1;
                                    let currentPosition = WorksheetIndex;
                                    for (let nbTry = 0; nbTry <= (spreadsheet.el.tabs.headers.children.length - 2); nbTry++) {
                                        currentPosition = currentPosition + direction;
                                        if (currentPosition < 0) {
                                            break;
                                        }
                                        const tab = spreadsheet.el.tabs.headers.children[currentPosition];
                                        if (tab.classList.contains("jtabs-border")) {
                                            direction = -1;
                                            currentPosition = WorksheetIndex;
                                        } else if (tab.style.display !== "none") {
                                            spreadsheet.el.tabs.open(currentPosition);
                                            break;
                                        }
                                    }
                                }
                            }
                        };

                        if (plugin.options.icon.hideWorksheet) {
                            newItemHideWorksheet.icon = plugin.options.icon.hideWorksheet;
                        }

                        items.unshift(newItemHideWorksheet);
                    }
                }
            }

            return items;
        };

        /**
         * Top menu
         * @param {string} name
         * @param {Array} items
         * @param {type} menuButton
         * @param {type} shortcut_base
         * @returns {array}
         */
        plugin.topMenu = function(name, items, menuButton, shortcut_base) {
            if(name === "Edit") {
                const instance = getCurrentWorksheet();
                const obj = instance;
                if(instance.selectedCell!=null) {
                    items.push({type:"line"});
                    if(instance.options.rowDrag) {
                        // Move Up
                        const newItemMoveUp = {
                            title:plugin.options.text.moveUpRow,
                            onclick:function() {
                                const rows = obj.getSelectedRows(true);
                                rows.forEach(function (row) {
                                    obj.moveRow(row,row-1);
                                });

                                // Update selection
                                const x1 = 0;
                                const y1 = Math.min(rows);
                                const x2 = obj.options.data[0].length-1;
                                const y2 = Math.max(rows);
                                obj.updateSelectionFromCoords(x1, y1, x2, y2);
                            }
                        };

                        if(plugin.options.icon.moveUpRow) {
                            newItemMoveUp.icon = plugin.options.icon.moveUpRow;
                        }

                        items.push(newItemMoveUp);

                        // Move Down
                        const newItemMoveDown = {
                            title:plugin.options.text.moveDownRow,
                            onclick:function() {
                                const rows = obj.getSelectedRows(true);
                                rows.reverse().forEach(function (row) {
                                    obj.moveRow(row,row+1);
                                });

                                // Update selection
                                const x1 = 0;
                                const y1 = Math.min(rows);
                                const x2 = obj.options.data[0].length-1;
                                const y2 = Math.max(rows);
                                obj.updateSelectionFromCoords(x1, y1, x2, y2);
                            }
                        };

                        if(plugin.options.icon.moveDownRow) {
                            newItemMoveDown.icon = plugin.options.icon.moveDownRow;
                        }

                        items.push(newItemMoveDown);
                    }

                    // Duplicate
                    const newItemDuplicate = {
                        title:plugin.options.text.duplicateRow,
                        onclick:function() {
                            const rows = obj.getSelectedRows(true);
                            let indexLastRow = Math.max(rows);

                            const dataRowsSelected = obj.getData(true);

                            // Duplicate rows
                            dataRowsSelected.forEach(function (row) {
                                obj.insertRow(row, indexLastRow);
                                indexLastRow++;
                            });

                            // Update selection
                            const x1 = 0;
                            const y1 = Math.min(rows);
                            const x2 = obj.options.data[0].length-1;
                            const y2 = indexLastRow;
                            obj.updateSelectionFromCoords(x1, y1, x2, y2);
                        }
                    };

                    if(plugin.options.icon.duplicateRow) {
                        newItemDuplicate.icon = plugin.options.icon.duplicateRow;
                    }

                    items.push(newItemDuplicate);
                }
            }

            return items;
        };

        const tab = function() {
            const component = {};
            /**
             * @param {HTMLElement} el
             * @param {Object} obj tabs
             */
            component.onload = function(el, obj) {
                const header = obj.headers.parentNode;
                const contextMenuElement = document.createElement("DIV");
                contextMenuElement.className = 'jss_contextmenu';
                el.appendChild(contextMenuElement);

                const contextMenu = jSuites.contextmenu(contextMenuElement, {
                    onclick:function() {
                        contextMenu.close();
                    }
                });

                const menuEl = document.createElement("DIV");
                menuEl.classList.add("jtabs-menu");
                menuEl.style.cursor = "pointer";

                const iconMenu = document.createElement("SPAN");
                iconMenu.classList.add("material-icons");
                iconMenu.innerHTML = "list";
                menuEl.append(iconMenu);

                menuEl.addEventListener("click", function(e) {
                    const clientRect = e.target.getBoundingClientRect();
                    const clientX = clientRect.left;
                    const clientY = clientRect.top+clientRect.height;

                    const coords = {x:clientX, y:clientY};

                    const items = [];

                    for(let ite_tab=0; ite_tab<obj.headers.children.length; ite_tab++) {
                        if(!obj.headers.children[ite_tab].classList.contains("jtabs-border")) {


                            const iconTabEl = obj.headers.children[ite_tab].querySelector(".material-icons");
                            let iconTab = null, titleTab = "";
                            if(iconTabEl) {
                                iconTab = iconTabEl.innerText;
                                titleTab = obj.headers.children[ite_tab].innerText.substring(iconTab.length);
                            } else {
                                titleTab = obj.headers.children[ite_tab].innerText;
                            }

                            if(obj.headers.children[ite_tab].style.display === "none") {
                                titleTab += " " + jSuites.translate("(hidden)");
                            }

                            items.push({
                                title: titleTab,
                                icon: iconTab,
                                disabled: obj.headers.children[ite_tab].classList.contains("jtabs-selected"),
                                onclick: function(index) {
                                    return function() {
                                        if (obj.headers.children[index].style.display === "none") {
                                            obj.headers.children[index].style.display = "";
                                        }
                                        obj.open(index);
                                    };
                                }(ite_tab)
                            });
                        }
                    }
                    if(obj.options.allowCreate) {
                        items.push({
                            title: jSuites.translate("New tab"),
                            icon: "add_box",
                            onclick: function() {
                                obj.create();
                            }
                        });
                    }

                    contextMenu.open(coords, items);
                });

                header.insertBefore(menuEl, header.firstChild);
            };

            return component;
        }();

        const zoom = function() {
            const component = {};

            component.init = function(instance) {
                if(instance == null) {
                    instance = getCurrentWorksheet();
                }

                if(instance.options.pluginOptions == null) {
                    instance.options.pluginOptions = {};
                }
                if(instance.options.pluginOptions.zoom == null) {
                    instance.options.pluginOptions.zoom = {
                        value: 100,
                    };
                    component.updateViewport();

                    if(!instance.options.tableOverflow) {
                        window.addEventListener('scroll', function() {
                            const instance = getCurrentWorksheet();
                            const scale = zoom.get(instance) / 100;

                            var offset = document.body.scrollTop - (document.body.scrollTop / scale);

                            for(const header of instance.headerContainer.children) {
                                header.style.top = `${-offset}px`;
                            }
                        });
                    }
                }
            };

            component.updateViewport = function (w, h, instance) {
                if(instance == null) {
                    instance = getCurrentWorksheet();
                }

                component.init(instance);
                if(w == null) {
                    w = parseInt(instance.content.style.width ? instance.content.style.width : instance.content.offsetWidth);
                }
                if(h == null) {
                    h = parseInt(instance.content.style.height ? instance.content.style.height : instance.content.style.offsetHeight);
                }

                instance.options.pluginOptions.zoom.tableWidthInit = parseInt(w * component.get(instance) / 100);
                if(isNaN(instance.options.pluginOptions.zoom.tableWidthInit)) {
                    instance.options.pluginOptions.zoom.tableWidthInit = null;
                }
                instance.options.pluginOptions.zoom.tableHeightInit = parseInt(h * component.get(instance) / 100);
                if(isNaN(instance.options.pluginOptions.zoom.tableHeightInit)) {
                    instance.options.pluginOptions.zoom.tableHeightInit = null;
                }

            };

            component.update = function(instance) {
                if(instance == null) {
                    instance = getCurrentWorksheet();
                }
                component.init(instance);

                const h = (instance.options.pluginOptions.zoom.tableHeightInit) / (component.get(instance) / 100);
                instance.content.style.marginBottom = `${instance.options.pluginOptions.zoom.tableHeightInit-parseInt(h)}px`;
            };

            component.set = function(value, instance) {
                if(isNaN(parseInt(value))) {
                    return;
                }

                if(instance == null) {
                    instance = getCurrentWorksheet();
                }

                const valueZoom = Math.max(10,Math.min(200, parseInt(value)));

                if(instance) {
                    instance.content.style.transform = "scale(" + (valueZoom / 100) + ")";
                    instance.content.style.transformOrigin = "top left";

                    component.init(instance);

                    instance.options.pluginOptions.zoom.value = valueZoom;

                    const w = (instance.options.pluginOptions.zoom.tableWidthInit) / (valueZoom / 100);
                    const h = (instance.options.pluginOptions.zoom.tableHeightInit) / (valueZoom / 100);

                    instance.content.style.marginBottom = `${instance.options.pluginOptions.zoom.tableHeightInit-parseInt(h)}px`;

                    if(instance.options.tableOverflow) {
                        enableIgnoreDispatch();
                        instance.setViewport(parseInt(w), parseInt(h));
                        disableIgnoreDispatch();
                    } else {
                        spreadsheet.toolbar.querySelector("#zoom_label").innerText = valueZoom + "%";
                    }

                    component.update(instance);
                    instance.dispatch("onzoom", instance, valueZoom);
                }
            };

            component.get = function(instance) {
                if(instance == null) {
                    instance = getCurrentWorksheet();
                }
                component.init(instance);

                return instance.options.pluginOptions.zoom.value;
            };

            component.in = function(step, instance) {
                this.set(component.get() + step, instance);
            };

            component.out = function(step, instance) {
                this.set(component.get() - step, instance);
            };


            return component;
        }();

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
         * enableIgnoreDispatch
         */
        const enableIgnoreDispatch = function() {
            if(saveIgnore.ignoreEvents==null) {saveIgnore.ignoreEvents = spreadsheet.ignoreEvents;}
            spreadsheet.ignoreEvents = true;
            if(saveIgnore.ignoreCloud==null) {saveIgnore.ignoreCloud = spreadsheet.ignoreCloud;}
            //spreadsheet.ignoreCloud = true;
            if(saveIgnore.ignoreHistory==null) {saveIgnore.ignoreHistory = spreadsheet.ignoreHistory;}
            spreadsheet.ignoreHistory = true;
            if(saveIgnore.ignorePersistence==null) {saveIgnore.ignorePersistence = spreadsheet.ignorePersistence;}
            spreadsheet.ignorePersistence = true;
        };

        /**
         * disableIgnoreDispatch
         */
        const disableIgnoreDispatch = function() {
            spreadsheet.ignoreEvents = saveIgnore.ignoreEvents;
            spreadsheet.ignoreHistory = saveIgnore.ignoreHistory;
            spreadsheet.ignorePersistence = saveIgnore.ignorePersistence;
            spreadsheet.ignoreCloud = saveIgnore.ignoreCloud;
            saveIgnore = {};
        };

        return plugin;
    });

})));