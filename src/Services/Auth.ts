import { SvCookie } from "./Cookie";

const TokenExpired = 100; // 100 day

interface Process {
    browser: boolean
}
declare var process: Process;

export const SvAuth = {
    isBrowser(): any {
        return process.browser;
    },
    logout() {
        if (!SvAuth.isBrowser()) return;
        SvCookie.removeCookie("access_token");
        SvCookie.removeCookie("user_info");
    },
    setAccessToken(accessToken: string) {
        SvCookie.setCookie("access_token", accessToken, TokenExpired);
    },
    getAccessToken(req?: any) {
        const accessToken = SvCookie.getCookie("access_token", req);
        if (accessToken && accessToken !== "undefined") {
            return accessToken;
        }
        return null;
    },
    setUserInfo(userFull: any) {
        const user = userFull;
        if (!SvAuth.isBrowser()) return;
        if (user) {
            if (user.token_auth) {
                SvAuth.setAccessToken(user.token_auth);
                delete user.token_auth;
            }
            delete user.token_auth;
            const userString = JSON.stringify(user);
            const userInfoEncode = Buffer.from(userString).toString("base64");
            SvCookie.setCookie("user_info", userInfoEncode, TokenExpired);
        }
    },
    getUserInfo(req?: any) {
        const user = SvCookie.getCookie("user_info", req);
        if (user) {
            const userInfoDecode = JSON.parse(
                Buffer.from(user, "base64").toString()
            );
            const objUserInfoDecode = { ...userInfoDecode };
            return objUserInfoDecode || null;
        }
        return null;
    },
    isLogged(req?: any) {
        const userBase = SvAuth.getAccessToken(req);
        return !!userBase;
    },
    isEmployer(req?: any) {
        const userBase = SvAuth.getUserInfo(req);
        return !!(userBase && userBase.role === "employer");
    },
    isSeeker(req?: any) {
        const userBase = SvAuth.getUserInfo(req);
        return !!(userBase && userBase.role === "seeker");
    }
};
