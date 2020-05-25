export interface IStore {
    api: any;
    ui: IUI;
    user: IUser;
}

export interface IToasty {
    msg: string;
    success: number;
    uuid: string;
}

export interface ILoading {
    [key: string]: boolean;
}

interface ILocation {
    value: string;
    label: string;
    path: string;
}

export interface IUI {
    toast?: IToasty;
    loading?: ILoading;
    modal?: IModal;
    toggle?: IToggle;
    location?: ILocation;
}

export interface IUser {
    info?: any;
    notice?: any;
    token?: any;
    favourite?: any;
}

export interface IModal {
    status?: boolean;
    title?: string;
    Component: any;
    childProps?: any;
    top?: any;
}

export interface IToggle {
    menuRight?: boolean;
    menuMobile?: boolean;
}
