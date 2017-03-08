/**
 * Author       jssoscar
 * Date         2015-12-1 18:18:02
 * Version      1.0
 * Description  SPA module
 */

define(["./reg","./util"], function(Reg, Util){
    /**
     * Get current module
     */
    return function(options){
        SPA.getModule = function(){
            var hash = location.hash,
                module = "";
            
            // if(hash.length > 1){
                // var module = hash.match(Reg.hash)[0];
                // if(options.iframeable && Util.startsWith(module, options.iframeSign)){
                    // module = module.replace(options.iframeSign, "");
                // }else{
                    // module = module.substr(1);
                // }
            // }
            
            if(hash.length > 1){
                module = hash.match(Reg.hash)[0];
            }
            
            return module;
        };
    };
});