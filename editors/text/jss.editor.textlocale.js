/**
 * Custom editor for textLocal
 * 
 * @version 1.0.5
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * @example 
 * jspreadsheet(document.getElementById('spreadsheet'), {
 *    columns: [
 *          {
 *              type: 'textlocale',
 *              locale: "nl-NL",         
 *          },
 *          {
 *              type: 'textlocale',
 *              locale: "fr-FR",         
 *          },
 *    ],
 * });
 * 
 * @license This plugin is distribute under MIT License
 */

 jspreadsheet.editors["textlocale"] = function() {
    var methods = {};
    var editor = null;
    var thousandSeparator = "";
    var decimalSeparator = ".";

    methods.createCell = function(cell, value, x, y, instance, options) {
        _init(options);
        return methods.updateCell(cell, value, x, y, instance, options);
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if (cell) {
            cell.innerText = methods.parseValue(x, y, value, instance, options);
            if(value!="" && _isNumber(value)) {
                return _getValueNumber(value);
            }
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {  
        editor = instance.parent.input;  
        if(typeof value == "number") {
            value = _getValueProcessed(value, options);
        }
        editor.innerText = value;
        editor.focus();
    }

    methods.closeEditor = function(cell, save, x, y, instance, options) {
        if (save) {
            var value = editor.innerText;
        } else {
            var value = '';
        }

        return value;
    }

    methods.parseValue = function(x, y, value, instance, options) {
        // Formula?
        if ((''+value).substr(0,1) == '=' && instance.parent.config.parseFormulas == true) {
            value = instance.executeFormula(_parseFormula(value, options), x, y);
        }
        
        // Apply Mask
        if(value!=="" && _isNumber(value)) {
            value = _getValueProcessed(value, options);
        } else {
            value = jspreadsheet.editors.text.parseValue(x, y, value, instance);
        }
        
        return value;
    }

    methods.get = function(options, value) {
        _init(options);
        if(value!=="" && _isNumber(value)) {
            return _getValueProcessed(value, options);
        } else {
            return jspreadsheet.editors.text.get(options, value);
        }
    }

    function _isNumber(value) {
        var rg = new RegExp("([^\\-0-9\\"+thousandSeparator+"\\"+decimalSeparator+"]+)", "gm");
        return value.toString().trim().replace(rg, "") == value.toString().trim();
    }
    
    function _parseFormula(value, options) {
        var rg = new RegExp("([0-9\\"+thousandSeparator+"\\"+decimalSeparator+"]+)", "gm");
        var rgArgs = new RegExp("([;])", "gm");
        var formulaWithNumberGoodFormat = value.toString().replace(rg, _getValueNumber);
        var formulaWithGoodArgs = formulaWithNumberGoodFormat.replace(rgArgs, ","); 
        return formulaWithGoodArgs;
    }
    function _getValueProcessed(value, options) {
        if(typeof value == "string") {
             value = _getValueNumber(value);
        }
        return new Intl.NumberFormat(options.locale, options).format(value);
    }

    function _getValueNumber(value) {
        return parseFloat(value.toString()
            .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
            .replace(new RegExp('\\' + decimalSeparator), '.')
        );
    }

    function _init(options) {
        thousandSeparator = Intl.NumberFormat(options.locale).format(11111).replace(/\p{Number}/gu, '');
        decimalSeparator = Intl.NumberFormat(options.locale).format(1.1).replace(/\p{Number}/gu, '');
    }

    return methods;
}();
