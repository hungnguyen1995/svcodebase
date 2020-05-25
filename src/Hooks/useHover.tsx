import { useRef, useState, useEffect } from "react";

const useHover = () => {
    const [value, setValue] = useState(false);
    const ref = useRef(null);
    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    // @ts-ignore
    useEffect(
        () => {
            const node: any = ref.current;
            if (node) {
                node.addEventListener("mouseover", handleMouseOver);
                node.addEventListener("mouseout", handleMouseOut);
            }
            return () => {
                node.removeEventListener("mouseover", handleMouseOver);
                node.removeEventListener("mouseout", handleMouseOut);
            };
        },
        [] // Recall only if ref changes
    );

    return [ref, value];
};
export { useHover };
