/**
 * Plugin copy paste of jExcel Pro & CE
 * 
 * @version 1.0.1
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
        var x = instance.selectedCell[0];
        var y = instance.selectedCell[1];
        if (navigator && navigator.clipboard) {
            navigator.clipboard.readText().then(function(text) {
                if (text) {
                    instance.paste(x, y, text);
                }
            }).catch(function(err) {
                if (jexcel.dataCopied) {
                    instance.paste(x, y, jexcel.dataCopied);
                }
            });
        } else if (jexcel.dataCopied) {
            instance.paste(x, y, jexcel.dataCopied);
        }
    }


    return plugin;
});
