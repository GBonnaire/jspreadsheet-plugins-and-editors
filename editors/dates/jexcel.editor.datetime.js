/**
 * Custom editor for datetime
 * 
 * @version 1.1.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * 
 * @license This plugin is distribute under MIT License
 */
jexcel.editors.datetime = function() {
    var methods = {};

    methods.createCell = function(cell, value, x, y, instance, options) {
        if(value) {
            var tmp_value = methods.parseValue(x, y, value, instance, options); 
            if(tmp_value===false) {
                cell.innerHTML = '#NOTDATETIMEVALID';
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
                cell.innerHTML = '#NOTDATETIMEVALID';
            } else {
                cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                return tmp_value;
            }
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {

        var editor = jexcel.helpers.createEditor('input', cell);
        editor.setAttribute('type', "datetime-local");
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
                var utc_days  = Math.floor(value - 25569);
                var utc_value = utc_days * 86400;                                        
                var date_info = new Date(utc_value * 1000);

                var fractional_day = value - Math.floor(value) + 0.0000001;

                var total_seconds = Math.floor(86400 * fractional_day);

                var seconds = total_seconds % 60;

                total_seconds -= seconds;

                var hours = Math.floor(total_seconds / (60 * 60));
                var minutes = Math.floor(total_seconds / 60) % 60;

                var tmp_date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
                value = tmp_date.toISOString().split(".")[0]; // Without timezone
            }
            
            if(!isDateTimeISOValid(value)) {
                // Transform Date to Date ISO
                var tmp_value = stringToDateTimeISO(value, options.formatInput);
                if(tmp_value !== false) {
                    value = tmp_value;
                } else {
                    value = false;
                }
            } else {
                var tmp_date = new Date(value);
                value = tmp_date.toISOString().split(".")[0]; // Without timezone
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
    
    function isDateTimeISOValid(str) {
        var tester = /(\d{4}-[01]\d-[0-3]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
        return tester.test(str);
    }
    
    function formatedDateOnLocalFormat(str, locales, options) {
        if(locales==null) {
            locales = undefined;
        }
        if(options==null) {
            options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        }
        if(str && isDateTimeISOValid(str)) {
            var str_date = new Date(str);
            var strFormated = str_date.toLocaleDateString(locales, options);
        } else {
            var strFormated = "";
        }
        
        return strFormated;
    }
    
    function stringToDateTimeISO(str, format) {
        if(!format) {
            format="yyyy-mm-dd hh:nn:ss";
        } else {
            format=format.toLowerCase();
        }
        
        var monthIndex=format.indexOf("mm");
        var dayIndex=format.indexOf("dd");
        var yearIndex=format.indexOf("yyyy");
        
        var hourIndex=format.indexOf("hh");
        var minuteIndex=format.indexOf("nn");
        var secondIndex=format.indexOf("ss");
        
        var day=addzero(parseInt(str.substr(dayIndex,dayIndex*1+2)), 10);
        var month=addzero(parseInt(str.substr(monthIndex,monthIndex*1+2)), 10);
        var year=addzero(parseInt(str.substr(yearIndex,yearIndex*1+4)), 1000);
        
        if(hourIndex!=-1 && str.length>(hourIndex*1+2)) {
            var hour = addzero(parseInt(str.substr(hourIndex,hourIndex*1+2)), 10);
        } else {
            var hour = "00";
        }
        if(minuteIndex!=-1 && str.length>(minuteIndex*1+2)) {
            var minute = addzero(parseInt(str.substr(minuteIndex,minuteIndex*1+2)), 10);
        } else {
            var minute = "00";
        }
        if(secondIndex!=-1 && str.length>(secondIndex*1+2)) {
            var second = addzero(parseInt(str.substr(secondIndex,secondIndex*1+2)), 10);
        } else {
            var second = "00";
        }

        var newDateISO_str = year+"-"+month+"-"+day+"T"+hour+":"+minute+":"+second;

        if(isDateTimeISOValid(newDateISO_str)) {
            return newDateISO_str;
        } else {
            return false;
        }
    }
    return methods;
}();