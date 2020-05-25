import { useEffect, useState, useRef } from "react";

function useSticky() {
    const [isSticky, setSticky] = useState(false);
    const element: any = useRef(null);

    const handleScroll = () => {
        if (element.current) {
            // eslint-disable-next-line no-unused-expressions
            window.scrollY >= element.current.getBoundingClientRect().bottom
                ? setSticky(true)
                : setSticky(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", () => handleScroll);
        };
    }, [handleScroll]);

    return { isSticky, element };
}

export { useSticky };
