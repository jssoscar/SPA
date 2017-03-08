/**
 * Author       jssoscar
 * Date         2015-12-1 18:18:02
 * Version      1.0
 * Description  SPA updater
 */

define(["./dom"], function(DOM){
    return function(config){
        // SPA updater
        SPA.update = function(template, title){
            if($){
                var container = $(config.container);
                container.html(template).show();
                
                // animate class
                config.effectClass && container.addClass(config.effectClass);
            }else{
                // update content
                DOM.html(config.container, template);
                
                // show content
                DOM.show(config.container);
                
                // add class
                DOM.addClass(config.container, config.effectClass);
            }
            
            // update title
            document.title = title || "SPA Index";
        };
    };
});