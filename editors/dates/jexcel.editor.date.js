/**
 * Custom editor for date only (not datetime)
 * 
 * @version 1.2.8
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
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
            } else if(typeof value == "string" && value.substring(0,1) != "=") {
                cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                value = methods.DateToExcelDate(tmp_value);
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
                    cell.innerHTML = '#NOTDATEVALID';
                } else if(typeof value == "string" && value.substring(0,1) != "=") {
                    cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                    return methods.DateToExcelDate(tmp_value); // Save new date verified
                } else {
                    cell.innerHTML = formatedDateOnLocalFormat(tmp_value, options.locales, options.formatOutputOnCell);
                }
            } else {
                cell.innerHTML = "";
            }
        }
    }

    methods.openEditor = function(cell, value, x, y, instance, options) {

        var editor = jexcel.helpers.createEditor('input', cell);
        if(typeof value != "string" || value.substring(0,1) != "=") {
            editor.setAttribute('type', "date");
            editor.style.fontSize = "10px";
            if(parseFloat(value)+"" === value+"") {
                value = methods.ExcelDateToDate(value);
            }
        }
        if(options['min']) {
            editor.setAttribute('min', options['min']);
        }
        if(options['max']) {
            editor.setAttribute('max', options['max']);
        }
        
        editor.addEventListener('keyup', function(e) {
            if(this.value=="") {
                if(instance.options.parseFormulas == true && e.key=="=") {
                    this.setAttribute('type', "text");
                    this.style.fontSize = "12px";
                    this.value = "=";
                    this.focus();
                } else if(this.getAttribute('type')=="text" || this.getAttribute('type')==null) {
                    this.setAttribute('type', "date");
                    this.style.fontSize = "10px";
                    this.focus();
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
            var value = cell.children[0].value;
        } else {
            var value  = '';
        }
        
        cell.innerHTML = value;
        
        if(value=="" || value.substring(0,1)=="=") {
            return value;
        } else {
            return methods.DateToExcelDate(value);
        }
    }
    
    methods.parseValue = function(x, y, value, instance, options) {
        if(value) {
            if(typeof value == "string" && value.substring(0,1)=="=" && instance.options.parseFormulas == true) {
                value = instance.executeFormula(value, x, y);
            }     
            // Date like Excel
            if(parseFloat(value)+"" === value+"") {
                value = methods.ExcelDateToDate(value);
            }

            if(value && !isDateISOValid(value)) {
                if(isDateTimeISOValid(value)) {
                    // Extract date
                    value = value.substring(0,10);
                } else {
                    // Transform Date to Date ISO
                    var tmp_value = stringToDateISO(value, options.formatInput);
                    if(tmp_value !== false) {
                        value = tmp_value;
                    } else {
                        value = false;
                    }
                }
            }       
        }
        return value;
    }
    
    methods.get = function(options, value, extended) {
        if(parseFloat(value)+"" === value+"") {
            value = methods.ExcelDateToDate(value);
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
    
    function isDateISOValid(str) {
        var tester = /^([0-9]{4})\-(0[1-9]|1[012])\-(0[1-9]|(1|2)[0-9]|3[01])$/;
        return tester.test(str);
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
        
        var day=addzero(parseInt(str.substring(dayIndex,dayIndex*1+2)), 10);
        var month=addzero(parseInt(str.substring(monthIndex,monthIndex*1+2)), 10);
        var year=addzero(parseInt(str.substring(yearIndex,yearIndex*1+4)), 1000);

        var newDateISO_str = year+"-"+month+"-"+day;

        if(isDateISOValid(newDateISO_str)) {
            return newDateISO_str;
        } else {
            return false;
        }
    }
    
    methods.DateToExcelDate = function(inDate) { 
        if(typeof inDate == "string") {
            inDate = new Date(inDate);
        }
        var returnDateTime = 25569 + (inDate.getTime() / (1000 * 60 * 60 * 24));
        return parseInt(returnDateTime); // Return only date
    }
    
    methods.ExcelDateToDate = function(value) {
        var date_value = new Date(Math.round((value - 25569)*(1000 * 60 * 60 * 24)));
        return date_value.getFullYear() + "-" + addzero((date_value.getMonth()*1+1),10) + "-" + addzero(date_value.getDate(),10);
    }
    
    return methods;
}();