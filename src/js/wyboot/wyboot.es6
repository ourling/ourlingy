const GLOBAL_STATIC_URL = "//ourlingy.com/static";//静态资源路径
const GLOBAL_STATIC_API = "//ourlingy.com/data/tp5/api/";//后台资源路径
const GLOBAL_HOME_DOMAIN = ".ourlingy.com";
const GLOBAL_HOME_PATH = "/";
const GLOBAL_QIMIAOWA_VERSION = "v20171012233509";//全局上线版本号，上线时候手工改动
(function (w, d, undefined) {
    /**
     * 定义全局作用域变量WYBOOT
     */
    w.WYBOOT = (function (w, d, undefined) {
        /**
         *是否是IE浏览器
         */
        let isIE = (navigator.userAgent.toLowerCase().indexOf('msie') != -1),
            /**
             * 创建WYBOOT对象的临时变量
             */
            U,
            /**
             * 缓存document.getElementsByTagName
             */
            queryTag = function (tag) {
                return this.getElementsByTagName(tag);
            },
            /**
             * 缓存document.createElement
             */
            createEl = function (tag) {
                return this.createElement(tag);
            },
            /**
             * 是否是服务器模式,WYBOOT可在静态环境和服务器环境运行
             */
            isServer = !(d.domain == ''),
            /**
             * 业务js,就是定义在WYBOOT.js的script节点上的bizjs属性
             */
            bizJs,
            /**
             *业务css,就是定义在WYBOOT.js的script节点上的bizcss属性
             */
            bizCss,
            /**
             * 是否是客户端缓存服务端
             */
            clientCache,
            isLoginPage = "false",

            /*
             * 调试模式,静态模式或者服务器模式下在url后拼接WYBOOT-debug=true即可开启调试模式.
             * 要查看调试信息,请开启浏览器控制台
             */
            _DEBUG = false;
        if (!isServer || w.location.search.indexOf('WYBOOT-debug=true') > 0) {
            _DEBUG = true;
        }

        /**
         * 获取WYBOOT所在的根目录
         * @return {String}
         */
        let getRoot = function () {
            let s = queryTag.call(d, 'script'),
                /**
                 * 某些情况时需要添加例外
                 */
                id = 0;
            let p = s[id].src, sign = "wyboot.js", realpath = "WYBOOT/wyboot.js";
            if (p.lastIndexOf(sign) > 0) {
                bizJs = s[id].getAttribute('bizjs');
                isLoginPage = s[id].getAttribute('isLoginPage');
                bizCss = s[id].getAttribute('bizcss');
                clientCache = s[id].getAttribute('CacheServer');
                return p.replace(realpath, '');
            } else {
                throw '引入的WYBOOT.js的script节点必须放在页面引用的第一个script节点上!';
            }
        };
        let head = queryTag.call(d, 'HEAD').item(0),
            //静态运行时加载js
            local = function (url, func) {
                let s = createEl.call(d, 'script');
                s.language = 'javascript';
                s.type = 'text/javascript';
                s.async = false;
                s['src'] = url;
                s.onload = s.onreadystatechange = function () {
                    let st = this.readyState;
                    if (!st || st == 'loaded' || st == 'complete') {
                        _G.log('finishLoad js file ' + url);
                        s.onload = s.onreadystatechange = null;
                        if (func) {
                            func.delay(10);
                        }
                    }
                };
                head.appendChild(s);
                return s;
            },
            //服务器模式时加载js
            server = function (url, func) {
                let req = ((w.ActiveXObject) ? new ActiveXObject('MsXml2.XmlHttp') : new XMLHttpRequest());
                req.open('get', url, false);
                req.setRequestHeader('Content-Type', 'text/plain;charset=gb2312');
                req.send(null);
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (req.responseText != '') {
                            if (isIE) {
                                execScript(req.responseText);
                            } else {
                                w.eval(req.responseText);
                            }
                            if (func) func();
                        }
                    }
                }
            };
        let G = {
            //版本号
            ver: 'V1.0',
            //全局根目录
            root: getRoot(),
            isLoginPage: isLoginPage,
            //是否是开发模式
            isDev: (typeof jQuery === 'undefined'),
            //是否是服务器端运行
            isServer: isServer,
            //调试开关
            debug: _DEBUG,
            //加载js
            loadJs: function (url, f) {
                (isServer) ? server(url, f) : local(url, f);
                //local(url, f);
            },
            //加载css
            loadCss: function (url) {
                let link = createEl.call(d, 'link');
                link.href = url;
                link.type = 'text/css';
                link.rel = 'stylesheet';
                head.appendChild(link);
            },
            //初始化配置文件
            initCfg: function (cfg) {
                let me = this;
                me.config = cfg;
                if (me.process) {
                    me.process();
                } else {
                    _G.loadCss(_G.root + 'WYBOOT/styles/' + _G.getCfg('style').sys_style + '/WYBOOT_min.css');
                }
                //加载业务js文件
                let bizjs = (bizJs) ? eval(bizJs) : [], url, bizcss = (bizCss) ? eval(bizCss) : [];
                for (i = 0; i < bizjs.length; i++) {
                    url = me.root + bizjs[i];
                    _G.log('add bizjs ' + url, 'WYBOOT');
                    me.loadJs(url);
                }
                for (i = 0; i < bizcss.length; i++) {
                    url = me.root + bizcss[i];
                    _G.log('add bizcss ' + url, 'WYBOOT');
                    me.loadCss(url);
                }
            },
            //获取配置信息
            getCfg: function (name) {
                return this.config[name];
            }
        };
        //实现默认的浅拷贝
        G.mix = function (o) {
            let me = this;
            for (let k in o) {
                if (me[k]) {
                    me.warn('WYBOOT对象已经有属性[' + k + ']!', 'WYBOOT');
                } else {
                    me[k] = o[k];
                }
            }
        };
        G.getParamFromUrl = function (param) {
            let query = window.location.search;
            let v = query.match(new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i"));
            if (v != null) {
                v = unescape(v[2]);
            }
            return v;
        };
        //全局屏蔽一些按键
        G.shielding = function () {
            let s = _G.getCfg('shields');
            $(window).addEvent((Browser.firefox) ? 'keypress' : 'keydown', function (e) {
                let k = e.key, c = e.control, el = $(e.target);
                if ((k == 'f5' || (c && k == 'r')) && s.f5) {
                    e.stop();
                    return false;
                } else if (k == 'backspace' && s.backspace) {
                    let type = el.get('type') || el.get('tag');
                    if (!['button', 'text', 'password', 'textarea', 'submit'].contains(type)) {
                        e.stop();
                        return false;
                    }
                }
            });
            if (s.contextMenu) {
                $(document).oncontextmenu = function (e) {
                    return false;
                }
            }
        };
        //统一处理iframe的初始化以及跳转
        //解决按下backspace或者浏览器回退键会使iframe变为空白的问题
        G.setIfrSrc = function (ifr, src) {
            ifr.src = src;
            ifr.contentWindow.location.replace(src);
            /*//要注意跨域的问题.可能无跨域问题
             Function.attempt(function () {
             }, function () {

             })*/
        };
        return G;
    })(w, d, undefined);
    /**
     * 新增一个别名,减少字符开销
     */
    let _G = w._G = w.WYBOOT = w.WYBOOT,
        /**
         *日志输出级别,为兼容,暂支持4种级别
         */
        mtd = ['log', 'warn', 'error', 'info'];
    /**
     * 隐藏蒙版,框架启动加载完毕之后会调用
     */
    for (let k = 0; k < mtd.length; k++) {
        _G[mtd[k]] = (function (c) {
            return function (msg, src) {
                U_LOG(msg, c, src);
            }
        })(mtd[k]);
    }
    /**
     * 日志输出
     * @param msg 要输出的信息
     * @param cat 级别
     * @param src 信息来源
     */
    function U_LOG(msg, cat, src) {
        if (_G.debug) {
            msg = ((src) ? src : 'SYSTEM') + ': ' + msg;
            if (w['console'] !== undefined && console.log) {
                console[cat && console[cat] ? cat : 'log'](msg);
            }
        }
    }
    _G.loadCss(GLOBAL_STATIC_URL + '/css/common.css?v=' + GLOBAL_QIMIAOWA_VERSION);
    _G.loadCss(GLOBAL_STATIC_URL + '/plugins/css/iview/iview.min.css?v=' + GLOBAL_QIMIAOWA_VERSION);
    _G.loadJs(GLOBAL_STATIC_URL + '/plugins/js/jq/jquery-1.7.2.js?v=' + GLOBAL_QIMIAOWA_VERSION);
    _G.loadJs(GLOBAL_STATIC_URL + '/plugins/js/vue/vue.min.js?v=' + GLOBAL_QIMIAOWA_VERSION);
    _G.loadJs(GLOBAL_STATIC_URL + '/plugins/js/vue/vue-resource.min.js?v=' + GLOBAL_QIMIAOWA_VERSION);
    _G.loadJs(GLOBAL_STATIC_URL + '/plugins/js/vue/vue-router.min.js?v=' + GLOBAL_QIMIAOWA_VERSION);
    _G.loadJs(GLOBAL_STATIC_URL + '/plugins/js/vue/vuex.js?v=' + GLOBAL_QIMIAOWA_VERSION);
    _G.loadJs(GLOBAL_STATIC_URL + '/plugins/js/iview/iview.min.js?v=' + GLOBAL_QIMIAOWA_VERSION);

    _G.process = function () {

    };
    //加载子界面.
    _G.initSubPage = function (ns, func) {
        $.fn[ns] = {};
        func($, $.fn[ns], _G);
    };
})(window, document, undefined);
function isPhone(phone){
    let reg = /^1(3|4|5|7|8)\d{9}$/;
    return reg.test(phone);
}
window.isBlank = function (text) {
    return !(text && text !== '' && text !== ' ');
}

