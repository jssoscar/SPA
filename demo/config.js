/**
 * Author       jssoscar
 * Date         2016-10-12 16:22:27
 * Version      1.0
 * Description  Stargate project config
 * Note
 */

window.SPA = SPA || {};

/**
 * 初始化SPA
 */
require(["/base/spa", "/common/core/loading/loading"], function(MySPA, Loading){
    // loading
    var LoadingEffect,
        initLoading = function(show){
            if(show){
                if(!LoadingEffect){
                    LoadingEffect = Loading({
                        "container" : $("#spa-container")
                    });
                }
                LoadingEffect.show();
            }else{
                LoadingEffect && LoadingEffect.hide();
            }
        },
        showLoadError = function(error){
            Stargate.update([
                '<div class="error-content">',
                    '<h1>运行出错了！</h1>',
                    '<p>错误信息：' + (error.msg || "未知的错误信息") + '</p><br/>',
                    '<p>Error对象：' + JSON.stringify(error.error || {}) + '</p><br/>',
                    '<p>更多错误信息，F12查看/反馈浏览器console调用错误栈</p><br/>',
                '</div>'
            ].join(""), "运行出错");
        };

    // 初始化SPA
    MySPA({
        container : document.getElementById("spa-content"), // SPA主内容区域
        attribute : "data-spa", // 需要SPA截获的元素属性，eg：<a href="#/driverList" data-spa="true">我是SPA</a>
        events : {
            load : function(){ // 加载事件
                initLoading(true);
            },
            rendered : function(){ // 已渲染事件
                initLoading();
            },
            leave : function(){ // 离开事件
                initLoading();
                
                bootbox.hideAll();
                $('.modal-backdrop').remove();
                $("#fe_msg").html("");
            },
            error : function(error){ // controller加载失败
                initLoading();
                showLoadError(error);
            },
            iframeerror : function(){ // iframe加载失败
                initLoading();
                showLoadError({
                    msg : "iframe加载失败！可能的原因：<p>①、页面不存在(F12-console中出现404错误)；</p><p>②、iframe页面未设置标题（如果未设置标题，触发error事件）；</p><p>③、没有权限操作或没有将该链接加入到权限点，请联系系统管理员！</p>"
                });
            }
        },
        defaultController : "index", // 默认视图
        controllerRoot : "js", // controller入口
        controllerName : "init", // controller默认名字
        main : "init", // controller默认执行的方法，即：module.exports
        iframe : { // iframe配置
            iframeable : true,  // 开启iframe
            iframeSign : "/iframe/", // iframe标识
            container : document.getElementById("spa-iframe") // iframe主内容区域
        },
        tab : { // 路由tab配置
            tabable : true, // 启用路由tab
            tabSign : "data-spa-tab", // tab获取文件的入口
            tabKey : "spaTab" // 路由tab参数名
        }
    });
});