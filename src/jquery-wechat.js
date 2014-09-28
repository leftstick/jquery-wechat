/**
 *
 *  A jquery plugin provides handy functions for wechat.
 *
 *  @author  Howard.Zuo
 *  @data    Sep 27th, 2014
 *  @require jQuery 1.7+
 *
 **/
(function(window, document, $) {
    'use strict';
    var $doc = $(document);
    var promise;
    var bridge;
    var _options = {};

    var defaults = {
        'appid': '',
        'img_url': '',
        'img_width': '60',
        'img_height': '60',
        'link': function() {
            return window.location.toString();
        },
        'desc': function() {
            var $desc = $('head meta[name="description"]');
            return $desc.length > 0 ? $desc.attr('content') : '';
        },
        'title': function() {
            return document.title;
        },
        'callback': function(response) {
            //do nothing
        }
    };

    var validate = function() {
        if (typeof promise === 'undefined') {
            alert('You have to enable wechat first');
            throw new Error('You have to enable wechat first');
        }
    };

    var isFunction = function(obj) {
        return typeof obj === 'function';
    };

    var getValue = function(opts, key) {

        return isFunction(opts[key]) ? opts[key]() : opts[key];
    };


    var shareFriend = function(opts) {
        validate();

        bridge.invoke('sendAppMessage', {
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
        validate();

        bridge.invoke('shareTimeline', {
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

    var shareWeibo = function(opts) {
        validate();

        bridge.invoke('shareWeibo', {
            'content': getValue(opts, 'desc'),
            'url': getValue(opts, 'link'),
        }, function(res) {
                opts.callback(res.err_msg);
            });

    };

    $.wechat = {
        enable: function() {
            if (promise) {
                console.warn('wechat already enabled');
                return promise;
            }
            var deferred = $.Deferred();
            promise = deferred.promise();

            $doc.on('WeixinJSBridgeReady', function() {
                bridge = window.WeixinJSBridge;

                bridge.on('menu:share:appmessage', function() {
                    shareFriend($.extend(false, {}, defaults, _options));
                });

                bridge.on('menu:share:timeline', function() {
                    shareMoment($.extend(false, {}, defaults, _options));
                });

                bridge.on('menu:share:weibo', function() {
                    shareWeibo($.extend(false, {}, defaults, _options));
                });

                deferred.resolve();
            });

            return promise;
        },
        destroy: function() {
            $doc.off('WeixinJSBridgeReady');
        },
        toggleMenu: function(toShow) {
            validate();
            promise.done(function() {
                bridge.call(toShow ? 'showOptionMenu' : 'hideOptionMenu');
            });
        },
        showMenu: function() {
            this.toggleMenu(true);
        },
        hideMenu: function() {
            this.toggleMenu(false);
        },
        toggleToolbar: function(toShow) {
            validate();
            promise.done(function() {
                bridge.call(toShow ? 'showToolbar' : 'hideToolbar');
            });
        },
        showToolbar: function() {
            this.toggleToolbar(true);
        },
        hideToolbar: function() {
            this.toggleToolbar(false);
        },
        getNetworkType: function() {
            var deferred = $.Deferred();
            promise.done(function() {
                bridge.call('getNetworkType', {}, function(e) {
                    deferred.resolve(e.err_msg);
                });
            });
            return deferred.promise();
        },
        closeWindow: function() {
            var deferred = $.Deferred();
            promise.done(function() {
                bridge.call('closeWindow', {}, function(e) {
                    if (e.err_msg === 'close_window:ok') {
                        deferred.resolve();
                        return;
                    }
                    if (e.err_msg === 'close_window:error') {
                        deferred.reject();
                        return;
                    }
                });
            });
            return deferred.promise();
        },
        setShareOption: function(options) {
            _options = options;
        }
    };



}(window, document, jQuery));