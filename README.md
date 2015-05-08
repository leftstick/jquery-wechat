# jquery-wechat ![](./docs/img/wechat.png)  ![](http://img.shields.io/badge/bower_module-v2.0.0-green.svg?style) #

=============

> This plugin is deprecated since wechat-team introduced a brand new way to achieve those functionalities. See [微信JS-SDK说明文档](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)

A jquery plugin which provides handy functions for `wechat`.

As we know, `wechat` is absolutely a successful mobile app in business. But as a developer, i would say, the documentation is worst that i've ever seen in the popular apps.

The purpose i wrote this plugin, is helping others to handle common cases without `baidu` for a whole day.

And this plugin was implemented in jQuery's [promise][promise-url] mechanism, so that, developers don't care about the different `callback` in `wechat` API.

## Requirement ##

- [jquery](http://jquery.com/) (1.7+)

## Install ##

```powershell
bower install --save jquery-wechat
```

## Usage ##

```html
<script type="text/javascript" src="jquery-wechat.js"></script>
```

> Be sure add above `script` after `jQuery` loaded.

```JavaScript
$.wechat.enable();
$.wechat.hideMenu();
```

## Documentation ##

[API](./docs/API.md)


[promise-url]: http://api.jquery.com/Types/#Promise

## LICENSE ##

[MIT License](https://raw.githubusercontent.com/leftstick/jquery-wechat/master/LICENSE)
