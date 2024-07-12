import { useSelector } from "react-redux";
import Modal from "./UI/Modal";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";

export default function Consign({ productRecognition }) {
  const { show, handleOpen, handleClose } = useShow();
  const { email } = useSelector((state) => state.userSlice);

  return (
    <>
    <Button primary rounded onClick={handleOpen} className='p-2'>Ủy quyền</Button>
      {show && (
        <Modal onClose={handleClose}>
          {email}
          {productRecognition}
        </Modal>
      )}
    </>
  );
}
