import cookie from 'js-cookie';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

// @ts-ignore
var SvCookie = {
    isBrowser: function () {
        return process.browser;
    },
    setCookie: function (key, value, date) {
        if (date === void 0) { date = 1; }
        if (SvCookie.isBrowser()) {
            cookie.set(key, value, {
                expires: date,
                path: "/"
            });
        }
    },
    removeCookie: function (key) {
        if (SvCookie.isBrowser()) {
            cookie.remove(key, {
                expires: 1
            });
        }
    },
    getCookieFromBrowser: function (key) {
        return cookie.get(key);
    },
    getCookieFromServer: function (key, req) {
        var _a;
        if (!((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.cookie)) {
            return undefined;
        }
        var rawCookie = req.headers.cookie
            .split(";")
            .find(function (c) { return c.trim().startsWith(key + "="); });
        if (!rawCookie) {
            return undefined;
        }
        return rawCookie.split("=")[1];
    },
    getCookie: function (key, req) {
        return SvCookie.isBrowser()
            ? SvCookie.getCookieFromBrowser(key)
            : SvCookie.getCookieFromServer(key, req);
    },
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var TokenExpired = 100; // 100 day
var SvAuth = {
    isBrowser: function () {
        return process.browser;
    },
    logout: function () {
        if (!SvAuth.isBrowser())
            return;
        SvCookie.removeCookie("access_token");
        SvCookie.removeCookie("user_info");
    },
    setAccessToken: function (accessToken) {
        SvCookie.setCookie("access_token", accessToken, TokenExpired);
    },
    getAccessToken: function (req) {
        var accessToken = SvCookie.getCookie("access_token", req);
        if (accessToken && accessToken !== "undefined") {
            return accessToken;
        }
        return null;
    },
    setUserInfo: function (userFull) {
        var user = userFull;
        if (!SvAuth.isBrowser())
            return;
        if (user) {
            if (user.token_auth) {
                SvAuth.setAccessToken(user.token_auth);
                delete user.token_auth;
            }
            delete user.token_auth;
            var userString = JSON.stringify(user);
            var userInfoEncode = Buffer.from(userString).toString("base64");
            SvCookie.setCookie("user_info", userInfoEncode, TokenExpired);
        }
    },
    getUserInfo: function (req) {
        var user = SvCookie.getCookie("user_info", req);
        if (user) {
            var userInfoDecode = JSON.parse(Buffer.from(user, "base64").toString());
            var objUserInfoDecode = __assign({}, userInfoDecode);
            return objUserInfoDecode || null;
        }
        return null;
    },
    isLogged: function (req) {
        var userBase = SvAuth.getAccessToken(req);
        return !!userBase;
    },
    isEmployer: function (req) {
        var userBase = SvAuth.getUserInfo(req);
        return !!(userBase && userBase.role === "employer");
    },
    isSeeker: function (req) {
        var userBase = SvAuth.getUserInfo(req);
        return !!(userBase && userBase.role === "seeker");
    }
};

var SvCheck = {
    isMobile: function (opts) {
        // Những UserAgent để detect
        var mobileRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
        var tabletRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;
        var requestHeader;
        // Nếu không lấy được trên server = lấy UserAgent của Browser
        if (typeof navigator !== "undefined") {
            requestHeader = navigator.userAgent;
        }
        else {
            requestHeader = opts.req;
        }
        if (requestHeader &&
            requestHeader.headers &&
            typeof requestHeader.headers["user-agent"] === "string") {
            requestHeader = requestHeader.headers["user-agent"];
        }
        if (typeof requestHeader !== "string")
            return false;
        var result = opts.tablet
            ? tabletRE.test(requestHeader)
            : mobileRE.test(requestHeader);
        if (!result &&
            opts.tablet &&
            opts.featureDetect &&
            navigator &&
            navigator.maxTouchPoints > 1 &&
            requestHeader.indexOf("Macintosh") !== -1 &&
            requestHeader.indexOf("Safari") !== -1) {
            result = true;
        }
        return result;
    },
    isBrowser: function () {
        return process.browser;
    },
    isSeeker: function (info) {
        return (info === null || info === void 0 ? void 0 : info.role) === "seeker";
    },
    isEmployer: function (info) {
        return (info === null || info === void 0 ? void 0 : info.role) === "employer";
    },
    isLogged: function (info) {
        return !!info;
    },
};

// Hook
var useOnClickOutside = function (ref, handler) {
    useEffect(function () {
        var listener = function (event) {
            // Do nothing if clicking ref's element or descendent elements
            if (!(ref === null || ref === void 0 ? void 0 : ref.current) || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        return function () {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler]);
};

var useHover = function () {
    var _a = useState(false), value = _a[0], setValue = _a[1];
    var ref = useRef(null);
    var handleMouseOver = function () { return setValue(true); };
    var handleMouseOut = function () { return setValue(false); };
    // @ts-ignore
    useEffect(function () {
        var node = ref.current;
        if (node) {
            node.addEventListener("mouseover", handleMouseOver);
            node.addEventListener("mouseout", handleMouseOut);
        }
        return function () {
            node.removeEventListener("mouseover", handleMouseOver);
            node.removeEventListener("mouseout", handleMouseOut);
        };
    }, [] // Recall only if ref changes
    );
    return [ref, value];
};

var useScrollToTop = function () {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
};

// @ts-ignore
var useDispatchAction = function () {
    return useDispatch();
};
var dispatchServer = function (ctx) {
    return ctx.store.dispatch;
};
var useCommon = function (keys) {
    var commonData = useSelector(function (state) { return state.api.systemCommon.data; }, shallowEqual);
    if (commonData) {
        return keys.map(function (key) { return commonData[key]; });
    }
    return [];
};
var useUserInfo = function () {
    return useSelector(function (state) { return state.user.info; }, shallowEqual);
};
var useUserNotice = function () {
    return useSelector(function (state) { return state.user.notice; }, shallowEqual);
};
var useUserFavourite = function () {
    return useSelector(function (state) { return state.user.favourite; }, shallowEqual);
};
var useToggle = function () {
    return useSelector(function (state) { return state.ui.toggle; }, shallowEqual);
};
var useLocation = function () {
    return useSelector(function (state) { return state.ui.location; }, shallowEqual);
};
var useApi = function (key) {
    var apiData = useSelector(function (state) { return state.api[key]; }, shallowEqual);
    return apiData || null;
};
var useApiResponse = function (key) {
    var apiData = useSelector(function (state) { return state.api[key]; }, shallowEqual);
    if ((apiData === null || apiData === void 0 ? void 0 : apiData.code) === 200) {
        return apiData.data;
    }
    return null;
};

function useSticky() {
    var _a = useState(false), isSticky = _a[0], setSticky = _a[1];
    var element = useRef(null);
    var handleScroll = function () {
        if (element.current) {
            // eslint-disable-next-line no-unused-expressions
            window.scrollY >= element.current.getBoundingClientRect().bottom
                ? setSticky(true)
                : setSticky(false);
        }
    };
    useEffect(function () {
        window.addEventListener("scroll", handleScroll);
        return function () {
            window.removeEventListener("scroll", function () { return handleScroll; });
        };
    }, [handleScroll]);
    return { isSticky: isSticky, element: element };
}

// Our hook
var useDebounce = function (value, delay) {
    var _a = useState(value), debouncedValue = _a[0], setDebouncedValue = _a[1];
    useEffect(function () {
        var handler = setTimeout(function () {
            setDebouncedValue(value);
        }, delay);
        return function () {
            clearTimeout(handler);
        };
    }, [value]);
    return debouncedValue;
};

export { SvAuth, SvCheck, SvCookie, dispatchServer, useApi, useApiResponse, useCommon, useDebounce, useDispatchAction, useHover, useLocation, useOnClickOutside, useScrollToTop, useSticky, useToggle, useUserFavourite, useUserInfo, useUserNotice };
//# sourceMappingURL=index.es.js.map
