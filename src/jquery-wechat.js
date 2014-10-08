/**
 *
 *  A jquery plugin provides handy functions for wechat.
 *
 *  @author  Howard.Zuo
 *  @data    Sep 27th, 2014
 *  @require jQuery 1.7+
 *
 **/
(function(global, document, $) {
    'use strict';

    var _this = {
        options: {}
    };

    var shareFriend = function(opts) {
        _this.bridge.invoke('sendAppMessage', {
            'appid': getValue(opts, 'appid'),
            'img_url': getValue(opts, 'img_url'),
            'img_width': getValue(opts, 'img_width'),
            'img_height': getValue(opts, 'img_height'),
            'link': getValue(opts, 'link'),
            'desc': getValue(opts, 'desc'),
            'title': getValue(opts, 'title')
        }, function(res) {
            opts.callback(res.err_msg);
        });

    };

    var shareMoment = function(opts) {
        _this.bridge.invoke('shareTimeline', {
            'img_url': getValue(opts, 'img_url'),
            'img_width': getValue(opts, 'img_width'),
            'img_height': getValue(opts, 'img_height'),
            'link': getValue(opts, 'link'),
            'desc': getValue(opts, 'title'),
            'title': getValue(opts, 'title') + ' - ' + getValue(opts, 'desc')
        }, function(res) {
            opts.callback(res.err_msg);
        });

    };

    var shareWeibo = function(opts) {
        _this.bridge.invoke('shareWeibo', {
            'content': getValue(opts, 'desc'),
            'url': getValue(opts, 'link'),
        }, function(res) {
            opts.callback(res.err_msg);
        });
    };

    var shareEmail = function(opts) {
        _this.bridge.invoke('sendEmail', {
            'content': getValue(opts, 'desc') || getValue(opts, 'link')
        }, function(res) {
            opts.callback(res.err_msg);
        });
    };

    var immediateActions = {
        network: 'getNetworkType',
        hideToolbar: 'hideToolbar',
        showToolbar: 'showToolbar',
        hideOptionMenu: 'hideOptionMenu',
        showOptionMenu: 'showOptionMenu',
        closeWebView: 'closeWindow', //Close current webview
        scanQRCode: 'scanQRCode', //goto QRcode page
        preview: 'imagePreview' //preview/check image
    };

    var listeners = {
        events: {
            friend: 'menu:share:appmessage',
            moment: 'menu:share:timeline',
            weibo: 'menu:share:weibo',
            email: 'menu:share:email' //share to email
        },
        actions: {
            friend: shareFriend,
            moment: shareMoment,
            weibo: shareWeibo,
            email: shareEmail
        }
    };

    var $doc = $(document);

    var defaultOpts = {
        'appid': '',
        'img_url': '',
        'img_width': '60',
        'img_height': '60',
        'link': function() {
            return global.location.toString();
        },
        'desc': function() {
            var $desc = $('head meta[name="description"]');
            return $desc.length > 0 ? $desc.attr('content') : '';
        },
        'title': function() {
            return document.title;
        },
        'callback': function() {
            //do nothing
        }
    };

    var isFunction = function(obj) {
        return typeof obj === 'function';
    };

    var getValue = function(opts, key) {
        return isFunction(opts[key]) ? opts[key]() : opts[key];
    };

    var weChatBridgeTimeout = function(deferred) {
        return function() {
            if (typeof global.WeixinJSBridge === 'undefined') {
                deferred.reject();
                return;
            }
            _this.bridge = global.WeixinJSBridge;
            $.each(listeners.events, function(key, value) {
                _this.bridge.on(value, function() {
                    if (_this.options.bind) {
                        listeners.actions[key]($.extend(false, {}, defaultOpts, _this.options));
                    } else {
                        listeners.actions[key](defaultOpts);
                    }
                });
            });
            deferred.resolve();
        };

    };

    var wrapperOperation = function(action, data) {
        data = data || {};
        var deferred = $.Deferred();
        var pro = deferred.promise();
        var callTimeout;
        if (typeof _this.promise === 'undefined') {
            global.setTimeout(function() {
                deferred.reject(new Error('You have to enable wechat functionality first'));
            }, 0);
            return pro;
        }

        if (!immediateActions[action]) {
            global.setTimeout(function() {
                deferred.reject(new Error('Wrong action'));
            }, 0);
            return pro;
        }
        _this.promise.done(function() {
            //this is workaround since the callback passed into WeixinJSBridge.call 
            //doesn't work properly
            //such as: toolbar, optionMenu
            callTimeout = global.setTimeout(function() {
                deferred.resolve();
            }, 1000);

            _this.bridge.invoke(immediateActions[action], data, function(e) {
                if (callTimeout) {
                    global.clearTimeout(callTimeout);
                }
                deferred.resolve(e.err_msg);
            });

        });

        return pro;
    };

    $.wechat = {
        enable: function() {
            if (_this.promise) {
                //always expose one instance
                console.warn('wechat already enabled');
                return _this.promise;
            }
            var deferred = $.Deferred();
            _this.promise = deferred.promise();
            //support ios since WeixinJSBridge initialized faster than Android
            if (typeof global.WeixinJSBridge !== 'undefined') {
                global.setTimeout(weChatBridgeTimeout(deferred), 0);
                return _this.promise;
            }
            //a timeout is needed in case the page running on non-weixin browser
            _this.timeoutID = global.setTimeout(weChatBridgeTimeout(deferred), 3000);

            //WeixinJSBridgeReady should be watched since WeixinJSBridge initialized slower on Android
            $doc.on('WeixinJSBridgeReady', function() {
                global.clearTimeout(_this.timeoutID);
                weChatBridgeTimeout(deferred)();
            });

            return _this.promise;
        },
        destroy: function() {
            var deferred = $.Deferred();
            var pro = deferred.promise();
            $.wechat.showMenu();
            $.wechat.showToolbar();
            $.wechat.resetShareOption();
            if (_this.promise) {
                delete _this.promise;
            }
            $doc.off('WeixinJSBridgeReady');
            global.setTimeout(deferred.resolve, 0);
            return pro;
        },
        showMenu: function() {
            return wrapperOperation('showOptionMenu');
        },
        hideMenu: function() {
            return wrapperOperation('hideOptionMenu');
        },
        showToolbar: function() {
            return wrapperOperation('showToolbar');
        },
        hideToolbar: function() {
            return wrapperOperation('hideToolbar');
        },
        getNetworkType: function() {
            return wrapperOperation('network');
        },
        closeWindow: function() {
            return wrapperOperation('closeWebView');
        },
        scanQRcode: function() {
            return wrapperOperation('scanQRCode');
        },
        preview: function(imgData) {
            return wrapperOperation('preview', imgData);
        },
        setShareOption: function(options) {
            if (!options) {
                return;
            }
            _this.options = $.extend(false, {}, options);
            _this.options.bind = true;
        },
        resetShareOption: function() {
            _this.options.bind = false;
        }
    };



}(window, document, jQuery));
