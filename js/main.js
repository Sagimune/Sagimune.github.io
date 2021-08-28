// smooth-scroll
$.smoothScroll({
    //滑动到的位置的偏移量
    offset: 0,
    //滑动的方向，可取 'top' 或 'left'
    direction: 'top',
    // 只有当你想重写默认行为的时候才会用到
    scrollTarget: null,
    // 滑动开始前的回调函数。`this` 代表正在被滚动的元素
    beforeScroll: function () { },
    //滑动完成后的回调函数。 `this` 代表触发滑动的元素
    afterScroll: function () { },
    //缓动效果
    easing: 'swing',
    //滑动的速度
    speed: 700,
    // "自动" 加速的系数
    autoCoefficent: 2
});


// Bind the hashchange event listener
$(window).bind('hashchange', function (event) {
    $.smoothScroll({
        // Replace '#/' with '#' to go to the correct target
        offset: $("body").attr("data-offset")? -$("body").attr("data-offset"):0 ,
        // offset: -30,
        scrollTarget: decodeURI(location.hash.replace(/^\#\/?/, '#'))
        
      });
});

// $(".smooth-scroll").on('click', "a", function() {
$('a[href*="#"]')
    .bind('click', function (event) {    
    // Remove '#' from the hash.
    var hash = this.hash.replace(/^#/, '')
    if (this.pathname === location.pathname && hash) {
        event.preventDefault();
        // Change '#' (removed above) to '#/' so it doesn't jump without the smooth scrolling
        location.hash = '#/' + hash;
    }
});

// Trigger hashchange event on page load if there is a hash in the URL.
if (location.hash) {
    $(window).trigger('hashchange');
}

// // $('[data-spy="scroll"]').each(function () {
// //     var $spy = $(this).scrollspy('refresh')
// //   })

// $('[data-spy="scroll"]').on('activate.bs.scrollspy', function () {
//     // do something…
//     var offset = $('[data-spy="scroll"]').attr("data-offset")
//   })

//防调试
    $(document).ready(function () {
      document.oncontextmenu = function () {
        return false;
      }
      //document.onselectstart = function () {
       // return false;
     // }
      //document.oncopy = function () {
        //return false;
     // }
      document.onkeydown = function () {
        //f12
        if (window.event && window.event.keyCode == 123) {
          event.keyCode = 0;
          event.returnValue = false;
          layer.msg("别看代码了=.=")
          return false;
        }
        //ctrl+u
        if (event.ctrlKey && window.event.keyCode == 85) {
          return false;
        }
        //ctrl+shift+i
        if ((event.ctrlKey) && (event.shiftKey) && (event.keyCode == 73)) {
          return false;
        }
        // Ctrl+S
        else if ((event.ctrlKey) && (event.keyCode == 83)) {
          return false;
        }
      };

    });

/*
        // 反调试函数,参数：开关，执行代码
        function endebug(off, code) {
            if (!off) {
                ! function(e) {
                    function n(e) {
                        function n() {
                            return u;
                        }

                        function o() {
                            window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized ? t("on") : (a = "off", console.log(d), console.clear(), t(a));
                        }

                        function t(e) {
                            u !== e && (u = e, "function" == typeof c.onchange && c.onchange(e));
                        }

                        function r() {
                            l || (l = !0, window.removeEventListener("resize", o), clearInterval(f));
                        }
                        "function" == typeof e && (e = {
                            onchange: e
                        });
                        var i = (e = e || {}).delay || 500,
                            c = {};
                        c.onchange = e.onchange;
                        var a, d = new Image;
                        d.__defineGetter__("id", function() {
                            a = "on"
                        });
                        var u = "unknown";
                        c.getStatus = n;
                        var f = setInterval(o, i);
                        window.addEventListener("resize", o);
                        var l;
                        return c.free = r, c;
                    }
                    var o = o || {};
                    o.create = n, "function" == typeof define ? (define.amd || define.cmd) && define(function() {
                        return o
                    }) : "undefined" != typeof module && module.exports ? module.exports = o : window.jdetects = o
                }(), jdetects.create(function(e) {
                    var a = 0;
                    var n = setInterval(function() {
                        if ("on" == e) {
                            setTimeout(function() {
                                if (a == 0) {
                                    a = 1;
                                    setTimeout(code);
                                }
                            }, 200);
                        }
                    }, 100);
                })
            }
        }
    endebug(false, function() {
        // 非法调试执行的代码(不要使用控制台输出的提醒)
        document.write("检测到非法调试,请关闭后刷新重试!");
    });

*/
    //debug调试时跳转页面
    var element = new Image();
    Object.defineProperty(element,'id',{get:function(){window.location.href="https://sagimune.github.io/"}});
    console.log(element);