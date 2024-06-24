import { useRef } from "react";
import useShow from "../../hooks/use-show"
import Button from "./Button";
import Modal from "./Modal";
import { FaPlus } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import className from "classnames";


function ImageBox({ image, actionBar, show, add, addImage, deleteImage, ...props }) {
    const { show: showModal, handleOpen: handleClick, handleClose } = useShow(false)
    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleDelete = () => {
        handleClose()
        deleteImage()
    }

    const classes = twMerge(className(props.className, 'shadow-lg hover:shadow-sky-300', {
        'bg-sky-200 flex items-center justify-center': add,
        "object-cover": show,
    }))

    const modal = (
        <Modal onClose={handleClose} actionBar={actionBar}>
            <img
                src={image}
                className="w-full h-full"
            />
            <div className="flex justify-between mt-4">
                <Button rounded secondary onClick={handleDelete}>Bỏ chọn</Button>
                <Button rounded primary>Đặt làm ảnh chính</Button>
            </div>
        </Modal>
    );
    return <>
        {add ? (<div
            className={classes}
            onClick={triggerFileInput}
        >
            <FaPlus className="text-2xl fill-white" />
            <input
                ref={fileInputRef}
                name="images"
                type="file"
                className="file-input hidden"
                accept="image/png, image/gif, image/jpeg"
                multiple
                required
                onChange={addImage}
            />
        </div>) : (<>
            <img
                src={image}
                className={classes}
                onClick={handleClick}
            />
            {showModal && modal}
        </>)}

    </>
}

export default ImageBox