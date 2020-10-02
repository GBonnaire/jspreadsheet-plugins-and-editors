/**
 * Custom editor for textPattern
 * 
 * @version 1.0.1
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @license This plugin is distribute under MIT License
 */

jexcel.editors.textpattern = function() {
    var methods = {};

    methods.createCell = function(cell, value, x, y, instance, options) {
        if(value) {
            value = methods.parseValue(x, y, value, instance, options); 
            cell.innerHTML = value;
        }
        return value; // Save new date verified
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if(value!=null) {
            value = methods.parseValue(x, y, value, instance, options); 
            cell.innerHTML = value;
        }
        return value; // Save new date verified
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {
        options = defaultOptions(options);
        var editor = jexcel.helpers.createEditor('input', cell);
        editor.setAttribute('pattern', options.pattern);
        editor.onblur = function() {
            instance.closeEditor(cell, true);
        }
        editor.focus();
        if(options.uppercase) {
            value = value.toUpperCase();
        }
        editor.value = value;
        
        editor.addEventListener("keyup", doOnEvent);
        editor.addEventListener("change", doOnEvent);
        editor.addEventListener("input", doOnEvent);
        
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
    
    function doOnEvent(event) {
        if(event.target.getAttribute("pattern")) {
            var options = event.target.getAttribute("optionsEditor");
            var value = event.target.value,
                regReplace,
                filter = event.target.getAttribute("pattern");

            regReplace = RegExp(filter.replace("[","[^"), 'ig');
            event.target.value = value.replace(regReplace, '');
        }
    }

    return methods;
}();


