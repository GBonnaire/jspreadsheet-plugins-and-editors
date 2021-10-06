/**
 * Custom editor for currency
 * documentation of options : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @example 
 * jspreadsheet(document.getElementById('spreadsheet'), {
 *    columns: [
 *          {
 *              type: 'currency',
 *              title: "currency",         
 *          },
 *          {
 *              type: 'currency',
 *              title: "currency EURO",
 *              currency: "EUR",
 *              currencyDisplay: "symbol",
 *          },
 *          {
 *              type: 'currency',
 *              title: "currency Dollars",
 *              locales: "en-US",
 *              currency: "USD",
 *              currencyDisplay: "code",                
 *          },
 *          {
 *              type: 'currency',
 *              title: "currency INR",
 *              locales: "en-IN",
 *          },
 *    ],
 * });
 * 
 * 
 * @license This plugin is distribute under MIT License
 * 
 * @description
 * Version 2.0 : update for v8
 * Version 1.0 : Create version
 */

jspreadsheet.editors.currency = function() {
    var methods = {};
    var editor = null;
    
    methods.createCell = function(cell, value, x, y, instance, options) {
        cell.innerText = methods.parseValue(x, y, value, instance, options);
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if (cell) {
            cell.innerText = methods.parseValue(x, y, value, instance, options);
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {        
        editor = instance.parent.input;  
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
            value = instance.executeFormula(value, x, y);
        }
        
        // Mask
        if(value!=="") {
            value = _applyMaskCurrency(value, options);
        }

        return value;
    }
    
    methods.get = function(options, value) {
        return _applyMaskCurrency(value, options);
    }
    
    /**
     * Mask for currency 
     * @param {String} value
     * @param {Object} options
     * @returns {String}
     */
    function _applyMaskCurrency(value, options) {
        value = parseFloat(value);
        
        
        if(!options.currency) {
            return Intl.NumberFormat().format(value);
        }
        
        options.style = "currency";
        
        return new Intl.NumberFormat(options.locales, options).format(value);
    }

    return methods;
}();
