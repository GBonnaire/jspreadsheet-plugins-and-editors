/**
 * Plugin shortcut context menu for jExcel Pro / jSpreadSheet
 * 
 * @version 1.3.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description Replace shortcut with type of navigator and add icon
 * 
 * @license This plugin is distribute under MIT License
 * 
 * Release Note :
 * 1.3.0 : add compatibility NPM
 * 1.2.0 : Use icon property of contextmenu by default, add isIconHTML property for use icon HTML with an other library
 */

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_contextmenu_shortcut = factory();
}(this, (function () {
    return (function(instance, options) {
    
        var shortcut_init = "Ctrl +";
        var shortcut_base = "Ctrl +";
        if (/(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/.test(window.navigator.userAgent)) {
            shortcut_base = "⌘ +";
        }

        // Plugin object
        var plugin = {};

        // Set options
        plugin.options = Object.assign({},options);

        // Options
        var defaultOptions = {
              icon_changeColumnType:'ballot',
              icon_insertANewColumnBefore:'add',
              icon_insertANewColumnAfter:'add',
              icon_deleteSelectedColumns:'delete',
              icon_renameThisColumn:'create',
              icon_orderAscending:'sort',
              icon_orderDescending:'sort',
              icon_insertANewRowBefore:'add',
              icon_insertANewRowAfter:'add',
              icon_deleteSelectedRows:'delete',
              icon_addComments:'insert_comment',
              icon_clearComments:'clear',
              icon_cut:'content_cut',
              icon_copy:'content_copy',
              icon_paste:'content_paste',
              icon_edit:'edit',
              icon_saveAs:'save',
              icon_about:'info',
              isIconHTML: false,     
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
            for(var ite_items in items) {
                var item = items[ite_items];
                if(item.shortcut && shortcut_init!=shortcut_base) {
                   item.shortcut = item.shortcut.replace(shortcut_init, shortcut_base);
                }
                if(plugin.options.isIconHTML) {
                   switch(item.title) {
                        case instance.options.text.changeColumnType:
                            item.title = plugin.options.icon_changeColumnType + item.title;
                            break;
                        case instance.options.text.insertANewColumnBefore:
                            item.title = plugin.options.icon_insertANewColumnBefore + item.title;
                            break;
                        case instance.options.text.insertANewColumnAfter:
                            item.title = plugin.options.icon_insertANewColumnAfter + item.title;
                            break;
                        case instance.options.text.deleteSelectedColumns:
                            item.title = plugin.options.icon_deleteSelectedColumns + item.title;
                            break;
                        case instance.options.text.renameThisColumn:
                            item.title = plugin.options.icon_renameThisColumn + item.title;
                            break;
                        case instance.options.text.orderAscending:
                            item.title = plugin.options.icon_orderAscending + item.title;
                            break;
                        case instance.options.text.orderDescending:
                            item.title = plugin.options.icon_orderDescending + item.title;
                            break;
                        case instance.options.text.insertANewRowBefore:
                            item.title = plugin.options.icon_insertANewRowBefore + item.title;
                            break;
                        case instance.options.text.insertANewRowAfter:
                            item.title = plugin.options.icon_insertANewRowAfter + item.title;
                            break;
                        case instance.options.text.deleteSelectedRows:
                            item.title = plugin.options.icon_deleteSelectedRows + item.title;
                            break;
                        case instance.options.text.addComments:
                        case instance.options.text.editComments:
                        case instance.options.text.comments:
                            item.title = plugin.options.icon_addComments + item.title;
                            break;
                        case instance.options.text.clearComments:
                            item.title = plugin.options.icon_clearComments + item.title;
                            break;
                        case instance.options.text.copy:
                            item.title = plugin.options.icon_copy + item.title;
                            break;
                        case instance.options.text.cut:
                            item.title = plugin.options.icon_cut + item.title;
                            break;
                        case instance.options.text.paste:
                            item.title = plugin.options.icon_paste + item.title;
                            break;
                        case instance.options.text.saveAs:
                            item.title = plugin.options.icon_saveAs + item.title;
                            break;
                        case instance.options.text.about:
                            item.title = plugin.options.icon_about + item.title;
                            break;
                    } 
                } else {
                    switch(item.title) {
                        case instance.options.text.changeColumnType:
                            item.icon = plugin.options.icon_changeColumnType;
                            break;
                        case instance.options.text.insertANewColumnBefore:
                            item.icon = plugin.options.icon_insertANewColumnBefore;
                            break;
                        case instance.options.text.insertANewColumnAfter:
                            item.icon = plugin.options.icon_insertANewColumnAfter;
                            break;
                        case instance.options.text.deleteSelectedColumns:
                            item.icon = plugin.options.icon_deleteSelectedColumns;
                            break;
                        case instance.options.text.renameThisColumn:
                            item.icon = plugin.options.icon_renameThisColumn;
                            break;
                        case instance.options.text.orderAscending:
                            item.icon = plugin.options.icon_orderAscending;
                            break;
                        case instance.options.text.orderDescending:
                            item.icon = plugin.options.icon_orderDescending;
                            break;
                        case instance.options.text.insertANewRowBefore:
                            item.icon = plugin.options.icon_insertANewRowBefore;
                            break;
                        case instance.options.text.insertANewRowAfter:
                            item.icon = plugin.options.icon_insertANewRowAfter;
                            break;
                        case instance.options.text.deleteSelectedRows:
                            item.icon = plugin.options.icon_deleteSelectedRows;
                            break;
                        case instance.options.text.addComments:
                        case instance.options.text.editComments:
                        case instance.options.text.comments:
                            item.icon = plugin.options.icon_addComments;
                            break;
                        case instance.options.text.clearComments:
                            item.icon = plugin.options.icon_clearComments;
                            break;
                        case instance.options.text.copy:
                            item.icon = plugin.options.icon_copy;
                            break;
                        case instance.options.text.cut:
                            item.icon = plugin.options.icon_cut;
                            break;
                        case instance.options.text.paste:
                            item.icon = plugin.options.icon_paste;
                            break;
                        case instance.options.text.mobile_edit:
                            item.icon = plugin.options.icon_edit;
                            break;
                        case instance.options.text.saveAs:
                            item.icon = plugin.options.icon_saveAs;
                            break;
                        case instance.options.text.about:
                            item.icon = plugin.options.icon_about;
                            break;
                    }
                }
            }
            return items;
        }

        return plugin;
    });
    
})));   

// Compatibility Old version
window.jexcel_contextmenu_shortcut = jss_contextmenu_shortcut;