(function($) {
    'use strict';

    $.wechat.enable();

    var isMenuShown = true;
    var isToolbarShown = true;
    var isChanged = false;

    var toggle = function(element, isShown, method) {
        var $on = element.find('.on');
        var $off = element.find('.off');
        if (isShown) {
            $.wechat['hide' + method]();
            $on.removeClass('am-btn-primary').addClass('am-btn-default');
            $off.removeClass('am-btn-default').addClass('am-btn-primary');
        } else {
            $.wechat['show' + method]();
            $on.removeClass('am-btn-default').addClass('am-btn-primary');
            $off.removeClass('am-btn-primary').addClass('am-btn-default');
        }
    };

    $('#menu').on('click', function() {
        toggle($(this), isMenuShown, 'Menu');
        isMenuShown = !isMenuShown;
    });

    $('#toolbar').on('click', function() {
        toggle($(this), isToolbarShown, 'Toolbar');
        isToolbarShown = !isToolbarShown;
    });


    $('#share').on('click', function() {
        if (isChanged) {
            $.wechat.setShareOption({});
            $(this).removeClass('am-btn-primary').addClass('am-btn-default');
        } else {
            $.wechat.setShareOption({
                img_url: window.location.toString() + 'img/demo.jpg',
                callback: function(response) {
                    alert(response);
                }
            });
            $(this).removeClass('am-btn-default').addClass('am-btn-primary');
        }
        isChanged = !isChanged;
    });

    $('#close').on('click', function() {
        $.wechat.closeWindow();
    });

    $.wechat.getNetworkType().done(function(response) {
        $('#network').text(response.split(':')[1]);
    });

}(jQuery));