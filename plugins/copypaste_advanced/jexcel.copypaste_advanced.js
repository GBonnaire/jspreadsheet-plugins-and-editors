/**
 * Plugin copy paste of jExcel Pro & CE
 * 
 * @version 1.1.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * @description upgrade copy paste function for work with clipboard permission denied or error
 * and add button on toolbar copy/cut/paste
 * 
 * @license This plugin is distribute under MIT License
 */
var jexcel_copypaste_advanced = (function(instance, options) {
    // Plugin object
    var plugin = {};

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
        
        if(!flag_found_paste && position_copy!=-1) {
            // Add paste after copy
            var item_paste = {
                        title: obj['options']['text']['paste'],
                        shortcut: 'Ctrl + V',
                        onclick: function() {
                            if (instance.selectedCell) {
                                plugin.paste();
                            }
                        }
                    }
            items.splice(position_copy+1, 0, item_paste);
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
     * @param {type} x
     * @param {type} y
     * @param {type} text
     * @returns {undefined}
     */
    plugin.paste = function() {
        var x1 = parseInt(instance.selectedCell[0]);
        var y1 = parseInt(instance.selectedCell[1]);
        
        if (navigator && navigator.clipboard) {
            navigator.clipboard.readText().then(function(text) {
                if (text) {
                    instance.paste(x1, y1, text);
                }
            }).catch(function(err) {
                if (jexcel.dataCopied) {
                    instance.paste(x1, y1, jexcel.dataCopied);
                }
            });
        } else if (jexcel.dataCopied) {
            instance.paste(x1, y1, jexcel.dataCopied);
        }
    }


    return plugin;
});
