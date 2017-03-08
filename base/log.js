/**
 * Author       jssoscar
 * Date         2015-11-30 14:54:18
 * Version      1.0
 * Description  SPA Log 
 */

define(function(require, exports, module){
    
    /**
     * Log types 
     */
    var LOG_TYPES = {
        LOG : "log",
        INFO : "info",
        ERROR : "error",
        WARN : "warn"
    };
    
    /**
     * Define log
     *  
     * @param {Object} type : log type
     * @param {Object} desc : log content
     */
    function log(type, desc){
        type && (type = type.toUpperCase());
        type = LOG_TYPES[type] || LOG_TYPES.LOG;
        console[type](desc);
    }
    
    /**
     * Log Model
     * 
     * log : console.log
     * 
     * info : console.info
     * 
     * error : console.error
     * 
     * warn : console.warn
     */
    var Log = {
        log : function(desc){
            log(LOG_TYPES.Log, desc);
        },
        info : function(desc){
            log(LOG_TYPES.INFO, desc);
        },
        error : function(desc){
            log(LOG_TYPES.ERROR, desc);
        },
        warn : function(desc){
            log(LOG_TYPES.WARN, desc);
        }
    };
    
    module.exports = Log;
});
