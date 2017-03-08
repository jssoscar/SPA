/**
 * Author       jishengsheng
 * Date         2016-1-4 16:00:57
 * Version      1.0
 * Description  Get requirejs baseUrl config
 */

define(function(require, exports, module){
    var baseUrl;
    var initialized  = false;
    
    SPA.getBaseUrl = function(){
        if(!initialized){
            try{
                /**
                 * Not public API
                 * This is a semi-private API which means it can change over time.
                 * So,use try-catch
                 */
                baseUrl = requirejs.s.contexts._.config.baseUrl;
                
                baseUrl = baseUrl.replace(/(src|prd).*/, "");
            }catch(error){
                try{
                    baseUrl = require.toUrl("./config4baseUrl").replace(/(src|prd).*/, "");
                }catch(error){
                    // TODO
                }
            }finally{
                initialized = true;
            }
        }
        return baseUrl;
    };
});
