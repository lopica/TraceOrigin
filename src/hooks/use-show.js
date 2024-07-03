import { useState } from "react";

function useShow(initial) {
    const [show, setShow] = useState(initial);
    const handleOpen = () => {
        setShow(true);
    };
    const handleClose = () => {
        setShow(false);
    };

    return {show, handleOpen, handleClose}
}

export default useShow