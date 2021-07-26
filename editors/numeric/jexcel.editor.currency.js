/**
 * Custom editor for currency
 * documentation of options : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 * @version 1.0.0
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
 * Version 1.0 : Create version
 */

jspreadsheet.editors.currency = function() {
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
            var editor = jexcel.helpers.createEditor('input', cell);
        } else {
            var editor = jexcel.helpers.createEditor('number', cell);

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
        
        // Mask
        if(value!=="") {
            value = _applyMaskCurrency(value, options);
        }

        return value;
    }
    
    methods.get = function(options, value, extended) {
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


