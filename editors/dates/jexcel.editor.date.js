/**
 * Custom editor for date only (not datetime)
 * 
 * @version 1.1.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @license This plugin is distribute under MIT License
 */
jexcel.editors.date = function() {
    var methods = {};

    methods.createCell = function(cell, value, x, y, instance, options) {
        if(value) {
            var tmp_value = methods.parseValue(x, y, value, instance, options); 
            if(tmp_value===false) {
                cell.innerHTML = '#NOTDATEVALID';
            } else {
                value = tmp_value;
                cell.innerHTML = formatedDateOnLocalFormat(value, options.locales, options.formatOutputOnCell);
                
            }
        }
        return value; // Save new date verified
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if (cell && value) {
            var tmp_value = methods.parseValue(x, y, value, instance, options);
            if(tmp_value===false) {
                cell.innerHTML = '#NOTDATEVALID';
            } else {
                cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                return tmp_value; // Save new date verified
            }
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {

        var editor = jexcel.helpers.createEditor('input', cell);
        editor.setAttribute('type', "date");
        if(options['min']) {
            editor.setAttribute('min', options['min']);
        }
        if(options['max']) {
            editor.setAttribute('max', options['max']);
        }

        editor.onblur = function() {
            instance.closeEditor(cell, true);
        }
        editor.focus();

        editor.value = value;
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
        if(value) {
            // Date like Excel
            if(parseFloat(value)+"" === value+"") {
                var date_value = new Date(Math.round((value - 25569)*86400*1000));
                value = date_value.getFullYear() + "-" + addzero((date_value.getMonth()*1+1),10) + "-" + addzero(date_value.getDate(),10);
            }
            
            if(!isDateISOValid(value)) {
                // Transform Date to Date ISO
                var tmp_value = stringToDateISO(value, options.formatInput);
                if(tmp_value !== false) {
                    value = tmp_value;
                } else {
                    value = false;
                }
            }

            
        }
        return value;
    }

    function addzero(value, base) {
        var count_zero = (""+base).length - (""+value).length;
        if(count_zero>0) {
            for(var i=0; i<count_zero;i++) {
                value = "0"+value;
            }
        }
        return value;
    }
    
    function isDateISOValid(str) {
        var tester = /^([0-9]{4})\-(0[1-9]|1[012])\-((0|1|2)[1-9]|3[01])$/;
        return tester.test(str);
    }
    
    function formatedDateOnLocalFormat(str, locales, options) {
        if(locales==null) {
            locales = undefined;
        }
        if(options==null) {
            options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        }
        if(str && isDateISOValid(str)) {
            var str_date = new Date(str);
            var strFormated = str_date.toLocaleDateString(locales, options);
        } else {
            var strFormated = "";
        }
        
        return strFormated;
    }
    
    function stringToDateISO(str, format) {
        if(!format) {
            format="yyyy-mm-dd";
        } else {
            format=format.toLowerCase();
        }
        
        
        var monthIndex=format.indexOf("mm");
        var dayIndex=format.indexOf("dd");
        var yearIndex=format.indexOf("yyyy");
        
        var day=addzero(parseInt(str.substr(dayIndex,dayIndex*1+2)), 10);
        var month=addzero(parseInt(str.substr(monthIndex,monthIndex*1+2)), 10);
        var year=addzero(parseInt(str.substr(yearIndex,yearIndex*1+4)), 1000);

        var newDateISO_str = year+"-"+month+"-"+day;

        if(isDateISOValid(newDateISO_str)) {
            return newDateISO_str;
        } else {
            return false;
        }
    }
    return methods;
}();