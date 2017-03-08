/**
 * Author       jssoscar
 * Date         2016-2-19 14:49:12
 * Version      1.0
 * Description  Current device info
 */

define(function(){
    var isPC = -1;
    var userAgent = navigator.userAgent;
    
    /**
     *  
     */
    function device(){
        if(isPC === -1){
            isPC = !/(ipad|iphone|ipod|android|ios|windows phone)/i.test(userAgent);
        }
        return isPC;
    }
    
    /**
     * PC device 
     */
    SPA.isPC = function(){
        return device();
    };
    
    /**
     * Mobile device 
     */
    SPA.isMobile = function(){
        return !device();
    };
});