# Siêu Việt Codebase
### 1.0.1

```
yarn add svcodebase
```

FeCookie
FeAuth
FeCheck
useOnClickOutside
useHover
useScrollToTop
useSticky
useDebounce

```
export const useDispatchAction = () => {
    return useDispatch();
};

export const dispatchServer = (ctx: any) => {
    return ctx.store.dispatch;
};

export const useCommon = (keys: string[]) => {
    const commonData = useSelector(
        (state: IStore) => state.api.systemCommon.data,
        shallowEqual
    );
    if (commonData) {
        return keys.map(key => commonData[key]);
    }
    return [];
};

export const useUserInfo = () => {
    return useSelector((state: IStore) => state.user.info, shallowEqual);
};

export const useUserNotice = () => {
    return useSelector((state: IStore) => state.user.notice, shallowEqual);
};

export const useUserFavourite = () => {
    return useSelector((state: IStore) => state.user.favourite, shallowEqual);
};

export const useToggle = () => {
    return useSelector((state: IStore) => state.ui.toggle, shallowEqual);
};

export const useLocation = () => {
    return useSelector((state: IStore) => state.ui.location, shallowEqual);
};

export const useApi = (key: string) => {
    const apiData = useSelector(
        (state: IStore) => state.api[key],
        shallowEqual
    );
    return apiData || null;
};

export const useApiResponse = (key: string) => {
    const apiData = useSelector(
        (state: IStore) => state.api[key],
        shallowEqual
    );
    if (apiData?.code === 200) {
        return apiData.data;
    }
    return null;
};
```
