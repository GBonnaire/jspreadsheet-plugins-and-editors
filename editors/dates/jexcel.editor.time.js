/**
 * Custom editor for time only (not datetime)
 * 
 * @version 1.1.2
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @license This plugin is distribute under MIT License
 */

jspreadsheet.editors.time = function() {
    var methods = {};
    var regExpTest = RegExp('^(([0-1]?[0-9])|([2][0-3])):[0-5][0-9]$');

    methods.createCell = function(cell, value, x, y, instance, options) {
        var ret = methods.parseValue(x, y, value, instance, options);
        if(ret===false) {
            cell.innerHTML = '#TIMENOTVALID';
        } else {
            cell.innerHTML = ret;
            return ret;
        }
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if (cell) {
            var ret = methods.parseValue(x, y, value, instance, options);
            if(ret===false) {
                cell.innerHTML = '#TIMENOTVALID';
            } else {
                cell.innerHTML = ret;
                return ret;
            }
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {

        var editor = jspreadsheet.helpers.createEditor('input', cell);
        editor.setAttribute('type', "time");


        editor.onblur = function() {
            instance.closeEditor(cell, true);
        }
        editor.focus();

        var ret = methods.parseValue(x, y, value, instance, options);
        if(ret===false) {
            editor.value = "";
        } else {
            editor.value = ret;
        } 
    }

    methods.closeEditor = function(cell, save) {
        if (save) {
            cell.innerHTML = cell.children[0].value;
        } else {
            cell.innerHTML  = '';
        }

        return cell.innerHTML;
    }

    methods.parseValue = function(x, y, value, instance, options) {
        if(value.indexOf("h")!=-1 || value.indexOf("H")!=-1) {
            value = value.replace(/h/i, ':');
        }
        if(value && !regExpTest.test(value)) {
            return false;
        } 
        return value;
    }

    return methods;
}();