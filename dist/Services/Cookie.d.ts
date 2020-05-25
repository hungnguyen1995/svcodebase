export declare const SvCookie: {
    isBrowser(): any;
    setCookie(key: string, value: string, date?: number): void;
    removeCookie(key: string): void;
    getCookieFromBrowser(key: string): any;
    getCookieFromServer(key: string, req: any): any;
    getCookie(key: string, req?: any): any;
};
