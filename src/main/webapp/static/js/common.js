var rootPath = "http://127.0.0.1:8000/";

// var EZUI = {};
(function (window, document, $, undefined) {
    EZUI = function () {

    };
    //定义变量
    var _EZUI = window.EZUI;
    window.EZUI = EZUI;
    $.extend({
        ezui: EZUI
    });
    EZUI.getScript = function (url) {
        return jQuery.ajax({
            url: url,
            type: "get",
            async: false,
            dataType: "script"
        });
    }
})(window, document, window.jQuery);

+function (ez, $, window) {
    'use strict';
    var jQuery = $;
    var cloud = function () {

    }

    cloud.AJAX = function (url, method, data, successCallback, failureCallback, options) {
        options = options || {};
        if (cloud.isKickout == 1) {
            return
        }
        jQuery.support.cors = true;//ie9下报错跨域请求
        $.ajax({
            type: method,
            url: url,//.indexOf("http://")==0?url:FlexCloud.PATH + url,
            data: data,
            //dataType: "json",
            async: options.async ? options.async : false,
            cache: options.cache ? options.cache : false,
            traditional: options.traditional ? options.traditional : false,
            beforeSend: function (request) {
                if (EZUI.common.getToken() !== null && EZUI.common.getToken() != '') {
                    request.setRequestHeader("Authorization", "Bearer " + EZUI.common.getToken());
                }
            },
            success: function (result) {
                if (cloud.KICKOUT(result)) {
                    cloud.isKickout = 1;
                    if ($.i18n) {
                        var loggedOtherMsg = EZUI.i18n.getRes("oa.pub.logged.other", "您的账号已在其他客户端登录！");
                        var title = EZUI.i18n.getRes("oa.pub.tips", "提示");
                        var btn = EZUI.i18n.getRes("oa.pub.ok", "确定");
                    } else {
                        var loggedOtherMsg = "您的账号已在其他客户端登录！";
                        var title = "提示";
                        var btn = "确定";
                    }
                    window.localStorage.clear();
                    window.sessionStorage.clear();

                    layer.confirm(loggedOtherMsg, {
                        title: title,
                        btn: [btn],
                        cancel: function (index, layero) {
                            loginOut();
                        }
                    }, function (index) {
                        loginOut();
                    })
                    return
                };
                if (cloud.Code401(result)) {
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                    loginOut();
                    return
                };
                if (successCallback) {
                    successCallback(result);
                }
            },
            error: function (result) {
                if (failureCallback) {
                    failureCallback(result);
                }
            },
            complete: function (request) {
                if (options.complete) {
                    options.complete(request);
                }
            }
        });
    };
    cloud.GET = function (url, data, successCallback, failureCallback, options) {
        cloud.AJAX(url, "GET", data, successCallback, failureCallback, options);
    }
    cloud.POST = function (url, data, successCallback, failureCallback, options) {
        cloud.AJAX(url, "POST", data, successCallback, failureCallback, options);
    }
    cloud.KICKOUT = function (result) {
        if (result.code == "-501") {
            return true;
        }
        return false;
    }
    cloud.Code401 = function (result) {
        if (result.code == "401") {
            return true;
        }
        return false;
    }
    //动态加载JS文件
    cloud.getScript = function (src, callback, dom) {
        if ($('[src="' + src + '"]').length < 1) {
            var script = document.createElement("script");
            script.type = "text/javaScript";
            if (script.readyState) {//IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback && callback();
                    }
                };
            } else {
                script.onload = function () {
                    callback && callback();
                };
            }
            script.src = src;
            if (dom) {
                dom.appendChild(script);
            } else {
                document.head.appendChild(script);
            }
        } else {
            callback && callback();
        }
    }

    //动态加载css样式文件
    cloud.getLinkStyle = function (href, dom) {
        if ($('[href="' + href + '"]').length < 1) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = href;
            if (dom) {
                dom.appendChild(link);
            } else {
                document.head.appendChild(link);
            }
        }
    }

    //封装Ajax请求 加token
    cloud.ajaxOperate = function (url, successCallback, failurlCallback) {
        if (typeof url == 'string') {
            $.ajax({
                type: "GET",
                url: url,
                data: {},
                dataType: "json",//html
                cache: false,
                beforeSend: function (request) {
                    if (EZUI.common.getToken() != null && EZUI.common.getToken() != '') {
                        request.setRequestHeader('Authorization', 'Bearer ' + EZUI.common.getToken());
                    }
                },
                success: function (a) {
                    //var $tpl=$("<div></div>").html(a);
                    var msgInfo = a.message;//$tpl.children("div.tb-msg-box").html();
                    var result = a.result;
                    if (result) {

                        if (!successCallback || !successCallback(a)) {
                            if (msgInfo) {
                                EZUI.util.msgbox(msgInfo, result);
                            } else {
                                if ($.i18n) {
                                    var successfullyMsg = EZUI.i18n.getRes("oa.pub.successfully", "操作成功！");
                                } else {
                                    var successfullyMsg = "操作成功！";
                                }
                                EZUI.util.msgbox(successfullyMsg, result);
                            }
                        }
                    } else {
                        if (!failurlCallback || !failurlCallback(a)) {
                            if (msgInfo) {
                                EZUI.util.msgbox(msgInfo, 2);
                            } else {
                                if ($.i18n) {
                                    var failedMsg = EZUI.i18n.getRes("oa.pub.operation.failed", "操作失败！");
                                } else {
                                    var failedMsg = "操作失败！";
                                }
                                EZUI.util.msgbox(failedMsg, 2);
                            }
                        }
                    }

                }
            });
        } else {
            $.ajax(url);
        }
    }

    //封装Ajax请求html
    cloud.ajaxLoad = function (a, b, useSitemesh) {
        var time = "";
        var ezui = EZUI;
        var sendheaders = {};
        if (useSitemesh == undefined || useSitemesh == true) {
            sendheaders = { decorator: "body" };
        }

        $.ajax({
            type: "GET",
            url: a,
            dataType: "html",
            headers: sendheaders,
            beforeSend: function (request) {
                if (EZUI.common.getToken() != null && EZUI.common.getToken() != '') {
                    request.setRequestHeader('Authorization', 'Bearer ' + EZUI.common.getToken());
                };
            },
            success: function (a) {
                if (time) clearTimeout(time);
                //$(lastContent).detach();
                //清除参数
                EZUI.common.clearModalParams(b);
                var params = {};
                var urlsplit = a.split("?");
                if (urlsplit && urlsplit.length > 1) {//存在参数
                    var param = urlsplit[1];
                    var paramArray = param.split("&");
                    if (paramArray && paramArray.length > 0) {
                        for (var i = 0; i < paramArray.length; i++) {
                            var p = paramArray[i].split("=");
                            if (p && p.length > 1) {
                                params[p[0]] = p[1];
                            }
                        }
                    }
                    //存入参数
                    EZUI.common.setModalParams(params, b);
                }
                var lastContent = b.html(a);
                lastContent.ready(function () {
                    $.ezui.init(b);
                });
            },

            error: function (a) {
                if (time) clearTimeout(time);
                if (a.responseText) {
                    b.html(a.responseText);
                } else {
                    b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>');
                }
            },
            cache: false
        })
    }

    ez.cloud = cloud;

}(window.EZUI, window.jQuery, window);


