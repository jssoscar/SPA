/**
 * Author       jssoscar
 * Date         2015-12-16 10:34:36
 * Version      1.0
 * Description  SPA event center
 */

define(function(){
    /**
     * SPA event model
     */
    var Event = {};
    
    /**
     * On event 
     * @param {String} type : event type
     * @param {Object} callback : callback
     */
    SPA.on = function(type, callback){
        if(!Event[type]){
            Event[type] = [];
        }
        
        Event[type].push(callback);
    };
    
    /**
     * Trigger event
     *  
     * @param {Object} type : event type
     */
    SPA.trigger = function(type){
        if(Event[type]){
            Event[type].forEach(function(callback){
                callback();
            });
            delete Event[type];
        }
    };
    
    /**
     * Off event 
     * @param {String} type : event type
     * @param {Object} callback : callback
     */
    SPA.off = function(type){
        delete Event[type];
    };
});