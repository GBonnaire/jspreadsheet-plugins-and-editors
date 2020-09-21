/**
 * Custom editor for numeral
 * 
 * @version 1.1.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @dependance Numeral http://numeraljs.com/
 * @description Use with option mask like number editor
 * 
 * @license This plugin is distribute under MIT License
 */

jexcel.editors.numeral = function() {
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
        if (options.mask || value != Number(value)) {
            var editor = jexcel.helpers.createEditor('input', cell);
        } else {
            var editor = jexcel.helpers.createEditor('number', cell);
        }

        editor.onblur = function() {
            instance.closeEditor(cell, true);
        }
        editor.focus();
        editor.value = value;
    }

    methods.closeEditor = function(cell, save) {
        if (save) {
            var value = cell.children[0].value;
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
                value = numeral(value).format(options.mask);
            } else {
                value = numeral(value).value();
            }
        }

        return value;
    }

    return methods;
}();


