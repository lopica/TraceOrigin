import { useRef } from "react";
import useShow from "../../hooks/use-show";
import Button from "./Button";
import Modal from "./Modal";
import { FaPlus } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import className from "classnames";
import useImage from "../../hooks/use-image";
import useCertiImage from "../../hooks/use-image-certi";
import useImageEditPro from "../../hooks/use-image-editPro";

function ImageBox({
  image,
  actionBar,
  show,
  add,
  idx,
  setValue,
  isCer = false,
  isEditPro = false,
  isReport = false,
  handleFatherDelete,
  ...props
}) {
  const {
    show: showModal,
    handleOpen: handleClick,
    handleClose,
  } = useShow(false);
  let imageProps = {};

  if (isEditPro) {
    imageProps = useImageEditPro(setValue);
  } else if (isCer) {
    imageProps = useCertiImage(setValue);
  } else {
    imageProps = useImage(setValue);
  }
  const {
    handleImages: addImage,
    deleteImage,
    changeAvatar,
    isAvatar,
  } = imageProps;
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
        <img src={image} className="w-full h-full max-w-sm mx-auto" />
        <div className="flex justify-between mt-4">
        {isReport ? (
          <Button rounded secondary onClick={() => { handleFatherDelete(idx); handleDelete(); }}>
            Bỏ chọn
          </Button>
        ) : (
          <Button rounded secondary onClick={handleDelete}>
            Bỏ chọn
          </Button>
        )}
        {isCer ? (
          <div></div>
        ) : isReport ? (
          <div></div>
        ) : (
          <Button rounded primary onClick={handleAvatar}>
            Đặt làm ảnh chính
          </Button>
        )}
        </div>
      </div>
    </Modal>
  );

  return (
    <>
      {console.log("tessttttttt:" + isEditPro + " va" + isCer)}
      {add ? (
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
      ) : (
        <div className="indicator">
          {isAvatar(image) && (
            <span className="indicator-item indicator-center badge badge-info text-white">
              Ảnh chính
            </span>
          )}
          <img src={image} className={classes} onClick={handleClick} />
          {showModal && modal}
        </div>
      )}
    </>
  );
}

export default ImageBox;
