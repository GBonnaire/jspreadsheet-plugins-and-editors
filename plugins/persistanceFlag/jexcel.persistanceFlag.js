/**
 * Plugin for change notification of persistance
 * 
 * @version 1.0.0
 * @author Guillaume Bonnaire <contact@gbonnaire.fr>
 * @website https://www.gbonnaire.fr
 * @description change notification of persistance
 * 
 * @license This plugin is distribute under MIT License
 */
var jexcel_persistanceFlag = (function(instance, options) {

    // Plugin object
    var plugin = {};
    var flagElement = null;
    var messageElement = null;
    var iconElement = null;
    var overrideNotification = null;
    var overrideNotificationVisible = null;
    
    // Set options
    plugin.options = Object.assign({},options);


    // Options
    var defaultOptions = {
          showText: true,
          icon_error: 'error',
          text_error: 'Not updated',
          icon_success: 'check_circle',
          text_success: 'Updated {date}',
          icon_progress: 'cached',
          text_progress: 'In updating',
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
        }
        if(event=="onbeforesave" && instance.options.toolbar) {    
            if(!overrideNotification) {
               overrideNotification = jSuites.notification;
            }
            if(!overrideNotificationVisible) {
               overrideNotificationVisible = jSuites.notification.isVisible;
            }
            jSuites.notification = function (options) {
                if(options.success==1) {
                   plugin.setSuccess();
                } else {
                   plugin.setError();
                   console.error(options);
                }
            }
            jSuites.notification.isVisible = function() {
                return false;
            }
            plugin.setInProgress();
        } else if(event=="onblur") {
            if(overrideNotification) {
                jSuites.notification = overrideNotification;
            }
            
            if(overrideNotificationVisible) {
                jSuites.notification.isVisible = overrideNotificationVisible;
            }
        }
    }
    
    
    
    plugin.change = function(icon, message, iconTurn, iconColor) {
        
        if(message.indexOf("{date}")!=-1) {
            var date = new Date();
            var str_date = date.toLocaleDateString(undefined, plugin.options.dateFormat);
            message = message.replace("{date}", str_date);
        }
        
        
        if(iconElement) {
            iconElement.innerHTML = icon;
            if(iconColor) {
                iconElement.style.color = iconColor;
            } else {
                iconElement.style.color = "inherit";
            }
            if(iconTurn===true) {
                iconElement.classList.add("jexcel-spin");
            } else {
                iconElement.classList.remove("jexcel-spin");
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
        flagElement.style.cssText = "position:absolute;right:0";
        flagElement.classList.add("jexcel-flagPersistance");
        
        if(plugin.options.showText) {
            messageElement = document.createElement("span");
            flagElement.appendChild(messageElement);
        }
        
        iconElement = document.createElement("i");
        iconElement.classList.add("material-icons");
        flagElement.appendChild(iconElement);
        
        element.toolbar.appendChild(flagElement);
        
        // Create Style animation
        createClass(".jexcel-spin{animation:jexcel-spin 2s infinite linear}@keyframes jExcel-spin{0%{transform:rotate(0deg)}100%{transform:rotate(359deg)}}");
    }
    
    function createClass(classContent) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = classContent;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    
    return plugin;
});