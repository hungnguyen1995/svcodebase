export declare const FeAuth: {
    isBrowser(): any;
    logout(): void;
    setAccessToken(accessToken: string): void;
    getAccessToken(req?: any): any;
    setUserInfo(userFull: any): void;
    getUserInfo(req?: any): any;
    isLogged(req?: any): boolean;
    isEmployer(req?: any): boolean;
    isSeeker(req?: any): boolean;
};
