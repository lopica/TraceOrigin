import { useRef } from "react";
import useShow from "../../hooks/use-show";
import Button from "./Button";
import Modal from "./Modal";
import { FaPlus } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import className from "classnames";
import useImage from "../../hooks/use-image";

function ImageBox({ image, actionBar, show, add, idx, setValue, ...props }) {
  const {
    show: showModal,
    handleOpen: handleClick,
    handleClose,
  } = useShow(false);
  const { handleImages: addImage, deleteImage, changeAvatar, isAvatar } = useImage(setValue);
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDelete = () => {
    handleClose();
    deleteImage(idx);
  };

  const handleAvatar = () => {
    handleClose();
    changeAvatar(idx);
  };

  const classes = twMerge(
    className(props.className, "hover:cursor-pointer", {
      "bg-sky-200 flex items-center justify-center": add,
      "object-cover ": show,
    })
  );

  const modal = (
    <Modal onClose={handleClose} actionBar={actionBar}>
      <div className="py-4 max-w-lg mx-auto">
      <img src={image} className="w-full h-full max-w-sm  mx-auto" />
      <div className="flex justify-between mt-4">
        <Button rounded secondary onClick={handleDelete}>
          Bỏ chọn
        </Button>
        <Button rounded primary onClick={handleAvatar}>
          Đặt làm ảnh chính
        </Button>
      </div>
      </div>
    </Modal>
  );
  return (
    <>
      {add ? (
        <>
        <div className={classes} onClick={triggerFileInput}>
          <FaPlus className="text-2xl fill-white" />
          <input
            ref={fileInputRef}
            name="images"
            type="file"
            className="file-input hidden"
            accept="image/png, image/gif, image/jpeg"
            multiple
            onChange={addImage}
          />
        </div>
        </>
      ) : (
        <div className="indicator">
          {isAvatar(image) && <span className="indicator-item indicator-center badge badge-info">Ảnh chính</span>}
          <img src={image} className={classes} onClick={handleClick} />
          {showModal && modal}
        </div>
      )}
    </>
  );
}

export default ImageBox;