+function (ez, $, window) {
    'use strict';
    var jQuery = $;
    var common = function () {

    }
    ez.common = common;

    //从缓存中取出国际化开关
    var i18nEnable = localStorage.getItem("i18nEnable");
    if (!i18nEnable || i18nEnable == "") {
        i18nEnable = "0";
    }
    //从缓存中取出国际化语言
    var language = localStorage.getItem("language");
    var commonParams = {
        "i18NWorkStatus": "",
        "i18nEnable": i18nEnable,
        "language": language
    };
    $.extend(ez.common, commonParams);

    //获取ContextPath
    common.getContextPath = function () {
        var ContextPath = rootPath;
        return ContextPath;
    }

    //获取请求参数
    common.getUrlParamValue = function (parm, jspath) {
        if (!parm) return "";
        if (!jspath) {
            jspath = window.location.href;
        }
        var reg = new RegExp("(^|&)" + parm + "=([^&]*)(&|$)");
        var r = jspath.substr(1).match(reg);
        if (r) {
            return decodeURIComponent(r[2]);
        } else {
            var nr = jspath.split("?" + parm + "=");
            if (nr.length > 1) {
                var nrValue = nr[1].split("&");
                if (nrValue) {
                    return decodeURIComponent(nrValue[0]);
                }
            }
        }
        return "";
    }
    //jq选择器非法字符$转义
    common.replaceDollar = function (str){
        if(str && str.indexOf('$')!=-1) {
            return str.replace(/\$/g, '\\$');
        }
        return str;
    }

    //获取js路径
    common.getJsPath = function (jsname) {
        var js = document.scripts;
        var jsPath = "";
        for (var i = js.length; i > 0; i--) {
            if (js[i - 1].src.indexOf(jsname) > -1) {
                return js[i - 1].src;
            }
        }
        return jsPath;
    }

    //获取token信息
    common.getToken = function () {
        return "";
        // return $.cookie("token");
    };


}(window.EZUI, window.jQuery, window);