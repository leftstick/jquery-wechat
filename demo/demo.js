(function($) {
    'use strict';

    var toggleUI = function(disabled) {
        $('#menu button').prop('disabled', disabled);
        $('#toolbar button').prop('disabled', disabled);
        $('#scan').prop('disabled', disabled);
        $('#preview').prop('disabled', disabled);
        $('#share button').prop('disabled', disabled);
        $('#close').prop('disabled', disabled);
    };

    toggleUI(true);

    $.wechat.enable().fail(function() {
        $('body').addClass('modal-active');
    }).done(function() {
        toggleUI(false);
        bind();
    });

    $('#modal').on('click', function() {
        $('body').removeClass('modal-active');
    });

    var isEnabled = true;
    var isMenuShown = true;
    var isToolbarShown = true;
    var isReset = true;

    var toggle = function(element, isShown, onmethod, offmethod) {
        var $on = element.find('.on');
        var $off = element.find('.off');
        if (isShown) {
            $.wechat[offmethod]().done(function() {
                alert('hide');
            });
            $on.removeClass('am-btn-primary').addClass('am-btn-default');
            $off.removeClass('am-btn-default').addClass('am-btn-primary');
        } else {
            $.wechat[onmethod]();
            $on.removeClass('am-btn-default').addClass('am-btn-primary');
            $off.removeClass('am-btn-primary').addClass('am-btn-default');
        }
    };

    var bind = function() {
        $('#menu').on('click', function() {
            toggle($(this), isMenuShown, 'showMenu', 'hideMenu');
            isMenuShown = !isMenuShown;
        });

        $('#toolbar').on('click', function() {
            toggle($(this), isToolbarShown, 'showToolbar', 'hideToolbar');
            isToolbarShown = !isToolbarShown;
        });

        $('#scan').on('click', function() {
            $.wechat.scanQRcode();
        });

        $('#preview').on('click', function() {
            $.wechat.preview({
                current: window.location.toString() + 'img/pic001.jpg',
                urls: [
                    window.location.toString() + 'img/pic001.jpg',
                    window.location.toString() + 'img/pic002.jpg',
                    window.location.toString() + 'img/pic003.jpg',
                    window.location.toString() + 'img/pic004.jpg',
                    window.location.toString() + 'img/pic005.jpg',
                    window.location.toString() + 'img/pic006.jpg'
                ]
            });
        });

        $('#share').on('click', function() {
            var element = $(this);
            var $on = element.find('.on');
            var $off = element.find('.off');
            if (isReset) {
                $.wechat.setShareOption({
                    img_url: window.location.toString() + 'img/demo.jpg',
                    desc: 'The description is set from $.wechat.setShareOption',
                    callback: function(response) {
                        alert(response);
                    }
                });
                $on.removeClass('am-btn-primary').addClass('am-btn-default');
                $off.removeClass('am-btn-default').addClass('am-btn-primary');
            } else {
                $.wechat.resetShareOption();
                $on.removeClass('am-btn-default').addClass('am-btn-primary');
                $off.removeClass('am-btn-primary').addClass('am-btn-default');
            }
            isReset = !isReset;
        });

        $('#close').on('click', function() {
            $.wechat.closeWindow();
        });
    };

    var unbind = function() {
        $('#menu').off('click');
        $('#toolbar').off('click');
        $('#scan').off('click');
        $('#preview').off('click');
        $('#share').off('click');
        $('#close').off('click');
    };

    $('#destroy').on('click', function() {
        var element = $(this);
        var $on = element.find('.enable');
        var $off = element.find('.destroy');
        if (isEnabled) {
            $.wechat.destroy().done(function() {
                unbind();
                toggleUI(true);
                $('button.am-btn.off').removeClass('am-btn-primary').addClass('am-btn-default');
                $('button.am-btn.on').removeClass('am-btn-default').addClass('am-btn-primary');
                isMenuShown = true;
                isToolbarShown = true;
                isReset = true;
            });
            $on.removeClass('am-btn-primary').addClass('am-btn-default');
            $off.removeClass('am-btn-default').addClass('am-btn-primary');
        } else {
            $.wechat.enable().done(function() {
                bind();
                toggleUI(false);
            });
            $on.removeClass('am-btn-default').addClass('am-btn-primary');
            $off.removeClass('am-btn-primary').addClass('am-btn-default');
        }
        isEnabled = !isEnabled;
    });

    $.wechat.getNetworkType().done(function(response) {
        $('#network').text(response.split(':')[1]);
    });

}(jQuery));
