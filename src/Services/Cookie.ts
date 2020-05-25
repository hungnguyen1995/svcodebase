// @ts-ignore
import cookie from "js-cookie";

interface Process {
    browser: boolean
}
declare var process: Process;

export const FeCookie = {
    isBrowser(): any {
        return process.browser;
    },
    setCookie(key: string, value: string, date: number = 1) {
        if (FeCookie.isBrowser()) {
            cookie.set(key, value, {
                expires: date,
                path: "/"
            });
        }
    },
    removeCookie(key: string) {
        if (FeCookie.isBrowser()) {
            cookie.remove(key, {
                expires: 1
            });
        }
    },
    getCookieFromBrowser(key: string) {
        return cookie.get(key);
    },
    getCookieFromServer(key: string, req: any) {
        if (!req?.headers?.cookie) {
            return undefined;
        }
        const rawCookie = req.headers.cookie
            .split(";")
            .find((c: any) => c.trim().startsWith(`${key}=`));
        if (!rawCookie) {
            return undefined;
        }
        return rawCookie.split("=")[1];
    },
    getCookie(key: string, req?: any) {
        return FeCookie.isBrowser()
            ? FeCookie.getCookieFromBrowser(key)
            : FeCookie.getCookieFromServer(key, req);
    },
};
