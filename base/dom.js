/**
 * Author       jssoscar
 * Date         2015-11-27 18:00:55
 * Version      1.0
 * Description  SPA DOM Util
 */

define(function(require, exports, module){
    
    var doc = document;
    
    /**
     * DOM Util
     * 
     * id : get by id
     * 
     * query : query selector
     *      @param {Object} selector : selector
     *      @param {Object} parent : context parent
     * 
     * queryAll : query All
     *      @param {Object} selector : selector
     *      @param {Object} parent : context parent
     * 
     * show : show element
     *      @param {Object} selector : selector
     * 
     * hide : hide element
     *      @param {Object} selector : selector
     * 
     * append : append child
     *      @param {Object} parent : parent
     *      @param {Object} child : child
     * 
     * html : get innerHTML or update innerHTML
     *      @param {Object} selector : selector
     *      @param {String} html : html
     * 
     * closest : find closest tag
     *      @param {Object} element : element
     *      @param {String} tag : tag name
     * 
     * addClass : add class
     *      @param {Object} selector : selector
     *      @param {String} className : className
     * 
     * removeClass : remove class
     *      @param {Object} selector : selector
     *      @param {String} className : className
     */
    var DOM = {
        id : function(id) {
            return doc.getElementById(id);
        },
        query : function(selector, parent) {
            return (parent || doc).querySelector(selector);
        },
        queryAll : function(selector, parent){
            return (parent || doc).querySelectorAll(selector);
        },
        show : function(selector){
            selector.style.display = "block";
            return this;
        },
        hide : function(selector){
            selector.style.display = "none";
            return this;
        },
        attr : function(selector, attr, value){
            if(value === undefined){
                return selector.getAttribute(attr);
            }else{
                selector.setAttribute(attr, value);
            }
            return this;
        },
        append : function(parent, child){
            parent.appendChild(child);
            return this;
        },
        html : function(selector, html){
            if(html === undefined){
                return selector.innerHTML;
            }else{
                selector.innerHTML = html;
            }
            return this;
        },
        closest : function(element, tag){
            // argument error
            if(!element || !tag){
                throw Error("Miss argument!");
            }
            
            // tag
            tag = tag.toUpperCase();
            
            // current element
            if(element.tagName === tag){
                return element;
            }
            
            // whether is body
            if(element === document.body){
                return null;
            }
            
            // find parent
            var parent = element.parentElement;
            
            while (parent !== document.body && parent){
                if(parent.tagName === tag){
                    return parent;
                }
                parent = parent.parentElement;
            }
            
            // no match tag
            return null;
        },
        addClass : function(selector, className){
            if(selector){
                className.split(" ").forEach(function(item){
                    selector.classList.add(item);
                });
            }
            return this;
        },
        removeClass : function(selector, className){
            if(selector){
                className.split(" ").forEach(function(item){
                    selector.classList.remove(item);
                });
            }
            return this;
        }
    };
    
    module.exports = DOM;
});
