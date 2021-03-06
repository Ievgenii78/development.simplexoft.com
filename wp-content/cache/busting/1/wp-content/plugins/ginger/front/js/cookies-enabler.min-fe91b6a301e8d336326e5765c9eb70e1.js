 function strpos(e, n, t) {
    var s = (e + "").indexOf(n, t || 0);
    return -1 === s ? !1 : s
}

window.COOKIES_ENABLER = window.COOKIES_ENABLER || function () {
    "use strict";

    function e() {
        var e, n;
        for (e = 1; e < arguments.length; e++) for (n in arguments[e]) arguments[e].hasOwnProperty(n) && (arguments[0][n] = arguments[e][n]);
        return arguments[0]
    }

    function n(e, n, t) {
        var s;
        return function () {
            var a = this, i = arguments, r = function () {
                s = null, t || e.apply(a, i)
            }, o = t && !s;
            clearTimeout(s), s = setTimeout(r, n), o && e.apply(a, i)
        }
    }

    function t(e, n) {
        do if (s(e, n)) return e; while (e = e.parentNode);
        return null
    }

    function s(e, n) {
        return (" " + e.className + " ").indexOf(" " + n + " ") > -1
    }

    var a, i, r, o = {
        scriptClass: "ce-script",
        iframeClass: "ce-iframe",
        acceptClass: "ce-accept",
        disableClass: "ce-disable",
        dismissClass: "ce-dismiss",
        bannerClass: "ce-banner",
        bannerHTML: null !== document.getElementById("ce-banner-html") ? document.getElementById("ce-banner-html").innerHTML : '<p>This website uses cookies. <a href="#" class="ce-accept">Enable Cookies</a></p>',
        eventScroll: !1,
        scrollOffset: 200,
        clickOutside: !1,
        cookieName: "ce-cookie",
        cookieDuration: "365",
        forceBannerClass: "ginger-banner bottom dialog dark force",
        forceEnable: !1,
        forceEnableText: '<div class="ginger-button-wrapper"><div class="ginger-button"><a href="#" class="ginger-accept">Enable Cookie</a></div></div>',
        iframesPlaceholder: !0,
        iframesPlaceholderHTML: null !== document.getElementById("ce-iframePlaceholder-html") ? document.getElementById("ce-iframePlaceholder-html").innerHTML : '<p>To view this content you need to<a href="#" class="ce-accept">Enable Cookies</a></p>',
        iframesPlaceholderClass: "ce-iframe-placeholder",
        onEnable: "",
        onDismiss: "",
        onDisable: "",
        forceReload: !1
    }, c = function () {
        Math.abs(window.pageYOffset - r) > a.scrollOffset && "N" != g.get() && u()
    }, l = function () {
        i = {
            accept: document.getElementsByClassName(a.acceptClass),
            disable: document.getElementsByClassName(a.disableClass),
            banner: document.getElementsByClassName(a.bannerClass),
            bannerForce: document.getElementsByClassName(a.forceBannerClass),
            dismiss: document.getElementsByClassName(a.dismissClass)
        };
        var e, n = i.accept, s = n.length, o = i.disable, l = o.length, d = i.dismiss, p = d.length;
        for (a.eventScroll && window.addEventListener("load", function () {
            r = window.pageYOffset, window.addEventListener("scroll", c)
        }), a.clickOutside && document.addEventListener("click", function (e) {
            var n = e.target;
            return t(n, a.iframesPlaceholderClass) || t(n, a.disableClass) || t(n, a.bannerClass) || t(n, a.dismissClass) || t(n, a.disableClass) ? !1 : void("N" != g.get() && u())
        }), e = 0; s > e; e++) n[e].addEventListener("click", function (e) {
            e.preventDefault(), u(e)
        });
        for (e = 0; l > e; e++) o[e].addEventListener("click", function (e) {
            e.preventDefault(), f(e)
        });
        for (e = 0; p > e; e++) d[e].addEventListener("click", function (e) {
            e.preventDefault(), m.dismiss()
        })
    }, d = function (n) {
        if (a = e({}, o, n), "Y" == g.get()) "function" == typeof a.onEnable && a.onEnable(), y.get_async(), b.get(), p.get(); else if ("N" == g.get()) {
            var t = document.getElementById("disqus_thread");
            null != t && (t.style.display = "none"), 0 != a.forceEnable && m.forceAccept(), "function" == typeof a.onDisable && a.onDisable(), p.hide(), l()
        } else {
            var t = document.getElementById("disqus_thread");
            null != t && (t.style.display = "none"), m.create(), p.hide(), l()
        }
    }, u = n(function (e) {
        if ("undefined" != typeof e && "click" === e.type && e.preventDefault(), "Y" != g.get()) {
            y.get_async(), g.set(), b.get(), p.get(), p.removePlaceholders(), m.dismiss();
            var n = document.getElementById("disqus_thread");
            null != n && (n.style.display = "block"), window.removeEventListener("scroll", c), "function" == typeof a.onEnable && a.onEnable(), 1 == a.forceReload && location.reload()
        }
    }, 250, !1), f = function (e) {
        "undefined" != typeof e && "click" === e.type && e.preventDefault(), "N" != g.get() && (g.set("N"), m.dismiss(), window.removeEventListener("scroll", c), "function" == typeof a.onDisable && a.onDisable())
    }, m = function () {
        function e() {
            var e = '<div class="' + a.bannerClass + '">' + a.bannerHTML + "</div>";
            document.body.insertAdjacentHTML("beforeend", e)
        }

        function n() {
            var e = '<div class="' + a.forceBannerClass + '">' + a.forceEnableText + "</div>";
            document.body.insertAdjacentHTML("beforeend", e)
        }

        function t() {
            i.bannerForce[0] && (i.bannerForce[0].style.display = "none"), i.banner[0] && (i.banner[0].style.display = "none"), "function" == typeof a.onDismiss && a.onDismiss()
        }

        return {create: e, dismiss: t, forceAccept: n}
    }(), g = function () {
        function e(e) {
            var n, t, s = "undefined" != typeof e ? e : "Y";
            a.cookieDuration ? (n = new Date, n.setTime(n.getTime() + 24 * a.cookieDuration * 60 * 60 * 1e3), t = "; expires=" + n.toGMTString()) : t = "", document.cookie = a.cookieName + "=" + s + t + "; path=/";
            var i = "undefined" != typeof ginger_logger ? ginger_logger : "N";
            "Y" == i && gingerAjaxLogTime(s)
        }

        function n() {
            var e, n, t, s = document.cookie.split(";"), i = s.length;
            for (e = 0; i > e; e++) if (n = s[e].substr(0, s[e].indexOf("=")), t = s[e].substr(s[e].indexOf("=") + 1), n = n.replace(/^\s+|\s+$/g, ""), n == a.cookieName) return unescape(t)
        }

        return {set: e, get: n}
    }(), p = function () {
        function e(e) {
            var n = document.createElement("div");
            n.className = a.iframesPlaceholderClass, n.innerHTML = a.iframesPlaceholderHTML, e.parentNode.insertBefore(n, e)
        }

        function n() {
            var e, n = document.getElementsByClassName(a.iframesPlaceholderClass), t = n.length;
            for (e = t - 1; e >= 0; e--) n[e].remove()
        }

        function t() {
            var n, t, s = document.getElementsByClassName(a.iframeClass), i = s.length;
            for (t = 0; i > t; t++) n = s[t], n.style.display = "none", a.iframesPlaceholder && e(n)
        }

        function s() {
            var e, n, t, s = document.getElementsByClassName(a.iframeClass), i = s.length;
            for (t = 0; i > t; t++) n = s[t], e = n.attributes["data-ce-src"].value, n.src = e, n.style.display = "block"
        }

        return {hide: t, get: s, removePlaceholders: n}
    }(), b = function () {
        function e() {
            var e, n, t, s, i = document.getElementsByClassName(a.scriptClass), r = i.length,
                o = document.createDocumentFragment();
            for (e = 0; r > e; e++) if (i[e].hasAttribute("data-ce-src")) "undefined" == typeof postscribe && postscribe(i[e].parentNode, '<script src="' + i[e].getAttribute("data-ce-src") + '"></script>'); else {
                for (t = document.createElement("script"), t.type = "text/javascript", n = 0; n < i[e].attributes.length; n++) s = i[e].attributes[n], s.specified && "type" != s.name && "class" != s.name && t.setAttribute(s.name, s.value);
                t.innerHTML = i[e].innerHTML, o.appendChild(t)
            }
            document.body.appendChild(o)
        }

        function n() {
            "undefined" != typeof async_ginger_script
        }

        return {get: e, get_async: n}
    }(), y = function () {
        function e() {
            if ("undefined" != typeof async_ginger_script) {
                var e, n = async_ginger_script;
                for (e = 0; e < n.length; ++e) {
                    var t = document.createElement("script");
                    t.type = "text/javascript", t.src = n[e], document.getElementsByTagName("head")[0].appendChild(t)
                }
            }
        }

        return {get_async: e}
    }();
    return {init: d, enableCookies: u, dismissBanner: m.dismiss}
}();