/**
 * Custom editor for dropdown with image + name
 * 
 * @version 1.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * 
 * @example 
 * jspreadsheet(document.getElementById('spreadsheet'), {
 *    columns: [
 *          {
 *             type:"dropdownimagename",
 *             source: [
 *                  { id:'1', name:'Paul', image:'https://www.jspreadsheet.com/templates/default/img/1.jpg'},
 *                  { id:'2', name:'Ringo', image:'https://www.jspreadsheet.com/templates/default/img/2.jpg' },
 *             ],
 *             width: 80
 *         },
 *    ],
 * });
 * 
 * @license This plugin is distribute under MIT License
 */
jspreadsheet.editors.dropdownimagename = function() {
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
        cell.style.lineHeight = "";
    };

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if(cell) {
            cell.style.lineHeight = "inherit";
            if(value != undefined) {
                if(!options.style) {
                    options.style = "vertical-align:middle;width:auto;height:24px;border-radius:16px";
                }
                var items = getItems(options.source, value);
                
                if(items.length > 0) {
                    var images = "";
                    for(var ite_item=0; ite_item<items.length; ite_item++) {
                        var item = items[ite_item];
                        if(item.image) {
                            images += "<img src='"+item.image+"' style='"+options.style+"'> "+item.name;
                        }
                    }
                    
                    cell.innerHTML = images;
                    
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