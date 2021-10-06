/**
 * Custom editor for textPattern
 * 
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @license This plugin is distribute under MIT License
 */

jspreadsheet.editors.textpattern = function() {
    var methods = {};
    var editor = null;

    methods.createCell = function(cell, value, x, y, instance, options) {
        if(value!=null) {
            value = methods.parseValue(x, y, value, instance, options); 
            cell.innerHTML = value;
        }
        return value; // Save new value verified
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if(value!=null) {
            value = methods.parseValue(x, y, value, instance, options); 
            cell.innerHTML = value;
        }
        return value; // Save new value verified
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {
        options = defaultOptions(options);
        editor = jspreadsheet.editors.createEditor('input', cell, value, instance);
        editor.setAttribute('pattern', options.pattern);
        
        editor.focus();
        if(options.uppercase) {
            value = value.toUpperCase();
        }
        editor.value = value;
        
        editor.addEventListener("keyup", handleEvent);
        editor.addEventListener("change", handleEvent);
        editor.addEventListener("input", handleEvent);
        
    }

    methods.closeEditor = function(cell, save, x, y, instance, options) {
        if (save) {
            var value = editor.value;
        } else {
            var value = '';
        }

        return value;
    }
    
    methods.parseValue = function(x, y, value, instance, options) {
        options = defaultOptions(options);
        var regReplace = new RegExp(options.pattern.replace("[","[^"), 'ig');
        
        value = value.replace(regReplace,'');

        if(options.uppercase) {
            value = value.toUpperCase();
        }

        return value;
    }
    
    function defaultOptions(options) {
        var defaultOptions = {
            uppercase: false,
            pattern: '[0-9a-zA-Z]*'
        }
        for(var ite_option in defaultOptions) {
            if(options[ite_option]==null) {
                options[ite_option] = defaultOptions[ite_option];
            }
        }
        return options;
    }
    
    function handleEvent(event) {
        if(event.target.getAttribute("pattern")) {
            var value = event.target.value,
                regReplace,
                filter = event.target.getAttribute("pattern");

            regReplace = RegExp(filter.replace("[","[^"), 'ig');
            event.target.value = value.replace(regReplace, '');
        }
    }

    return methods;
}();


