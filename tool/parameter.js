/**
 * Author       jssoscar
 * Date         2015-11-27 18:00:55
 * Version      1.0
 * Description  SPA parameter Util
 */

define(function(){
    /**
     * is array 
     * @param {Object} data : data
     */
    function isArray(data){
        return Object.prototype.toString.call(data) === "[object Array]";
    }
    
    /**
     *  get current module request parameter
     */
    SPA.getParameter = function(key){
        var search = location.hash.split("?"),
            request = {};
        
        // has search
        if(search.length > 1){
            search = search[1];
            var args = search.split("&");
            for(var iterator = 0, len = args.length ; iterator < len; iterator++){
                var cur = args[iterator].split("=");
                // multi parameter
                if(request[cur[0]]){
                    if(isArray(request[cur[0]])){ // is array
                        request[cur[0]].push(decodeURIComponent(cur[1]));
                    }else{
                        request[cur[0]] = [request[cur[0]]];
                        request[cur[0]].push(decodeURIComponent(cur[1]));
                    }
                }else{
                    // single parameter
                    request[cur[0]] = decodeURIComponent(cur[1]);
                }
            }
        }
        return typeof key != 'undefined' ? (request && request[key] || '') : request;
    };
});
