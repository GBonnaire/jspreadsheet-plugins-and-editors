/**
 * Plugin copy paste advance for jExcel Pro / jSpreadsheet
 * 
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description upgrade copy paste function for work with clipboard permission denied or error
 * and add button on toolbar copy/cut/paste
 * 
 * Version 2.0.0 special paste (paste only value, paste only style, paste style from clipboard)
 * 
 * @license This plugin is distribute under MIT License
 */

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jexcel_copypaste_advanced = factory();
}(this, (function () {
    return (function(instance, options) {
        // Plugin object
        var plugin = {};

        // Options
        var defaultOptions = {
            allow_pastestyle: true,
            text_paste_special: "Paste special",
            text_paste_only_style: "Paste only format",
            text_paste_only_value: "Paste only value"
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
                var propertyText = "copypasteadv_" + property.substring(5,property.length);
                if(instance.options.text[propertyText]) {
                    plugin.options[property] = instance.options.text[propertyText];
                }
            }
        }

        /**
         * Run on the context menu
         */
        plugin.contextMenu = function(obj, x, y, e, items) {
            var flag_found_paste = false;
            var position_copy = -1;
            for(var ite_items in items) {
                var item = items[ite_items];
                if(item.title == instance.options.text.paste) {
                    item.onclick = function() {
                        if (instance.selectedCell) {
                            plugin.paste();
                        }
                    }
                    flag_found_paste = true;
                    break;
                }

                if(item.title == instance.options.text.copy) {
                    position_copy = parseInt(ite_items);
                }
            }

            if(!flag_found_paste && position_copy!=-1 && (jexcel.dataCopied || (navigator && navigator.clipboard))) {
                // Add paste after copy
                var item_paste = {
                            title: obj['options']['text']['paste'],
                            shortcut: 'Ctrl + V',
                            onclick: function() {
                                if (instance.selectedCell) {
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

            if(plugin.options.allow_pastestyle && position_copy!=-1 && (jexcel.styleCopied || (navigator && navigator.clipboard))) {
                var item_paste_special = {
                    title: plugin.options.text_paste_special,
                    submenu: [
                        {
                            title: plugin.options.text_paste_only_value,
                            onclick: function() {
                                if(instance.selectedCell) {
                                    plugin.pasteOnlyValue();
                                }
                            }
                        },
                        {
                            title: plugin.options.text_paste_only_style,
                            onclick: function() {
                                if(instance.selectedCell) {
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

        /**
         * Run on toolbar
         */
        plugin.toolbar = function(obj, items) {
            var item_paste = {
                type: 'i',
                content: 'content_paste',
                onclick: function() {
                    if (instance.selectedCell) {
                        plugin.paste();
                    }
                }
            }
            var item_cut = {
                type: 'i',
                content: 'content_cut',
                onclick: function() {
                    if (instance.selectedCell) {
                        instance.copy(true);
                    }
                }
            }
            var item_copy = {
                type: 'i',
                content: 'content_copy',
                onclick: function() {
                    if (instance.selectedCell) {
                        instance.copy();
                    }
                }
            }
            for(var ite_items in items) {
                var item = items[ite_items];
                if(item.content == "redo") {
                    items.splice(parseInt(ite_items)+1, 0, item_paste);
                    items.splice(parseInt(ite_items)+1, 0, item_copy);
                    items.splice(parseInt(ite_items)+1, 0, item_cut);
                    break;
                }
            }

            return items;
        }

        plugin.onevent = function(event) {
            if(event=="onbeforepaste") {
                var el = arguments[1];

            }
        }

        var BasedOnBeforePaste = instance.options.onbeforepaste;

        instance.options.onbeforepaste = function(el, data, x1, y1) {
            if(BasedOnBeforePaste!=null) {
                var ret = BasedOnBeforePaste(...arguments);
                if(ret===false) {
                    return false;
                } else if(ret) {
                    var data = ret;
                }
            }

            var dataArray = instance.parseCSV(data, "\t");

            var x2 = parseInt(instance.selectedCell[2]);
            var y2 = parseInt(instance.selectedCell[3]);

            var x_length = (x2 - x1) + 1;
            var y_length = (y2 - y1) + 1;

            var data_y_length = dataArray.length;
            var data_x_length = dataArray[0].length;

            var scale_x = Math.trunc(x_length/data_x_length);
            var scale_y = Math.trunc(y_length/data_y_length);

            // If not scale to do
            if(scale_x==0 || scale_y == 0) {
                return data;
            }

            // Scale data to range selected
            var newData = [];
            for(var ite_y = 0; ite_y<(data_y_length*scale_y); ite_y++) {
                newData[ite_y] = [];
                for(var ite_x = 0; ite_x<(data_x_length*scale_x); ite_x++) {
                     newData[ite_y][ite_x] = dataArray[ite_y%data_y_length][ite_x%data_x_length];
                }
                newData[ite_y] = newData[ite_y].join("\t");
            }

            newData = newData.join("\r\n");

            return newData;
        }

        // Init overwrite function for keep old function
        var BasedCopy = instance.copy;

        /**
         * Overwrite copy
         * @param {type} highlighted
         * @param {type} delimiter
         * @param {type} returnData
         * @returns {undefined}
         */
        instance.copy = function(cut) {
            var data = BasedCopy(cut);
            jexcel.dataCopied = data;
            if(plugin.options.allow_pastestyle && instance.options.style) {
                var xStart = parseInt(instance.selectedCell[0]);
                var yStart = parseInt(instance.selectedCell[1]);
                var xEnd = parseInt(instance.selectedCell[2]);
                var yEnd = parseInt(instance.selectedCell[3]);
                var style = [];
                for(var y=yStart; y<=yEnd; y++) {
                    var rowStyle = [];
                    for(var x=xStart; x<=xEnd; x++) {
                        var cellName = jexcel.getColumnNameFromId([x, y]);
                        rowStyle.push(instance.options.style[cellName]);
                    }
                    style.push(rowStyle);
                }
                jexcel.styleCopied = style;
            } else {
                jexcel.styleCopied = null;
            }
            return data;
        }

        /**
         * copy function
         * @param {type} cut
         * @returns {undefined}
         */
        plugin.copy = function(cut) {        
            return instance.copy(cut);
        }

        /**
         * paste function
         * @returns {undefined}
         */
        plugin.paste = function(onlyValue) {
            if(onlyValue==null) {
                onlyValue = false;
            }
            var x1 = parseInt(instance.selectedCell[0]);
            var y1 = parseInt(instance.selectedCell[1]);

            if (navigator && navigator.clipboard) {
                navigator.clipboard.read().then(function(data) {
                    data[0].getType("text/plain").then(function(item) {
                        var res = new Response(item).text().then(function(text) {
                            if(text) {
                                instance.paste(x1, y1, text);
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
                    if (jexcel.dataCopied) {
                        instance.paste(x1, y1, jexcel.dataCopied);
                    }
                    if(plugin.options.allow_pastestyle && !onlyValue && !instance.borders.copying && jexcel.styleCopied) {
                        plugin.pasteOnlyStyle();
                    }
                });
            } else if (jexcel.dataCopied) {
                instance.paste(x1, y1, jexcel.dataCopied);
                if(plugin.options.allow_pastestyle && !onlyValue && !instance.borders.copying && jexcel.styleCopied) {
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
            if(instance.borders.copying) {
                var selectedCell = [instance.borders.copying.x1, instance.borders.copying.y1, instance.borders.copying.x2, instance.borders.copying.y2];
                if(instance.options.style) {
                    var xStart = parseInt(selectedCell[0]);
                    var yStart = parseInt(selectedCell[1]);
                    var xEnd = parseInt(selectedCell[2]);
                    var yEnd = parseInt(selectedCell[3]);
                    var style = [];
                    for(var y=yStart; y<=yEnd; y++) {
                        var rowStyle = [];
                        for(var x=xStart; x<=xEnd; x++) {
                            var cellName = jexcel.getColumnNameFromId([x, y]);
                            rowStyle.push(instance.options.style[cellName]);
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
                styleToCopy = jexcel.styleCopied;
            }

            if(styleToCopy) {
                var x = parseInt(instance.selectedCell[0]);
                var y = parseInt(instance.selectedCell[1]);

                var styleToApply = {};
                for(var ite_row=0; ite_row<styleToCopy.length; ite_row++) {
                    var rowStyle = styleToCopy[ite_row];
                    for(var ite_col=0; ite_col<rowStyle.length; ite_col++) {
                        var style = rowStyle[ite_col];
                        var cellName = jexcel.getColumnNameFromId([x+ite_col, y+ite_row]);
                        styleToApply[cellName] = style;
                    }
                }
                instance.setStyle(styleToApply,null, null, true);
            }
        }

        /**
         * pasteStyle
         * @returns {undefined}
         */
        plugin.pasteOnlyValue = function() {
            var bordersCopying = instance.borders.copying;
            instance.borders.copying = null;
            plugin.paste(true);
            instance.borders.copying = bordersCopying;
        }

        /**
         * paqteStyle
         * @param {type} html
         * @returns {undefined}
         */
        function pasteStyleFromClipboard(html) {
            if(typeof html == "string") {
                var wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                html = wrapper;
            }

            var table = html.querySelector("table");
            var styleToApply = {};
            if(table) {
                var x = parseInt(instance.selectedCell[0]);
                var y = parseInt(instance.selectedCell[1]);
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
                        var cellName = jexcel.getColumnNameFromId([x+ite_td, y+ite_tr]);
                        styleToApply[cellName] = styleTD;
                    }
                }

                instance.setStyle(styleToApply,null, null, true);
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
         * overWrite pasteControl for add pasteStyleFromClipboard
         * @type jexcel.pasteControls
         */
        if(plugin.options.allow_pastestyle) {
            var BasedPasteControls = jexcel.pasteControls;
            jexcel.pasteControls = function(e) {
                BasedPasteControls(e);
                if (jexcel.current && jexcel.current.selectedCell) {
                    if (!jexcel.current.edition) {
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