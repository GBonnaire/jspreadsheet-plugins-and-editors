/**
 * Plugin shortcut context menu of jExcel Pro & CE
 * 
 * @version 1.1.2
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * @description Replace shortcut with type of navigator and add icon
 * 
 * @license This plugin is distribute under MIT License
 */
var jexcel_contextmenu_shortcut = (function(instance, options) {
    
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
          icon_changeColumnType:'<i class="context_icon material-icons">ballot</i>',
          icon_insertANewColumnBefore:'<i class="context_icon material-icons">add</i>',
          icon_insertANewColumnAfter:'<i class="context_icon material-icons">add</i>',
          icon_deleteSelectedColumns:'<i class="context_icon material-icons">delete</i>',
          icon_renameThisColumn:'<i class="context_icon material-icons">create</i>',
          icon_orderAscending:'<i class="context_icon material-icons">sort</i>',
          icon_orderDescending:'<i class="context_icon material-icons">sort</i>',
          icon_insertANewRowBefore:'<i class="context_icon material-icons">add</i>',
          icon_insertANewRowAfter:'<i class="context_icon material-icons">add</i>',
          icon_deleteSelectedRows:'<i class="context_icon material-icons">delete</i>',
          icon_addComments:'<i class="context_icon material-icons">insert_comment</i>',
          icon_clearComments:'<i class="context_icon material-icons">clear</i>',
          icon_cut:'<i class="context_icon material-icons">content_cut</i>',
          icon_copy:'<i class="context_icon material-icons">content_copy</i>',
          icon_paste:'<i class="context_icon material-icons">content_paste</i>',
          icon_saveAs:'<i class="context_icon material-icons">save</i>',
          icon_about:'<i class="context_icon material-icons">info</i>',
          css:'font-size:small; vertical-align:text-top; float:left; margin-left: -20px; margin-right: 2px;line-height: 14px;',     
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
        }
        return items;
    }

    function createClass(classContent) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = classContent;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    
    createClass(".jcontextmenu .context_icon {"+plugin.options.css+"}");
    
    return plugin;
});
