import { useState } from "react";

function useShow(initial) {
  const [show, setShow] = useState(initial);
  const handleOpen = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleFlip = () => {
    setShow(!show);
  };

  return { show, handleOpen, handleClose, handleFlip, setShow };
}

export default useShow;
