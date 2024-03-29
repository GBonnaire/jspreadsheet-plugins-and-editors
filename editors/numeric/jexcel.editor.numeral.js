/**
 * Custom editor for numeral
 * 
 * @version 1.3.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @dependency NumeralJS.com 
 * 
 * @license This plugin is distribute under MIT License
 * 
 * @description
 * Version 1.3 : Add decimal management
 * Version 1.2 : Add step on editor + option for allowFormula
 */

jspreadsheet.editors.numeral = function() {
var methods = {};

    methods.createCell = function(cell, value, x, y, instance, options) {
        cell.innerText = methods.parseValue(x, y, value, instance, options);
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if (cell) {
            cell.innerText = methods.parseValue(x, y, value, instance, options);
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {
        if((''+value).substr(0,1) == '=' || options.allowFormula==true) {
            var editor = jspreadsheet.helpers.createEditor('input', cell);
        } else {
            var editor = jspreadsheet.helpers.createEditor('number', cell);

            if(options.step) {
                editor.setAttribute("step", options.step);
            } else {
                editor.setAttribute("step", "any");
            }
            
            if(options.min) {
                editor.setAttribute("min", options.min);
            }
            
            if(options.max) {
                editor.setAttribute("max", options.max);
            }
        }
        
        editor.addEventListener('keyup', function(e) {
            if(this.value=="") {
                if(instance.options.parseFormulas == true && e.key=="=") {
                    this.setAttribute('type', "text");
                    this.value = "=";
                    this.focus();
                } else if(this.getAttribute('type')=="text" || this.getAttribute('type')==null) {
                    this.setAttribute('type', "number");
                    this.focus();
                }
            } 
        });

        editor.onblur = function() {
            instance.closeEditor(cell, true);
        }
        editor.focus();
        editor.value = value;
    }

    methods.closeEditor = function(cell, save) {
        if (save) {
            if(cell.children[0].checkValidity()) { // Test Validity of input
                var value = cell.children[0].value;
            } else {
                var value = '';
            }
        } else {
            var value = '';
        }

        cell.innerText = value;

        return value;
    }
    
    methods.parseValue = function(x, y, value, instance, options) {
        // Formula?
        if ((''+value).substr(0,1) == '=' && instance.options.parseFormulas == true) {
            value = instance.executeFormula(value, x, y)
        }
        
        // Mask?
        if(numeral(value).value()==value) {
            if (options && options.mask) {
                if(options.decimal) {
                    var rg = new RegExp(options.decimal, "g");
                    options.mask = options.mask.replace(rg,".");
                }
                value = numeral(value).format(options.mask);
            } else {
                value = numeral(value).value();
            }
            if(options && options.decimal) {
                var rg = new RegExp(options.decimal, "gi");
                value = value.replace(rg,"");
                value = value.replace(".", options.decimal);
            }
        }

        return value;
    }

    return methods;
}();


