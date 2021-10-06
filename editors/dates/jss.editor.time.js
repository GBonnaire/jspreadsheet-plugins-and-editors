/**
 * Custom editor for time only (not datetime)
 * 
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @license This plugin is distribute under MIT License
 */

jspreadsheet.editors.time = function() {
    var methods = {};
    var regExpTest = RegExp('^(([0-1]?[0-9])|([2][0-3])):[0-5][0-9]$');
    var editor = null;

    methods.createCell = function(cell, value, x, y, instance, options) {
        var ret = _checkValue(value);
        if(ret===false) {
            cell.innerHTML = '#TIMENOTVALID';
        } else {
            cell.innerHTML = ret;
            return ret;
        }
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if (cell) {
            var ret = _checkValue(value);
            if(ret===false) {
                cell.innerHTML = '#TIMENOTVALID';
            } else {
                cell.innerHTML = ret;
                return ret;
            }
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {

        editor = jspreadsheet.editors.createEditor('input', cell, value, instance);
        editor.setAttribute('type', "time");
        
        var ret = _checkValue(value);
        if(ret===false) {
            editor.value = "";
        } else {
            editor.value = ret;
        } 

        editor.focus();
    }

    methods.closeEditor = function(cell, save, x, y, instance, options) {
        if (save) {
            var value = editor.value;
        } else {
            var value = '';
        }

        return value;
    }

    function _checkValue(value) {
        if(value.indexOf("h")!=-1 || value.indexOf("H")!=-1) {
            value = value.replace(/h/i, ':');
        }
        if(value && !regExpTest.test(value)) {
            return false;
        } 
        return value;
    }
    
    methods.get = function(options, value) {
        var ret = _checkValue(value);
            if(ret===false) {
                return'#TIMENOTVALID';
            } else {
                return ret;
            }
    }

    return methods;
}();