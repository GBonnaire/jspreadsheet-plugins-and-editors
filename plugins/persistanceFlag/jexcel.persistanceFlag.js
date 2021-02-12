/**
 * Plugin for change notification of persistance for jExcel Pro / jSpreadsheet
 * 
 * @version 1.4.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 * @description change notification of persistance
 * 
 * @license This plugin is distribute under MIT License
 * 
 * ReleaseNote
 * 1.4.0 add time and showOnlyTime
 * 1.3.0 add compatibility NPM
 */

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_persistanceFlag = factory();
}(this, (function () {
    return (function(instance, options) {

        // Plugin object
        var plugin = {};
        var flagElement = null;
        var messageElement = null;
        var iconElement = null;
        var overrideNotificationVisible = null;
        var countQuery = 0;
        var timeLoop = 0;

        // Set options
        plugin.options = Object.assign({},options);


        // Options
        var defaultOptions = {
              showText: true,
              showOnlyTime: false,
              icon_error: 'error',
              text_error: 'Not updated',
              icon_success: 'check_circle',
              text_success: 'Updated {date}',
              icon_progress: 'cached',
              css_progress: '',
              text_progress: 'Updating',
              dateFormat : { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
        }


       // Set default value
       if(plugin.options==null) {
           plugin.options = {};
       }
       for(var property in defaultOptions) {
            if (!plugin.options.hasOwnProperty(property) || plugin.options[property]==null ) {
                plugin.options[property] = defaultOptions[property];
            }

            if(property.substring(0,5)==="text_") {
                var propertyText = "flagpersistance_" + property.substring(5,property.length);
                if(instance.options.text[propertyText]) {
                    plugin.options[property] = instance.options.text[propertyText];
                }
            } 
       }


        /**
         * Jexcel events
         */
        plugin.onevent = function(event) {
            if(event=="onload") {
                if(instance.options.persistance) {
                    createFlag(instance);
                }
            } else if(event=="onbeforesave" && instance.options.toolbar) { 
                if(countQuery<0) {
                    countQuery = 0;
                }

                if(!overrideNotificationVisible) {
                   overrideNotificationVisible = jSuites.notification.isVisible;
                }

                if(countQuery==0) {
                    jSuites.notification.isVisible = function() {
                        return true;
                    }
                }
                countQuery++;
                plugin.setInProgress();
            } else if(event=="onblur" && instance.options.toolbar) {
                if(countQuery == 0) {
                    reset();
                } else {
                    setTimeout(reset, 1000);
                }            
            } else if(event=="onsave" && instance.options.toolbar) {
                var options = arguments[4];
                if(options.success) {
                    countQuery--;
                    if(countQuery<=0) {
                      plugin.setSuccess();
                    }
                } else {
                   countQuery = 0;
                   plugin.setError();
                   console.error(options);
                }
            }
        }

        function reset() {
            if(countQuery <= 0) {
                timeLoop = 0;
                if(overrideNotificationVisible) {
                    jSuites.notification.isVisible = overrideNotificationVisible;
                }
            } else {
                timeLoop ++;
                if(timeLoop>5) {
                    console.error("TimeOut Reset", countQuery);
                    countQuery = 0;  
                    plugin.setSuccess();
                }
                setTimeout(reset, 1000);
            }
        }

        plugin.change = function(icon, message, applyCSS, iconColor) {
            if(message.indexOf("{date}")!=-1) {
                var date = new Date();
                if(plugin.options.showOnlyTime) {
                    var str_date = date.toLocaleTimeString(undefined);
                } else {
                    var str_date = date.toLocaleDateString(undefined, plugin.options.dateFormat);
                }
                message = message.replace("{date}", str_date);
            }
            
            if(message.indexOf("{time}")!=-1) {
                var date = new Date();
                var str_date = date.toLocaleTimeString(undefined);
                message = message.replace("{time}", str_date);
            }


            if(iconElement) {
                iconElement.innerHTML = icon;
                if(iconColor) {
                    iconElement.style.color = iconColor;
                } else {
                    iconElement.style.color = "inherit";
                }
                if(plugin.options.css_progress) {
                    if(applyCSS===true) {
                        iconElement.classList.add(plugin.options.css_progress);
                    } else {
                        iconElement.classList.remove(plugin.options.css_progress);
                    }
                }
            }

            if(messageElement) {
                messageElement.innerHTML = message;
            }
        }

        plugin.setInProgress = function() {
            plugin.change(plugin.options.icon_progress, plugin.options.text_progress, true);
        }

        plugin.setSuccess = function() {
            plugin.change(plugin.options.icon_success, plugin.options.text_success, false, "green");
        }

        plugin.setError = function() {
            plugin.change(plugin.options.icon_error, plugin.options.text_error, false, "red");
        }


        function createFlag(element) {
            flagElement = document.createElement("div");
            flagElement.classList.add("jtoolbar-item");
            flagElement.classList.add("jexcel-flagPersistance");


            if(plugin.options.showText) {
                messageElement = document.createElement("span");
                flagElement.appendChild(messageElement);
            }

            iconElement = document.createElement("i");
            iconElement.classList.add("material-icons");
            iconElement.style.cssText = "display:inline-block";

            flagElement.appendChild(iconElement);

            element.toolbar.children[0].appendChild(flagElement);
        }

        function createClass(classContent) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = classContent;
            document.getElementsByTagName('head')[0].appendChild(style);
        }

        return plugin;
    });
    
})));   
    
 // Compatibility Old version   
const jexcel_persistanceFlag = jss_persistanceFlag;