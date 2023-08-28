/**
 * Plugin copy paste advance for jSpreadsheet
 *
 * @version 3.3.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description upgrade copy paste function for work with clipboard permission denied or error
 * and add button on toolbar copy/cut/paste
 *
 * @license This plugin is distributed under MIT License
 *
 * ReleaseNote
 * 3.3.0 : Add Transpose paste + Add paste only value and formula
 * 3.2.0 : Select several cells to copy & paste
 * 3.1.0 : Migration V10
 * 3.0.0 : version for v8 and v9
 * 2.1.0 : add topmenu compatibility
 * 2.0.1 : transform jexcel to jspreadsheet
 * 2.0.0 : compatibility NPM + add special paste (paste only value, paste only style, paste style from clipboard)
 */
if (! jspreadsheet && typeof(require) === 'function') {
    var jspreadsheet = require('jspreadsheet');
}

if (! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            global.jss_copypaste_advanced = factory();
}(this, (function () {
    return (function(spreadsheet, options) {
        // check Version of JSS
        if(parseInt(jspreadsheet.version().version.split(".")[0]) < 8) {
            console.error("Plugin \"Copy paste advanced\" not compatible with jspreadsheet " + jspreadsheet.version().version + ", Please use an older version of this plugin compatible. Go to https://github.com/GBonnaire/jspreadsheet-plugins-and-editors/");
            return {};
        }

        var list_cellsSelected = {};
        var list_borders = [];
        var previous_selection = null;
        var flag_copy_run = false;
        var fx_to_apply_on_before_paste = null;

        var keyboard_CTRL_Pressed = false;

        // Plugin object
        var plugin = {};

        // Set options
        plugin.options = Object.assign({},options);

        // Options
        var defaultOptions = {
            allow_pastestyle: true,
            text_paste_special: jSuites.translate("Paste special"),
            text_paste_only_style: jSuites.translate("Paste only format"),
            text_paste_only_value: jSuites.translate("Paste only value"),
            text_paste_only_formula: jSuites.translate("Paste only value and formula"),
            text_transpose: jSuites.translate("Transpose"),
            text_paste_transpose: jSuites.translate("Paste with transpose"),
            text_paste_transpose_only_value: jSuites.translate("Paste only value with transpose"),
            text_paste_transpose_only_formula: jSuites.translate("Paste only value and formula with transpose"),
            position_toolbar: null,
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

        plugin.init = function(worksheet) {
            // Init for each worksheet
            worksheet.table.addEventListener("mousedown", function() {
                if(keyboard_CTRL_Pressed) {
                    if(flag_copy_run) {
                        flag_copy_run = false;
                        removeBorder();
                    }
                    var x1 = previous_selection[0];
                    var y1 = previous_selection[1];
                    var x2 = previous_selection[2];
                    var y2 = previous_selection[3];
                    onclick(worksheet, x1, y1, x2, y2);
                }
            });
            worksheet.element.addEventListener("mouseup", function() {
                previous_selection = worksheet.selectedCell;
            });
        }

        /**
         * Run on the context menu
         */
        plugin.contextMenu = function(obj, x, y, e, items, section, a1, a2) {
            var flag_found_paste = false;
            var position_copy = -1;
            for(var ite_items in items) {
                var item = items[ite_items];
                if(item.title == jSuites.translate("Paste")) {
                    item.onclick = function() {
                        if (obj.selectedCell) {
                            plugin.paste();
                        }
                    }
                    flag_found_paste = true;
                    break;
                }

                if(item.title == jSuites.translate("Copy")) {
                    position_copy = parseInt(ite_items);
                }
            }

            if(!flag_found_paste && position_copy!=-1 && (jspreadsheet.dataCopied || (navigator && navigator.clipboard))) {
                // Add paste after copy
                var item_paste = {
                    title: jSuites.translate("Paste"),
                    icon: "content_paste",
                    shortcut: 'Ctrl + V',
                    onclick: function() {
                        if (obj.selectedCell) {
                            if(plugin.options.allow_pastestyle) {
                                plugin.paste();
                            } else {
                                plugin.pasteOnlyValue();
                            }
                        }
                    }
                }
                items.splice(position_copy+1, 0, item_paste);
            }

            if(plugin.options.allow_pastestyle && position_copy!=-1 && (jspreadsheet.styleCopied || (navigator && navigator.clipboard))) {
                var item_paste_special = {
                    title: plugin.options.text_paste_special,
                    submenu: [
                        {
                            title: plugin.options.text_paste_only_value,
                            onclick: function() {
                                if(obj.selectedCell) {
                                    plugin.pasteOnlyValue();
                                }
                            }
                        },
                        {
                            title: plugin.options.text_paste_only_formula,
                            onclick: function() {
                                if(obj.selectedCell) {
                                    plugin.pasteOnlyValueAndFormula();
                                }
                            }
                        },
                        {
                            title: plugin.options.text_paste_only_style,
                            onclick: function() {
                                if(obj.selectedCell) {
                                    plugin.pasteOnlyStyle();
                                }
                            }
                        },
                        {
                            title: plugin.options.text_transpose,
                            submenu: [
                                {
                                    title: plugin.options.text_paste_transpose,
                                    onclick: function() {
                                        if(obj.selectedCell) {
                                            plugin.pasteTranspose();
                                        }
                                    }
                                },
                                {
                                    title: plugin.options.text_paste_transpose_only_value,
                                    onclick: function() {
                                        if(obj.selectedCell) {
                                            plugin.pasteTransposeOnlyValue();
                                        }
                                    }
                                },
                                {
                                    title: plugin.options.text_paste_transpose_only_formula,
                                    onclick: function() {
                                        if(obj.selectedCell) {
                                            plugin.pasteTransposeOnlyValueAndFormula();
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                };

                items.splice(position_copy+2, 0, item_paste_special);
            }

            return items;
        }

        /**
         * Top menu
         * @param {type} name
         * @param {type} items
         * @param {type} menuButton
         * @param {type} shortcut_base
         * @returns {unresolved}
         */
        plugin.topMenu = function(name, items, menuButton, shortcut_base) {
            if(name=="Edit") {
                var flag_found_paste = false;
                var position_copy = -1;
                for(var ite_items in items) {
                    var item = items[ite_items];
                    if(item.title == jSuites.translate("Paste")) {
                        item.onclick = function() {
                            if (jspreadsheet.current.selectedCell) {
                                plugin.paste();
                            }
                        }
                        flag_found_paste = true;
                        break;
                    }

                    if(item.title == jSuites.translate("Copy")) {
                        position_copy = parseInt(ite_items);
                    }
                }

                if(!flag_found_paste && position_copy!=-1 && (jspreadsheet.dataCopied || (navigator && navigator.clipboard))) {
                    // Add paste after copy
                    var item_paste = {
                        title: jSuites.translate("Paste"),
                        icon: 'content_paste',
                        shortcut: shortcut_base+' V',
                        onclick: function() {
                            if (jspreadsheet.current.selectedCell) {
                                if(plugin.options.allow_pastestyle) {
                                    plugin.paste();
                                } else {
                                    plugin.pasteOnlyValue();
                                }
                            }
                        }
                    }
                    items.splice(position_copy+1, 0, item_paste);
                }

                if(plugin.options.allow_pastestyle && position_copy!=-1 && (jspreadsheet.styleCopied || (navigator && navigator.clipboard))) {
                    var item_paste_special = {
                        title: plugin.options.text_paste_special,
                        submenu: [
                            {
                                title: plugin.options.text_paste_only_value,
                                onclick: function() {
                                    if(jspreadsheet.current.selectedCell) {
                                        plugin.pasteOnlyValue();
                                    }
                                }
                            },
                            {
                                title: plugin.options.text_paste_only_style,
                                onclick: function() {
                                    if(jspreadsheet.current.selectedCell) {
                                        plugin.pasteOnlyStyle();
                                    }
                                }
                            }
                        ]
                    };

                    items.splice(position_copy+2, 0, item_paste_special);
                }
            }

            return items;
        }

        /**
         * Run on toolbar
         */
        plugin.toolbar = function(toolbar) {
            if(plugin.options.position_toolbar === false) {
                return toolbar;
            }
            var item_paste = {
                type: 'i',
                content: 'content_paste',
                onclick: function() {
                    if (jspreadsheet.current.selectedCell) {
                        plugin.paste();
                    }
                }
            }
            var item_cut = {
                type: 'i',
                content: 'content_cut',
                onclick: function() {
                    if (jspreadsheet.current.selectedCell) {
                        jspreadsheet.current.copy(true);
                    }
                }
            }
            var item_copy = {
                type: 'i',
                content: 'content_copy',
                onclick: function() {
                    if (jspreadsheet.current.selectedCell) {
                        jspreadsheet.current.copy();
                    }
                }
            }

            if(plugin.options.position_toolbar !== null) {
                toolbar.items.splice(parseInt(plugin.options.position_toolbar), 0, item_paste);
                toolbar.items.splice(parseInt(plugin.options.position_toolbar), 0, item_copy);
                toolbar.items.splice(parseInt(plugin.options.position_toolbar), 0, item_cut);
            } else {
                for(var ite_items in toolbar.items) {
                    var item = toolbar.items[ite_items];
                    if(item.type == "divisor") {
                        toolbar.items.splice(parseInt(ite_items)+1, 0, {type: "divisor"});
                        toolbar.items.splice(parseInt(ite_items)+1, 0, item_paste);
                        toolbar.items.splice(parseInt(ite_items)+1, 0, item_copy);
                        toolbar.items.splice(parseInt(ite_items)+1, 0, item_cut);
                        break;
                    }
                }
            }


            return toolbar;
        }

        /**
         * On event
         * @param {type} event
         * @returns {undefined}
         */
        plugin.onevent = function(event, worksheet) {
            if(event == "onselection") {
                if(!keyboard_CTRL_Pressed) {
                    //worksheet: Object, section: String, a1: Number, a2: Number
                    removeBorder(worksheet);
                }
            }
            if(event == "onblur") {
                keyboard_CTRL_Pressed = false;
                removeBorder(worksheet);
            }
            if(event=="oncopy") {
                flag_copy_run = true;
                var coords = arguments[2];
                var xStart = parseInt(coords[0]);
                var yStart = parseInt(coords[1]);
                var xEnd = parseInt(coords[2]);
                var yEnd = parseInt(coords[3]);


                if(list_borders.length > 0) {
                    var obj = arguments[1];
                    changeBorderToCopy(worksheet);
                    onclick(worksheet, xStart, yStart, xEnd, yEnd, false);
                    jspreadsheet.dataCopied = getDataToPaste(worksheet);
                    if(plugin.options.allow_pastestyle && worksheet.options.style) {
                        jspreadsheet.styleCopied = getStyleToPaste(worksheet);
                    } else {
                        jspreadsheet.styleCopied = null;
                    }
                } else {
                    jspreadsheet.dataCopied = arguments[3];

                    if(plugin.options.allow_pastestyle && worksheet.options.style) {
                        var style = [];
                        for(var y=yStart; y<=yEnd; y++) {
                            var rowStyle = [];
                            for(var x=xStart; x<=xEnd; x++) {
                                var cellName = jspreadsheet.helpers.getColumnNameFromCoords(x, y);
                                rowStyle.push(worksheet.options.style[cellName]);
                            }
                            style.push(rowStyle);
                        }
                        jspreadsheet.styleCopied = style;
                    } else {
                        jspreadsheet.styleCopied = null;
                    }
                }
            }
            if(event=="onbeforepaste") {
                if(fx_to_apply_on_before_paste != null && typeof fx_to_apply_on_before_paste == "function") {
                    const newdata = fx_to_apply_on_before_paste(arguments[2], false, arguments[4], arguments[3]);
                    if(arguments[5].length > 0) {
                        fx_to_apply_on_before_paste(arguments[5], true, arguments[4], arguments[3]);
                    }
                    fx_to_apply_on_before_paste = null;
                    return newdata;
                }
            }
            if(event=="onpaste") {
                changeBorderToCopy(worksheet);
            }
        }


        /**
         * copy function
         * @param {type} cut
         * @returns {undefined}
         */
        plugin.copy = function(cut) {
            const worksheet = getCurrentWorksheet();
            if(worksheet) {
                return worksheet.copy(cut);
            }
        }


        /**
         * paste function
         * @returns {undefined}
         */
        plugin.paste = function(onlyValue, processed = true, functionToApply) {
            if(functionToApply != null && typeof functionToApply == "function") {
                fx_to_apply_on_before_paste = functionToApply;
            }
            if(onlyValue==null) {
                onlyValue = !plugin.options.allow_pastestyle;
            }

            let hash = "";

            if(onlyValue && jspreadsheet.clipboard.hash) {
                hash = jspreadsheet.clipboard.hash;
            }
            const worksheet = getCurrentWorksheet();

            var x1 = parseInt(worksheet.selectedCell[0]);
            var y1 = parseInt(worksheet.selectedCell[1]);

            if (processed && navigator && navigator.clipboard && list_borders.length == 0) {
                navigator.clipboard.read().then(function(data) {
                    data[0].getType("text/plain").then(function(item) {
                        var res = new Response(item).text().then(function(text) {
                            if(onlyValue) {
                                var bordersCopying = worksheet.borders.copying;
                                worksheet.borders.copying = null;
                                if(hash) {
                                    jspreadsheet.clipboard.hash = 0;
                                }
                            }
                            if(text) {
                                worksheet.paste(x1, y1, text);
                            }
                            if(onlyValue) {
                                worksheet.borders.copying = bordersCopying;
                                if(hash) {
                                    jspreadsheet.clipboard.hash = hash;
                                }
                            }
                            if(text) {
                                return true;
                            }
                        });
                        return res;
                    });

                    if(!onlyValue) {
                        if(data[0].types.indexOf('text/html') !== -1) {
                            data[0].getType("text/html").then(function (item) {
                                var res = new Response(item).text().then(function (text) {
                                    pasteStyleFromClipboard(text);
                                });
                                return res;
                            });
                        }
                    }
                }).catch(function(err) {
                    if (jspreadsheet.dataCopied && onlyValue) {
                        const data = getDataToPaste(worksheet, jspreadsheet.dataCopied, processed, x1, y1);
                        if(onlyValue) {
                            var bordersCopying = worksheet.borders.copying;
                            worksheet.borders.copying = null;
                            if(hash) {
                                jspreadsheet.clipboard.hash = 0;
                            }
                        }
                        worksheet.paste(x1, y1, arrayToCSV(data));
                        if(onlyValue) {
                            worksheet.borders.copying = bordersCopying;
                            if(hash) {
                                jspreadsheet.clipboard.hash = hash;
                            }
                        }
                    }
                    if(!onlyValue && !worksheet.borders.copying && jspreadsheet.styleCopied) {
                        plugin.pasteOnlyStyle();
                    }
                });
            } else if (jspreadsheet.dataCopied) {
                const data = getDataToPaste(worksheet, jspreadsheet.dataCopied, processed, x1, y1);
                if(onlyValue) {
                    var bordersCopying = worksheet.borders.copying;
                    worksheet.borders.copying = null;
                    if(hash) {
                        jspreadsheet.clipboard.hash = 0;
                    }
                }
                worksheet.paste(x1, y1, arrayToCSV(data));
                if(onlyValue) {
                    worksheet.borders.copying = bordersCopying;
                    if(hash) {
                        jspreadsheet.clipboard.hash = hash;
                    }
                }

                if(!onlyValue && jspreadsheet.styleCopied) {
                    plugin.pasteOnlyStyle();
                }
            }
        }

        /**
         * pasteStyle
         * @returns {undefined}
         */
        plugin.pasteOnlyStyle = function() {
            var styleToCopy = null;
            const worksheet = getCurrentWorksheet();
            if(worksheet.borders.copying) {
                styleToCopy = getStyleToPaste(worksheet);
            } else if (navigator && navigator.clipboard) {
                navigator.clipboard.read().then(function(data) {
                    if(data[0].types.indexOf('text/html') !== -1) {
                        data[0].getType("text/html").then(function(item) {
                            var res = new Response(item).text().then(function(text) {
                                pasteStyleFromClipboard(text);
                            });
                            return res;
                        });
                    } else {
                        styleToCopy = jspreadsheet.styleCopied;
                    }
                });
            } else {
                styleToCopy = jspreadsheet.styleCopied;
            }

            if(styleToCopy) {
                var x = parseInt(worksheet.selectedCell[0]);
                var y = parseInt(worksheet.selectedCell[1]);

                var styleToApply = {};
                for(var ite_row=0; ite_row<styleToCopy.length; ite_row++) {
                    var rowStyle = styleToCopy[ite_row];
                    for(var ite_col=0; ite_col<rowStyle.length; ite_col++) {
                        var style = rowStyle[ite_col];
                        if(style == null) {
                            continue;
                        }
                        var cellName = jspreadsheet.helpers.getColumnNameFromCoords(x+ite_col, y+ite_row);
                        styleToApply[cellName] = style;
                    }
                }
                worksheet.setStyle(styleToApply,null, null, true);
            }
        }

        /**
         * pasteStyle
         * @returns {undefined}
         */
        plugin.pasteOnlyValue = function() {
            plugin.paste(true, true);
        }

        /**
         * pasteStyle
         * @returns {undefined}
         */
        plugin.pasteOnlyValueAndFormula = function() {
            plugin.paste(true, false);
        }

        /**
         * pasteTranspose
         * @returns {undefined}
         */
        plugin.pasteTranspose = function(onlyValue = false, processed = true) {
            plugin.paste(onlyValue, processed, transposeArray);
        }

        /**
         * pasteTransposeOnlyValue
         * @returns {undefined}
         */
        plugin.pasteTransposeOnlyValue = function() {
            plugin.pasteTranspose(true, true);
        }

        /**
         * pasteTransposeOnlyValueAndFormula
         * @returns {undefined}
         */
        plugin.pasteTransposeOnlyValueAndFormula = function() {
            plugin.pasteTranspose(true, false);
        }



        /**
         * paqteStyle
         * @private
         * @param {type} html
         * @returns {undefined}
         */
        const pasteStyleFromClipboard = function(html, worksheet) {
            if(worksheet == null) {
                worksheet = getCurrentWorksheet();
            }
            if(typeof html == "string") {
                var wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                html = wrapper;
            }

            var table = html.querySelector("table");
            var styleToApply = {};
            if(table) {
                var x = parseInt(worksheet.selectedCell[0]);
                var y = parseInt(worksheet.selectedCell[1]);
                var style = html.querySelector("style");
                var collectionTR = table.querySelectorAll('tbody tr');
                for(var ite_tr=0; ite_tr<collectionTR.length; ite_tr++) {
                    var tr = collectionTR[ite_tr];
                    var collectionTD = tr.querySelectorAll('td');
                    for(var ite_td=0; ite_td<collectionTD.length; ite_td++) {
                        var td = collectionTD[ite_td];
                        if(style) {
                            var styleTD = getStyleElement(td, style.innerHTML);
                        } else {
                            var styleTD  = getStyleElement(td, null);
                        }
                        var cellName = jspreadsheet.helpers.getColumnNameFromCoords(x+ite_td, y+ite_tr);
                        styleToApply[cellName] = styleTD;
                    }
                }

                worksheet.setStyle(styleToApply,null, null, true);
            }
        }

        /**
         * getStyle Element from class
         * @private
         * @param {type} DOMElement
         * @param {type} styleList
         * @returns {String}
         */
        const getStyleElement = function(DOMElement, styleList) {
            if(DOMElement.style.cssText) {
                var styleResults = DOMElement.style.cssText+";";
            } else {
                var styleResults = "";
            }

            if(styleList) {
                for(var ite_class=0; ite_class<DOMElement.classList.length; ite_class++) {
                    var className = DOMElement.classList[ite_class];
                    var regExpStyle = new RegExp("\\."+className+"\\s*{([^}]+)}", "gm");
                    var styleComponent = regExpStyle.exec(styleList);
                    if(styleComponent) {
                        styleComponent = styleComponent[1];
                        styleComponent = styleComponent.replace(/\s+/gm, " ");
                        styleResults += styleComponent;
                    }
                }
            }

            return styleResults;
        }

        /**
         * on click
         */
        const onclick = function(worksheet, x1, y1, x2, y2, withBorder = true) {
            if(x1 === x2 && y1 === y2) {
                var x = x1;
                var y = y1;
                // Cell
                if(!list_cellsSelected[x+","+y]) {
                    if(withBorder) {
                        list_cellsSelected[x+","+y] = createBorder(worksheet, x, y, x, y);
                    } else {
                        list_cellsSelected[x+","+y] = null;
                    }
                } else {
                    removeBorder(worksheet, list_cellsSelected[x+","+y]);
                    delete list_cellsSelected[x+","+y];
                }
            } else {
                var xmin = Math.min(x1, x2);
                var xmax = Math.max(x1, x2);
                var ymin = Math.min(y1, y2);
                var ymax = Math.max(y1, y2);

                for(let x = xmin; x <= xmax; x++) {
                    for(let y = ymin; y <= ymax; y++) {
                        if(!list_cellsSelected[x+","+y]) {
                            if(withBorder) {
                                list_cellsSelected[x+","+y] = createBorder(worksheet, x, y, x, y);
                            } else {
                                list_cellsSelected[x+","+y] = null;
                            }
                        }
                    }
                }
            }
        }

        /**
         * create border
         * @param {object} worksheet
         * @param {int} x1
         * @param {int} y1
         * @param {int} x2
         * @param {int} y2
         * @returns {int} index of border
         */
        const createBorder = function(worksheet, x1, y1, x2, y2) {
            if(flag_copy_run) {
                return;
            }
            if(worksheet == undefined) {
                worksheet = getCurrentWorksheet();
            }

            var range = jspreadsheet.helpers.getColumnNameFromCoords(x1, y1);
            if(x1 != x2 || y1 != y2) {
                range += ":" + jspreadsheet.helpers.getColumnNameFromCoords(x2, y2);
            }

            list_borders.push("plugin.copypasteadv_"+range);
            worksheet.setBorder(x1,y1,x2,y2,"plugin.copypasteadv_"+range);
            worksheet.borders["plugin.copypasteadv_"+range].element.classList.add("jss_border_main");
            worksheet.borders["plugin.copypasteadv_"+range].color="";
            worksheet.borders["plugin.copypasteadv_"+range].element.style.borderColor = "";
            worksheet.borders["plugin.copypasteadv_"+range].element.style.backgroundColor = "";
            return list_borders.length-1;
        }

        /**
         * change border to copy
         * @param {object} worksheet
         * @returns {void}
         */
        const changeBorderToCopy = function(worksheet) {
            for(let ite_border=0; ite_border<list_borders.length; ite_border++) {
                const borderName = list_borders[ite_border];

                if(borderName!="" && worksheet.borders[borderName]) {
                    worksheet.borders[borderName].element.classList.remove("jss_border_main");
                    worksheet.borders[borderName].element.classList.add("jss_border_copying");
                }
            }
        }

        /**
         * Remove borders
         * @param {object} worksheet
         * @param {boolean} force
         * @returns {undefined}
         */
        const removeBorder = function(worksheet, index, force) {
            if(flag_copy_run) {
                return;
            }
            if(worksheet == undefined) {
                worksheet = getCurrentWorksheet();
                if(force == undefined) {
                    force = true;
                }
            }
            if(force == undefined) {
                force = false;
            }
            if(force) {
                for(let b in worksheet.borders) {
                    if(b.indexOf("plugin.copypasteadv_")!=-1) {
                        worksheet.resetBorders(b, true);
                    }
                }
                worksheet.resetBorders("copying", true);
            } else {
                if(list_borders.length==0) {
                    return ;
                }
                if(index != undefined) {
                    if(list_borders[index] != "") {
                        worksheet.resetBorders(list_borders[index], true);
                        list_borders[index] = "";
                    }
                } else {
                    for(let ite_borders in list_borders) {
                        worksheet.resetBorders(list_borders[ite_borders], true);
                    }
                    worksheet.resetBorders("copying", true);
                }
            }

            if(index == undefined) {
                list_borders = [];
                list_cellsSelected = {};
            }
        }

        /**
         * get current worksheet
         * @returns {object}
         */
        const getCurrentWorksheet = function () {
            if(jspreadsheet.current) {
                return jspreadsheet.current;
            }
            if(spreadsheet.getWorksheetActive() != null) {
                return spreadsheet.worksheets[spreadsheet.getWorksheetActive()];
            }
            return spreadsheet.worksheets[0];
        }


        const getDataToPaste = function(worksheet, data, processed, toX, toY) {
            if(typeof data == "string") {
                data = jspreadsheet.helpers.parseCSV(data, "\t");
            }
            if(flag_copy_run && list_borders.length > 0) {
                let minX = -1, minY = -1, maxX = -1, maxY = -1;
                for(let coord in list_cellsSelected) {
                    const coords = coord.split(",");
                    minX = (minX == -1) ? parseInt(coords[0]) : Math.min(minX, parseInt(coords[0]));
                    maxX = (maxX == -1) ? parseInt(coords[0]) : Math.max(maxX, parseInt(coords[0]));
                    minY = (minY == -1) ? parseInt(coords[1]) : Math.min(minY, parseInt(coords[1]));
                    maxY = (maxY == -1) ? parseInt(coords[1]) : Math.max(maxY, parseInt(coords[1]));
                }

                // Build data
                const newdata = [];
                for(let y = minY; y <= maxY; y++) {
                    const row = [];
                    for(let x = minX; x <= maxX; x++) {
                        if(data && toX!=undefined && toY!=undefined) {
                            if(processed && list_cellsSelected[x+","+y] !== undefined) {
                                row.push(data[y-minY][x-minX]);
                            } else {
                                row.push(worksheet.getValueFromCoords(x-minX+toX, y-minY+toY, processed));
                            }
                        } else {
                            if(list_cellsSelected[x+","+y] !== undefined) {
                                row.push(worksheet.getValueFromCoords(x, y, processed));
                            } else {
                                row.push(null);
                            }
                        }

                    }
                    newdata.push(row);
                }

                return newdata;
            } else if(flag_copy_run && jspreadsheet.clipboard) {
                if(processed) {
                    return jspreadsheet.clipboard.value;
                } else {
                    let minX = jspreadsheet.clipboard.selection[0], minY = jspreadsheet.clipboard.selection[1], maxX = jspreadsheet.clipboard.selection[2], maxY = jspreadsheet.clipboard.selection[3];
                    const newdata = [];
                    for(let y = minY; y <= maxY; y++) {
                        const row = [];
                        for(let x = minX; x <= maxX; x++) {
                            row.push(worksheet.getValueFromCoords(x,y, processed));
                        }
                        newdata.push(row);
                    }

                    return newdata;
                }

            } else {
                return data;
            }
        }

        const getStyleToPaste = function(worksheet) {
            if(!worksheet.options.style) {
                return null;
            }
            if(flag_copy_run && list_borders.length > 0) {
                let minX = 0, minY = 0, maxX = 0; maxY = 0;
                for(let coord in list_cellsSelected) {
                    const coords = coord.split(",");
                    minX = Math.min(minX, coords[0]);
                    maxX = Math.max(maxX, coords[0]);
                    minY = Math.min(minX, coords[1]);
                    maxX = Math.max(maxX, coords[1]);
                }

                // Build data
                const style = [];
                for(let y = minY; y <=maxY; y++) {
                    const rowStyle = [];
                    for(let x = minX; x <= maxX; x++) {
                        if(list_cellsSelected[x+","+y] !== undefined) {
                            const cellName = jspreadsheet.helpers.getColumnNameFromCoords(x, y);
                            rowStyle.push(worksheet.options.style[cellName]);
                        } else {
                            rowStyle.push(null);
                        }
                    }
                    style.push(rowStyle);
                }

                return style;
            } else {
                const selectedCell = [worksheet.borders.copying.x1, worksheet.borders.copying.y1, worksheet.borders.copying.x2, worksheet.borders.copying.y2];
                const xStart = parseInt(selectedCell[0]);
                const yStart = parseInt(selectedCell[1]);
                const xEnd = parseInt(selectedCell[2]);
                const yEnd = parseInt(selectedCell[3]);
                const style = [];
                for(let y=yStart; y<=yEnd; y++) {
                    const rowStyle = [];
                    for(let x=xStart; x<=xEnd; x++) {
                        const cellName = jspreadsheet.helpers.getColumnNameFromCoords(x, y);
                        rowStyle.push(worksheet.options.style[cellName]);
                    }
                    style.push(rowStyle);
                }
                return style;
            }
        }

        const arrayToCSV = function(data) {
            let text = "";
            if(typeof data == "object" && Array.isArray(data)) {
                for(var i = 0; i < data.length; i++) {
                    if(typeof data[i] == "object" && Array.isArray(data[i])) {
                        text += data[i].join("\t") + "\r\n";
                    } else {
                        text += data[i] + "\r\n";
                    }
                }
            }
            text = text.replace(new RegExp('"', 'g'), '""');
            return text;
        }

        const transposeArray = function(data, isStyle = true, x, y) {
            const numRows = data.length;
            const numCols = data[0].length;

            const maxDimension = Math.max(numCols, numRows);

            for (let i = 0; i < maxDimension; i++) {
                for (let j = i + 1; j < maxDimension; j++) {
                    const temp = data[i][j];
                    if(data[j] == null) {
                        data[j] = [];
                    }

                    if(isStyle) {
                        data[i][j] = data[j][i];
                        data[j][i] = temp;
                    } else {
                        data[i][j] = transposteReferenceInFormula(data[j][i], y+j, x+i);
                        data[j][i] = transposteReferenceInFormula(temp, y+i, x+j);
                    }
                }
            }

            data.splice(numCols);
            for (let i = 0; i < numCols; i++) {
                data[i].splice(numRows);
            }
            return data;
        }

        const transposteReferenceInFormula = function(formula,x, y) {
            if(formula && formula.toString().substring(0, 1) == "=") {
                const cellReferenceRegex = /([A-Z0-9]+[\!\.])?([A-Z]+[0-9]+(?:\:[A-Z]*[0-9]*)?)/gm;
                return formula.replace(cellReferenceRegex, "#REF!");
            } else {
                return formula;
            }
        }

        /**
         * override events paste for add pasteStyleFromClipboard
         * @type jspreadsheet.pasteControls
         */
        if(plugin.options.allow_pastestyle) {
            var BasedPasteControls = jspreadsheet.events.paste;
            jspreadsheet.events.paste = function(e) {
                BasedPasteControls(e);
                if (jspreadsheet.current && jspreadsheet.current.selectedCell) {
                    if (!jspreadsheet.current.edition) {
                        if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {
                            if (((e.clipboardData.types instanceof DOMStringList) && e.clipboardData.types.contains("text/html")) || (e.clipboardData.types.indexOf && e.clipboardData.types.indexOf('text/html') !== -1)) {
                                var pasteData = e.clipboardData.getData('text/html');
                                pasteStyleFromClipboard(pasteData);
                            }
                        } else if (window.clipboardData && window.clipboardData.types && window.clipboardData.getData) {
                            if (((window.clipboardData.types instanceof DOMStringList) && window.clipboardData.types.contains("text/html")) || (window.clipboardData.types.indexOf && window.clipboardData.types.indexOf('text/html') !== -1)) {
                                var pasteData = window.clipboardData.getData('text/html');
                                pasteStyleFromClipboard(pasteData);
                            }

                        } else if (navigator && navigator.clipboard && navigator.clipboard.read) {
                            navigator.clipboard.read().then(function(data) {
                                if(data[0].types.indexOf('text/html') !== -1) {
                                    data[0].getType("text/html").then(function (item) {
                                        var res = new Response(item).text().then(function (text) {
                                            pasteStyleFromClipboard(text);
                                        });
                                        return res;
                                    });
                                }
                            });
                        }
                    }
                }
            }
        }

        // Manage CTRL click or CMD click
        document.addEventListener("keydown", function(e) {
            keyboard_CTRL_Pressed = (e.ctrlKey || e.metaKey) && ! e.shiftKey;
            if(e.key == "Escape" && flag_copy_run == true) {
                flag_copy_run = false;
                removeBorder();
            }
        });
        document.addEventListener("keyup", function(e) {
            keyboard_CTRL_Pressed = (e.ctrlKey || e.metaKey) && ! e.shiftKey;
        });
        return plugin;
    });

})));