/**
 * Determine whether the value is empty
 * @param obj
 * @returns {boolean}
 */
window.isNull = function (obj) {
    return obj === null || typeof(obj) === 'undefined'
}

/**
 * Boolean 转化 Int
 * @param flag
 * @returns {number}
 */
window.bool2Int = function (flag) {
    return flag ? 1 : 0;
}

/**
 * Int 转 boolean值
 * @param number
 * @returns {boolean}
 */
window.int2Bool = function (number) {
    return number !== 0;
}

/**
 * Parses the url and returns the corresponding value according to the parameter name
 * @param name
 * @returns {*}
 */
window.queryUrl = function (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return decodeURI(r[2]);
    return null;
}
/**
 * Determine whether the user is logged in
 * @returns {boolean|*}
 */
window.isLogin = function () {
    let isLogin = addCookie.getCookie('isLogin') || '0';
    return isLogin == '1' || (getBrowserType() === 'wx' && isSlientLogin)
}
window.addCookie = {
    // Set expiration time
    getsec: function (str) {
        let str1 = str.substring(1, str.length) * 1;
        let str2 = str.substring(0, 1);
        if (str2 == "s") {
            return str1 * 1000;
        } else if (str2 == "h") {
            return str1 * 60 * 60 * 1000;
        } else if (str2 == "d") {
            return str1 * 24 * 60 * 60 * 1000;
        }
    },
    // Set the cookie
    setCookie: function (name, value, time, path, domain) {
        let strsec = this.getsec(time);
        let exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=" + path + ";domain=" + domain;
    },
    // Read cookies
    getCookie: function (name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return unescape(arr[2]);
        else return null;
    },
    // Remove cookies
    delCookie: function () {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if (cval !== null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
};
function isBlank(varValue) {
    let boo = varValue !== null && varValue !== 'undefined' && varValue !== '' && varValue !== 'null';
    return boo ? false : true;
}
//获取URL地址参数
function getQueryString(name, url) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (!url || url == "") {
        url = window.location.search;
    } else {
        url = url.substring(url.indexOf("?"));
    }
    let r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}