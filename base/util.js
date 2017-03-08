/**
 * Author       jssoscar
 * Date         2015-11-30 14:49:55
 * Version      1.0
 * Description  SPA Util
 */

define(function(require, exports, module){
    var Reg = require("./reg");
    
    /**
     * Util
     * 
     * extend : extend object
     *      @param {Object} target : target object
     *      @param {Object} source : source object
     * 
     * getRequest : get request by hash
     *      @param {String} hash : current hash
     * 
     * getController : get controller by module
     *      @param {String} module : current module
     *      @param {Object} config : SPA config
     * 
     * startsWith : starts with
     *      @param {String} source : source
     *      @param {String} str : str
     * 
     * updateParameter : update parameter
     *      @param {Object} data : path data
     *      @param {Function} callback : callback
     */
    var Util = {
        extend : function(target, source) {
            if (source) {
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        },
        getRequest : function(hash){
            var request = {};
            
            // get hash and template module
            if(hash){
                request = {
                    hash : hash,
                    module : hash.match(Reg.hash)[0]
                };
            }
            
            return request;
        },
        getController : function(module, config){
            if(module.charAt(0) === "#"){
                module = module.substr(1);
            }
            
            if(module.charAt(0) !== "/"){
                module = "/" + module;
            }
            
            return (config.controllerRoot + module + "/" + config.controllerName).replace(/\/\//g, "/");
        },
        startsWith : function(source, str){
            if(!source || !str || source.length < str.length){
                return false;
            }
            
            if(source.substr(0, str.length) === str){
                return true;
            }
            return false;
        },
        updateParameter : function(data, callback){
            var hash = location.hash,
                sign = "?",
                reg = new RegExp("(\\?|&)(" + data.key + "=)([^&]*)", "i");
                
            if(hash.length >1){
                
                // has search
                if(hash.indexOf(sign) === -1){
                    location.hash = hash + sign + data.key + "=" + data.value;
                }else{
                    var match = hash.match(reg);
                    // has parameter
                    if(match){
                        location.hash = hash.replace(reg, "$1$2" +  decodeURIComponent(data.value));
                    }else{
                        location.hash = hash + "&" + data.key + "=" + data.value;
                    }
                }
                
                // callback
                callback && callback();
            }
        },
        isFunction : function(object){
            return Object.prototype.toString.call(object) === "[object Function]";
        }
    };
    
    module.exports = Util;
});