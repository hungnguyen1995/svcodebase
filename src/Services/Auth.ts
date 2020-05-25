import { FeCookie } from "./Cookie";

const TokenExpired = 100; // 100 day

interface Process {
    browser: boolean
}
declare var process: Process;

export const FeAuth = {
    isBrowser(): any {
        return process.browser;
    },
    logout() {
        if (!FeAuth.isBrowser()) return;
        FeCookie.removeCookie("access_token");
        FeCookie.removeCookie("user_info");
    },
    setAccessToken(accessToken: string) {
        FeCookie.setCookie("access_token", accessToken, TokenExpired);
    },
    getAccessToken(req?: any) {
        const accessToken = FeCookie.getCookie("access_token", req);
        if (accessToken && accessToken !== "undefined") {
            return accessToken;
        }
        return null;
    },
    setUserInfo(userFull: any) {
        const user = userFull;
        if (!FeAuth.isBrowser()) return;
        if (user) {
            if (user.token_auth) {
                FeAuth.setAccessToken(user.token_auth);
                delete user.token_auth;
            }
            delete user.token_auth;
            const userString = JSON.stringify(user);
            const userInfoEncode = Buffer.from(userString).toString("base64");
            FeCookie.setCookie("user_info", userInfoEncode, TokenExpired);
        }
    },
    getUserInfo(req?: any) {
        const user = FeCookie.getCookie("user_info", req);
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
        const userBase = FeAuth.getAccessToken(req);
        return !!userBase;
    },
    isEmployer(req?: any) {
        const userBase = FeAuth.getUserInfo(req);
        return !!(userBase && userBase.role === "employer");
    },
    isSeeker(req?: any) {
        const userBase = FeAuth.getUserInfo(req);
        return !!(userBase && userBase.role === "seeker");
    }
};
