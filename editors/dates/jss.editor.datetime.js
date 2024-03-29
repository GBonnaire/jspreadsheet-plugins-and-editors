/**
 * Custom editor for datetime
 * 
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * 
 * @license This plugin is distribute under MIT License
 */
jspreadsheet.editors.datetime = function() {
    var methods = {};
    var editor = null;

    methods.createCell = function(cell, value, x, y, instance, options) {
        if(value) {
            var tmp_value = methods.parseValue(x, y, value, instance, options); 
            if(tmp_value===false) {
                cell.innerHTML = '#NOTDATETIMEVALID';
            } else if(typeof value == "string" && value.substring(0,1) != "=") {
                cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                value = methods.DateTimeToExcelDateTime(tmp_value);
            } else {
                cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
            }
        }
        return value; // Save new date verified
    }

    methods.updateCell = function(cell, value, x, y, instance, options) {
        if (cell) {
            if(value) {
                var tmp_value = methods.parseValue(x, y, value, instance, options);
                if(tmp_value===false) {
                    cell.innerHTML = '#NOTDATETIMEVALID';
                } else if(value.substring(0,1) != "=") {
                    cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                    return methods.DateTimeToExcelDateTime(tmp_value);
                } else {
                    cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                }   
            } else {
                cell.innerHTML = "";
            }
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {
        
        if(typeof value != "string" || value.substring(0,1) != "=") {
            editor = jspreadsheet.editors.createEditor("input", cell, value, instance);
            editor.setAttribute('type', "datetime-local");
            if(options['min']) {
                editor.setAttribute('min', options['min']);
            }
            if(options['max']) {
                editor.setAttribute('max', options['max']);
            }
            
            if(parseFloat(value)+"" === value+"") {
                value = methods.ExcelDateTimeToDateTime(value);
            }
            
            editor.value = value;
        } else {
            editor = instance.parent.input;  
            editor.innerText = value;
        }
        editor.focus();
    }

    methods.closeEditor = function(cell, save, x, y, instance, options) {
        if (save) {
            if(editor === instance.parent.input) {
                var value = editor.innerText;
            } else {
                var value = editor.value;
            }
        } else {
            var value  = '';
        }
        
        if(value=="" || value.substring(0,1)=="=") {
            return value;
        } else {
            return methods.DateTimeToExcelDateTime(value);
        }
    }

    methods.parseValue = function(x, y, value, instance, options) {
        if(value) {
            if(typeof value == "string" && value.substring(0,1)=="=" && instance.options.parseFormulas == true) {
                value = instance.executeFormula(value, x, y);
            } 
            // Date like Excel
            if(parseFloat(value)+"" === value+"") {
                value = methods.ExcelDateTimeToDateTime(value);
            }
            
            if(value && !isDateTimeISOValid(value)) {
                // Transform Date to Date ISO
                var tmp_value = stringToDateTimeISO(value, options.formatInput);
                if(tmp_value !== false) {
                    value = tmp_value;
                } else {
                    value = false;
                }
            } else if(value) {
                value = stringToDateTimeISO(value);
            }
            
        }
        return value;
    }
    
    methods.get = function(options, value) {
        if(parseFloat(value)+"" === value+"") {
            value = methods.ExcelDateTimeToDateTime(value);
        } else {
            value = stringToDateTimeISO(value, options.formatInput);
        }
        return formatedDateOnLocalFormat(value, options.locales, options.formatOutputOnCell);
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
        var tester = /^(\d{4}-[01]\d-[0-3]\d)$|^(\d{4}-[01]\d-[0-3]\d(T|\s)[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))$|^(\d{4}-[01]\d-[0-3]\d(T|\s)[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)?)$|^(\d{4}-[01]\d-[0-3]\d(T|\s)[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;
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
        
        var day=addzero(parseInt(str.substring(dayIndex,dayIndex*1+2)), 10);
        var month=addzero(parseInt(str.substring(monthIndex,monthIndex*1+2)), 10);
        var year=addzero(parseInt(str.substring(yearIndex,yearIndex*1+4)), 1000);
        
        if(hourIndex!=-1 && str.length>=(hourIndex*1+2)) {
            var hour = addzero(parseInt(str.substring(hourIndex,hourIndex*1+2)), 10);
        } else {
            var hour = "00";
        }
        if(minuteIndex!=-1 && str.length>=(minuteIndex*1+2)) {
            var minute = addzero(parseInt(str.substring(minuteIndex,minuteIndex*1+2)), 10);
        } else {
            var minute = "00";
        }
        
        if(secondIndex!=-1 && str.length>=(secondIndex*1+2)) {
            var second = addzero(parseInt(str.substring(secondIndex,secondIndex*1+2)), 10);
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
    
    methods.stringToDateTimeISO = stringToDateTimeISO
    
    methods.DateTimeToExcelDateTime = function (inDate) { 
        if(typeof inDate == "string") {
            inDate = new Date(inDate);
        }
        var returnDateTime = 25569 + ((inDate.getTime() - (inDate.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
        return returnDateTime.toString().substring(0,20);
    }
    
    methods.ExcelDateTimeToDateTime = function (value) {
        var date_value = new Date(Math.round((value - 25569)*(1000 * 60 * 60 * 24)));
        
        var fractional_day = value - Math.floor(value) + 0.0000001;

        var total_seconds = Math.floor(86400 * fractional_day);
        var seconds = total_seconds % 60;

        total_seconds -= seconds;

        var hours = Math.floor(total_seconds / (60 * 60));
        var minutes = Math.floor(total_seconds / 60) % 60;

        return date_value.getFullYear() + '-' + addzero(date_value.getMonth()*1+1,10) + '-' + addzero(date_value.getDate(),10) + 'T' + addzero(hours,10) + ':' + addzero(minutes,10) + ':' + addzero(seconds,10);
    }
    
    return methods;
}();