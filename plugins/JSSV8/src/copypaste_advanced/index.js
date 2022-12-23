/**
 * Plugin copy paste advance for jSpreadsheet
 * 
 * @version 3.0.3
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description upgrade copy paste function for work with clipboard permission denied or error
 * and add button on toolbar copy/cut/paste
 * 
 * @license This plugin is distribute under MIT License
 * 
 * ReleaseNote
 * 3.0.0 : version for v8
 * 2.1.0 : add topmenu compatibility
 * 2.0.1 : transform jexcel to jspreadsheet
 * 2.0.0 : compatibility NPM + add special paste (paste only value, paste only style, paste style from clipboard)
 */

if(! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_copypaste_advanced = factory();
}(this, (function () {
    return (function(instance, options) {
        const jspreadsheet = this;
        if(!jspreadsheet) {
            throw new Error("JSpreadsheet must loaded before");
        }
        // check Version of JSS
        if(parseInt(jspreadsheet.version().version.split(".")[0]) < 8) {
            console.error("Plugin \"Copy paste advanced\" not compatible with jspreadsheet " + jspreadsheet.version().version + ", Please use an older version of this plugin compatible. Go to https://github.com/GBonnaire/jspreadsheet-plugins-and-editors/");
            return {};
        }
        
        // Plugin object
        var plugin = {};
        
         // Set options
        plugin.options = Object.assign({},options);

        // Options
        var defaultOptions = {
            allow_pastestyle: true,
            text_paste_special: jSuites.translate("Paste special"),
            text_paste_only_style: jSuites.translate("Paste only format"),
            text_paste_only_value: jSuites.translate("Paste only value")
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
                            title: plugin.options.text_paste_only_style,
                            onclick: function() {
                                if(obj.selectedCell) {
                                    plugin.pasteOnlyStyle();
                                }
                            }
                        }
                    ]
                };

                items.splice(position_copy+2, 0, item_paste_special);
            }

            return items;
        }
        
        
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
            for(var ite_items in toolbar.items) {
                var item = toolbar.items[ite_items];
                if(item.content == "redo") {
                    toolbar.items.splice(parseInt(ite_items)+1, 0, item_paste);
                    toolbar.items.splice(parseInt(ite_items)+1, 0, item_copy);
                    toolbar.items.splice(parseInt(ite_items)+1, 0, item_cut);
                    break;
                }
            }

            return toolbar;
        }

        plugin.onevent = function(event) {
            if(event=="oncopy") {
                jspreadsheet.dataCopied = arguments[3];
                var obj = arguments[1];
                var coords = arguments[2];
                if(plugin.options.allow_pastestyle && obj.options.style) {
                    var xStart = parseInt(coords[0]);
                    var yStart = parseInt(coords[1]);
                    var xEnd = parseInt(coords[2]);
                    var yEnd = parseInt(coords[3]);
                    var style = [];
                    for(var y=yStart; y<=yEnd; y++) {
                        var rowStyle = [];
                        for(var x=xStart; x<=xEnd; x++) {
                            var cellName = jspreadsheet.helpers.getColumnNameFromCoords(x, y);
                            rowStyle.push(obj.options.style[cellName]);
                        }
                        style.push(rowStyle);
                    }
                    jspreadsheet.styleCopied = style;
                } else {
                    jspreadsheet.styleCopied = null;
                }
            }
        }
        
        
        /**
         * copy function
         * @param {type} cut
         * @returns {undefined}
         */
        plugin.copy = function(cut) {   
            if(jspreadsheet.current) {
                return jspreadsheet.current.copy(cut);
            }
        }


        /**
         * paste function
         * @returns {undefined}
         */
        plugin.paste = function(onlyValue) {
            if(onlyValue==null) {
                onlyValue = false;
            }
            
            var x1 = parseInt(jspreadsheet.current.selectedCell[0]);
            var y1 = parseInt(jspreadsheet.current.selectedCell[1]);

            if (navigator && navigator.clipboard) {
                navigator.clipboard.read().then(function(data) {
                    data[0].getType("text/plain").then(function(item) {
                        var res = new Response(item).text().then(function(text) {
                            if(onlyValue || !plugin.options.allow_pastestyle) {
                                var bordersCopying = jspreadsheet.current.borders.copying;
                                jspreadsheet.current.borders.copying = null;
                            }
                            if(text) {
                                jspreadsheet.current.paste(x1, y1, text);
                            }
                            if(onlyValue || !plugin.options.allow_pastestyle) {
                                jspreadsheet.current.borders.copying = bordersCopying;
                            }
                        });
                        return res;
                    });

                    if(plugin.options.allow_pastestyle && !onlyValue) {
                        data[0].getType("text/html").then(function(item) {
                            var res = new Response(item).text().then(function(text) {
                                pasteStyleFromClipboard(text);
                            });
                            return res;
                        });
                    }
                }).catch(function(err) {
                    if (jspreadsheet.dataCopied) {
                        if(onlyValue || !plugin.options.allow_pastestyle) {
                            var bordersCopying = jspreadsheet.current.borders.copying;
                            jspreadsheet.current.borders.copying = null;
                        }
                        jspreadsheet.current.paste(x1, y1, jspreadsheet.dataCopied);
                        if(onlyValue || !plugin.options.allow_pastestyle) {
                            jspreadsheet.current.borders.copying = bordersCopying;
                        }
                    }
                    if(plugin.options.allow_pastestyle && !onlyValue && !jspreadsheet.current.borders.copying && jspreadsheet.styleCopied) {
                        plugin.pasteOnlyStyle();
                    }
                });
            } else if (jspreadsheet.dataCopied) {
                if(onlyValue || !plugin.options.allow_pastestyle) {
                    var bordersCopying = jspreadsheet.current.borders.copying;
                    jspreadsheet.current.borders.copying = null;
                }
                jspreadsheet.current.paste(x1, y1, jspreadsheet.dataCopied);
                if(onlyValue || !plugin.options.allow_pastestyle) {
                    jspreadsheet.current.borders.copying = bordersCopying;
                }
                if(plugin.options.allow_pastestyle && !onlyValue && !jspreadsheet.current.borders.copying && jspreadsheet.styleCopied) {
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
            if(jspreadsheet.current.borders.copying) {
                var selectedCell = [jspreadsheet.current.borders.copying.x1, jspreadsheet.current.borders.copying.y1, jspreadsheet.current.borders.copying.x2, jspreadsheet.current.borders.copying.y2];
                if(jspreadsheet.current.options.style) {
                    var xStart = parseInt(selectedCell[0]);
                    var yStart = parseInt(selectedCell[1]);
                    var xEnd = parseInt(selectedCell[2]);
                    var yEnd = parseInt(selectedCell[3]);
                    var style = [];
                    for(var y=yStart; y<=yEnd; y++) {
                        var rowStyle = [];
                        for(var x=xStart; x<=xEnd; x++) {
                            var cellName = jspreadsheet.helpers.getColumnNameFromCoords(x, y);
                            rowStyle.push(jspreadsheet.current.options.style[cellName]);
                        }
                        style.push(rowStyle);
                    }
                    styleToCopy = style;
                }   
            } else if (navigator && navigator.clipboard) {
                navigator.clipboard.read().then(function(data) {
                    data[0].getType("text/html").then(function(item) {
                        var res = new Response(item).text().then(function(text) {
                            pasteStyleFromClipboard(text);
                        });
                        return res;
                    });
                });
            } else {
                styleToCopy = jspreadsheet.styleCopied;
            }

            if(styleToCopy) {
                var x = parseInt(jspreadsheet.current.selectedCell[0]);
                var y = parseInt(jspreadsheet.current.selectedCell[1]);

                var styleToApply = {};
                for(var ite_row=0; ite_row<styleToCopy.length; ite_row++) {
                    var rowStyle = styleToCopy[ite_row];
                    for(var ite_col=0; ite_col<rowStyle.length; ite_col++) {
                        var style = rowStyle[ite_col];
                        var cellName = jspreadsheet.helpers.getColumnNameFromCoords(x+ite_col, y+ite_row);
                        styleToApply[cellName] = style;
                    }
                }
                jspreadsheet.current.setStyle(styleToApply,null, null, true);
            }
        }

        /**
         * pasteStyle
         * @returns {undefined}
         */
        plugin.pasteOnlyValue = function() {
            plugin.paste(true);
        }

        /**
         * paqteStyle
         * @param {type} html
         * @returns {undefined}
         */
        function pasteStyleFromClipboard(html, worksheet) {
            if(worksheet == null) {
                worksheet = jspreadsheet.current;
            }
            if(typeof html == "string") {
                var wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                html = wrapper;
            }

            var table = html.querySelector("table");
            var styleToApply = {};
            if(table) {
                var x = parseInt(jspreadsheet.current.selectedCell[0]);
                var y = parseInt(jspreadsheet.current.selectedCell[1]);
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
         * @param {type} DOMElement
         * @param {type} styleList
         * @returns {String}
         */
        function getStyleElement(DOMElement, styleList) {
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
         * override events paste for add pasteStyleFromClipboard
         * @type jspreadsheet.pasteControls
         */
        if(plugin.options.allow_pastestyle) {
            var BasedPasteControls = jspreadsheet.events.paste;
            jspreadsheet.pasteControls = function(e) {
                BasedPasteControls(e);
                if (jspreadsheet.current && jspreadsheet.current.selectedCell) {
                    if (!jspreadsheet.current.edition) {
                        if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {
                            if (((e.clipboardData.types instanceof DOMStringList) && e.clipboardData.types.contains("text/html")) || (e.clipboardData.types.indexOf && e.clipboardData.types.indexOf('text/html') !== -1)) {
                                var pasteData = e.clipboardData.getData('text/html');
                                pasteStyleFromClipboard(pasteData);
                            }
                        } else {
                            if (window.clipboardData && window.clipboardData.types && window.clipboardData.getData) {
                                if (((window.clipboardData.types instanceof DOMStringList) && window.clipboardData.types.contains("text/html")) || (window.clipboardData.types.indexOf && window.clipboardData.types.indexOf('text/html') !== -1)) {
                                    var pasteData = window.clipboardData.getData('text/html');
                                    pasteStyleFromClipboard(pasteData);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return plugin;
    });
    
})));