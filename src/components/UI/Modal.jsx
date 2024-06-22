import { useEffect } from "react";
import { createPortal } from "react-dom";
function Modal({ onClose, children, actionBar }) {
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, []);
    return createPortal(
        <div>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-base-100 opacity-70"
            ></div>
            <div className="fixed inset-40 p-10 bg-base-200">
                <div className="flex flex-col justify-between h-full">
                    {children}
                    <div className="flex justify-end">{actionBar}</div>
                </div>
            </div>
        </div>,
        document.querySelector(".modal-container")
    );
}

export default Modal;
