/**
 * Custom editor for dropdown with icon
 * 
 * @version 1.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * 
 * @example 
 * jspreadsheet(document.getElementById('spreadsheet'), {
 *    columns: [
 *          {
 *             type:"dropdownicon",
 *             source: [
 *                  { id:'3', name:'Empty', title:'Not started', icon:'star_outline' },
 *                  { id:'4', name:'Half', icon:'star_half' },
 *                  { id:'5', name:'Full', icon:'star' },
 *             ],
 *             width: 80
 *         },
 *    ],
 * });
 * 
 * @license This plugin is distribute under MIT License
 */
jspreadsheet.editors.dropdownicon = function() {
    var methods = {};

    methods.createCell = function(cell, value, x, y, instance, options) {
        if(!options.render) {
            cell.classList.add("jexcel_dropdown");
        }
        
        var v = methods.updateCell(cell, value, x, y, instance, options);
        if(v) {
            return v;
        }
    }
    
    methods.destroyCell = function (cell) {
        cell.classList.remove('jexcel_dropdown');
    };

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if(cell) {
            if(value != undefined) {
                var items = getItems(options.source, value);
                
                if(items.length > 0) {
                    var icons = "";
                    for(var ite_item=0; ite_item<items.length; ite_item++) {
                        var item = items[ite_item];
                        if(item.icon) {
                            if(item.color) {
                                icons += "<span class='material-icons' style='width:auto;height:auto;line-height:inherit;font-size:inherit;color:"+item.color+"'>" + items[ite_item].icon + "</span>";
                            } else {
                                icons += "<span class='material-icons' style='width:auto;height:auto;line-height:inherit;font-size:inherit;'>" + items[ite_item].icon + "</span>";
                            }
                        }
                    }
                    
                    cell.innerHTML = icons;
                    
                    return value;
                } else {
                    cell.innerHTML = "";
                }
            }
            
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {
        jspreadsheet.editors.dropdown.openEditor(...arguments);   
    }

    methods.closeEditor = function(cell, save) {
        return jspreadsheet.editors.dropdown.closeEditor(...arguments);
    }
    
    
    methods.get = function(options, value, extended) {
        return jspreadsheet.editors.dropdown.get(...arguments);
    }
    
    function getItems(source, id) {
        var v = (""+id).split(";");
        var items = [];
        if(id=="") {
            return items;
        }
        for(var ite_v=0; ite_v<v.length; ite_v++) {
            var value = v[ite_v];
            for(var ite_item=0; ite_item<source.length; ite_item++) {
                var item = source[ite_item];
                if(item.id == value) {
                    items.push(item);
                    break;
                }
            }
        }
        
        return items;
    }
    
    return methods;
}();