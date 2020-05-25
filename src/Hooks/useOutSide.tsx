import { useEffect } from "react";

// Hook
const useOnClickOutside = (ref: any, handler: any) => {
    useEffect(() => {
        const listener = (event: { target: any; }) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref?.current || ref.current.contains(event.target)) {
                return;
            }

            handler(event);
        };
        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [ref, handler]);
};

export { useOnClickOutside };
