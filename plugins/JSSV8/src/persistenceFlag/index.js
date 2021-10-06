/**
 * Plugin for change notification of persistence for jSpreadsheet Pro
 * 
 * @version 2.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://repo.gbonnaire.fr
 *  
 * @license This plugin is distribute under MIT License
 * 
 * @description change notification of persistence
 * ReleaseNote
 * 2.0.0 migrating to JSS v8 and change name persistance to persistence
 * 1.4.2 fix bug compatibility
 * 1.4.1 add require
 * 1.4.0 add time and showOnlyTime
 * 1.3.0 add compatibility NPM
 */
if (! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
}

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jss_persistenceFlag = factory();
}(this, (function () {
    return (function(spreadsheet, options, spreadsheetConfig) {

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
              text_error: jSuites.translate('not saved'),
              icon_success: 'check_circle',
              text_success: jSuites.translate('saved at {date}'),
              icon_progress: 'cached',
              css_progress: '',
              text_progress: jSuites.translate('saving'),
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
       }
       
       /**
         * On load
         * @type onload
         */
        var baseOnload = spreadsheetConfig.onload;
        spreadsheetConfig.onload = function() {
            // load ended
            if(baseOnload) {
                baseOnload.apply(spreadsheet, arguments);
            }
            
            createFlag();
        }


        /**
         * Jspreadsheet events
         */
        plugin.onevent = function(event, worksheet) {
            if(event=="onbeforesave" && spreadsheet.config.toolbar) { 
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
            } else if(event=="onblur" && spreadsheet.config.toolbar) {
                if(countQuery == 0) {
                    reset();
                } else {
                    setTimeout(reset, 1000);
                }            
            } else if(event=="onsave" && spreadsheet.config.toolbar) {
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


        function createFlag() {
            flagElement = document.createElement("div");
            flagElement.classList.add("jtoolbar-item");
            flagElement.classList.add("jss-flagPersistence");


            if(plugin.options.showText) {
                messageElement = document.createElement("span");
                flagElement.appendChild(messageElement);
            }

            iconElement = document.createElement("i");
            iconElement.classList.add("material-icons");
            iconElement.style.cssText = "display:inline-block";

            flagElement.appendChild(iconElement);

            spreadsheet.toolbar.children[0].appendChild(flagElement);
        }
        
        return plugin;
    });
    
})));   