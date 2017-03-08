/**
 * Author       jssoscar
 * Date         2015-11-27 18:00:55
 * Version      1.0
 * Description  SPA framework
 */

define(function(require, exports, module){
    var Log = require("./log");
    var Util = require("./util");
    var DOM = require("./dom");
    var Updater = require("./updater");
    var Module = require("./module");
    
    /**
     * Default config for the SPA
     * 
     * selector : selector to be monitored
     * 
     * container : container for SPA main view
     * 
     * attribute : SPA element attribute
     * 
     * tab : tab support
     *      tabable : tabable
     *      tabSign : tab sign
     *      tabKey : tab key
     * 
     * events : events for the SPA
     *      load : start load template
     *      rendered : rendered template
     *      leave : leave
     *      error : load template error
     *      iframeerror : iframe error
     * 
     * defaultController : default controller for the root view
     * 
     * ignoreSameUrl : ignore same url
     * 
     * controllerRoot : controller root
     * 
     * controllerName : controller file name
     * 
     * main : the main method for the controller
     * 
     * effectClass : effect class
     * 
     * iframe : iframe config
     *      iframeable : whether support iframe or not,
            container : iframe view container,
            iframeSign : iframeSign
     */
    var Config = {
        selector : "a",
        container : DOM.query("body"),
        attribute : "data-spa",
        tab : {
            tabable : true,
            tabSign : "data-spa-tab",
            tabKey : "spaTab"
        },
        events : {
            "load" : function(){
                Log.log("load event!");
            },
            "rendered" : function(){
                Log.log("rendered event!");
            },
            "leave" : function(){
                Log.log("leave event!");
            },
            "error" : function(){
                Log.error("load error!");
            },
            "iframeerror" : function(){
                Log.error("iframe load error event!");
            }
        },
        defaultController : "",
        ignoreSameUrl : true,
        controllerRoot : "",
        controllerName : "init",
        main : "",
        effectClass : "",
        iframe : {
            iframeable : false,
            container : DOM.id("iframe"),
            iframeSign : "/iframe/"
        }
    };
    
    /**
     * Leave controller 
     * 
     * leave : on page leave
     */
    var Leave = {
        leave : function(){
            // remove class
            Config.effectClass && DOM.removeClass(Config.container, Config.effectClass);
            
            // project leave event
            SPAFramework.trigger("leave");
            
            // Single page leave event
            SPA.trigger("leave");
            
            // remove tab event handler
            Config.tab.tabable && SPA.off("tab:change");
            
            // scroll top
            Config.container.scrollTop = 0;
            Config.container.parentNode.scrollTop = 0;
        }
    };
    
    /**
     * Event Handler for the SPA
     * 
     * hashChange : hashchange event handler
     * 
     * click : click event handler for the Config.selector
     *      @param {Object} event : event object
     * 
     * bind : bind event for the window
     */
    var Event = {
        hashChange : function(){
            // browser forward or back
            if(!Handler.forwardOrBack){
                return;
            }
            
            var hash = location.hash;
            
            // start leave
            Leave.leave();
            
            // has hash
            if(hash.length > 1){
                Handler.goTo(Util.getRequest(hash));
            }else{
                Config.defaultController && Handler.goTo({
                   module : Config.defaultController
                });
            }
        },
        click : function(event){
            var target = DOM.closest(event.target, Config.selector);
            
            /**
             * Whether the target or parent is the Config.selector
             */
            if (target) {
                var url = DOM.attr(target, "href");
                
                // ignore attribute
                if(!url || (url.length === 1 && url === "#")){
                    event.preventDefault();
                    return;
                }
                
                Router.updateParameter(target, event);
            }
        },
        bind : function() {
            // hashchange event listener
            window.addEventListener("hashchange", this.hashChange, false);
            
            // click event listener
            window.addEventListener("click", this.click, false);
            
            // iframe event handler
            if(Config.iframe.iframeable){
                // load
                Config.iframe.container.onload = function(){
                    try{
                        var title = this.contentDocument.title;
                        /**
                         * iframe not support onerror event
                         * 
                         * So,here,use title to judge whether page load success.
                         * 
                         * But: If page load success, this page really not have title, How deal this?
                         */
                        if(!title){
                            SPAFramework.trigger("iframeerror", {
                                msg : "iframe load error!"
                            });
                            return;
                        }
                        document.title = title;
                    }catch(error){
                        // cross domain, do nothing
                    }
                    
                    SPAFramework.trigger("rendered");
                };
            }
        }     
    };
    
    /**
     * Router
     * 
     * updateParameter : update parameter
     *      @param {Object} target : target element
     *      @param {Object} event : event 
     * 
     * updateModule : update module
     *      @param {Object} target : target element
     *      @param {Object} event : event 
     */
    var Router = {
        updateParameter : function(target, event){
            var tab = Config.tab,
                spaTab = DOM.attr(target, tab.tabSign);
            
            // tabable and attribute is not null
            if(tab.tabable && spaTab){
                // prevent default
                event.preventDefault();
                
                // click event
                Handler.forwardOrBack = false;
                
                // update parameter
                Util.updateParameter({
                    key : tab.tabKey,
                    value : spaTab
                }, function(){
                    setTimeout(function(){
                        Handler.forwardOrBack = true;
                    }, 0); // why setTimeout ? If not, will trigger hashchange event
                });
                return;
            }
            
            // update module
            this.updateModule(target, event);
        },
        updateModule : function(target, event){
            var url = DOM.attr(target, "href");
            
            if(url.indexOf("javascript") !== -1){
                return;
            }
            
            if(DOM.attr(target, Config.attribute) === "true"){
                // deal with hash
                if(url.charAt(0) !== "#"){
                    url = "#" + url;
                }
                
                // ignore same url
                if(Config.ignoreSameUrl && location.hash === url){
                    event.preventDefault();
                    return;
                }
                
                // prevent default
                event.preventDefault();
                
                // start leave
                Leave.leave();
                
                // go to module
                Handler.forwardOrBack = false;
                Handler.goTo(Util.getRequest(url));
            }
        }
    };
    
    /**
     * SPA Handler
     * 
     * forwardOrBack : forward or back for the browser
     * 
     * render : render template
     *      @param {String} template : template
     * 
     * goTo : go to module
     *      @param {Object} request : request
     *          @param {String} hash : hash
     *          @param {String} module : template module
     */
    var Handler = {
        forwardOrBack : false,
        render : function(template){
            var method = Config.append ? "append" : "html";
            DOM.html(Config.container, template);
            return this;
        },
        goTo : function(request){
            var _this = this;
            
            // start request
            SPAFramework.trigger("load");
            
            /**
             * require controller by module 
             */
            setTimeout(function(){
                var iframe = Config.iframe;

                if(iframe.iframeable && Util.startsWith(request.module, "#" + iframe.iframeSign)){
                    var path = request.module.replace("#" +iframe.iframeSign, "");
                    if(!Util.startsWith(path, "http")){
                        path = "/" + path;
                    }
                    
                    // hide SPA content && hide container
                    DOM.html(Config.container, "").hide(Config.container);
                    
                    // change hash
                    if(!_this.forwardOrBack){
                        // has hash or not
                        request.hash && (location.hash = request.hash);
                        setTimeout(function(){
                            _this.forwardOrBack = true;
                        }, 0);
                    }
                    
                    // update iframe src && show iframe
                    DOM.attr(iframe.container, "src", path).show(iframe.container);
                }
                else{
                    // hide iframe
                    iframe.iframeable && DOM.hide(iframe.container);
                    
                    var moduleController = Util.getController(request.module, Config);
                    
                    // start load
                    require([moduleController], function(controller){
                        // change hash
                        if(!_this.forwardOrBack){
                            /**
                             * whether has hash or not
                             * If hash is undefined, current controller is default controller
                             */
                            request.hash && (location.hash = request.hash);
                            
                            /**
                             * Why setTimeout ? If not, will trigger hashchange event 
                             */
                            setTimeout(function(){
                                _this.forwardOrBack = true;
                                
                                // callback
                                request.callback && request.callback();
                            }, 0);
                        }
                        
                        // run
                        try{
                            if(Util.isFunction(controller)){
                                controller();
                                SPAFramework.trigger("rendered");
                            }else if(controller[Config.main]){
                                // Not function
                                if(!Util.isFunction(controller[Config.main])){
                                    SPAFramework.trigger("error", {
                                        msg : "Please confirm " + moduleController + " attribute '" + Config.main + "' is a function!"
                                    });
                                    return;
                                }
                                
                                // run controller
                                controller[Config.main]();
                                SPAFramework.trigger("rendered");
                            }else{
                                SPAFramework.trigger("error", {
                                    msg : "No Export.Please define module.exports!"
                                });
                                Log.error("No Export.Please define module.exports!");
                            }
                        }catch(error){
                            SPAFramework.trigger("error", {
                                msg : "Code error!",
                                error : error
                            });
                            Log.error(error);
                        }
                    }, function(error){
                        // error
                        SPAFramework.trigger("error", {
                            msg : moduleController + " load error!",
                            error : error
                        });
                        Log.error(error);
                    });
                }
            }, 0);
        }
    };
    
    /**
     * SPA framework
     * 
     * events : events 
     * 
     * start : start render page
     * 
     * jump : According current hash, jump to module
     * 
     * on : event handler
     *      @param {String} type : event type
     *      @param {Function} callback : callback
     * 
     * trigger : trigger event
     *      @param {String} type : event type
     *      @param {Object} arg : arg
     * 
     */
    var SPAFramework = {
        events : {},
        start : function(){
            var _this = this;
            // load default controller
            if (Config.defaultController) {
                Handler.goTo({
                    module : Config.defaultController,
                    callback : function() {
                        _this.jump();
                    }
                });
                return;
            }
            
            // jump
            _this.jump();
        },
        jump : function(){
            var hash = location.hash;
            
            // has hash
            if(hash.length > 1){
                Handler.forwardOrBack = false;
                Handler.goTo(Util.getRequest(hash));
            }
        },
        on : function(type, callback){
            this.events[type] = this.events[type] || [];
            this.events[type].push(callback);
        },
        trigger : function(type, arg){
            var events = this.events[type];
            events && events.forEach(function(callback){
                callback(arg);
            });
        }
    };
    
    /**
     * Exports
     */
    module.exports = function(options){
        // extend config
        Util.extend(Config, options);
        
        // init updater
        Updater(Config);
        
        // init module
        Module({
            iframeable : Config.iframe.iframeable,
            iframeSign : Config.iframe.iframeSign
        });
        
        // Config events
        if(Config.events){
            for(var key in Config.events){
                SPAFramework.on(key, Config.events[key]);
            }
        }
        
        // Bind Event
        Event.bind();
        
        // Start SPA
        SPAFramework.start();
    };
});
