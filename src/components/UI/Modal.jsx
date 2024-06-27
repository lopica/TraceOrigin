import { useEffect } from "react";
import { createPortal } from "react-dom";
function Modal({ onClose, children, actionBar }) {
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        // document.html.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove('overflow-hidden')
            // document.html.classList.remove('overflow-hidden')
        }
    }, []);

    
    return createPortal(
        <div>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-100 opacity-80 "
            ></div>
            <div className="fixed inset-20 p-10 bg-white h-[80svh] overflow-y-auto rounded-md">
                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col gap-6">{children}</div>
                    <div className="flex justify-end">{actionBar}</div>
                </div>
            </div>
        </div>,
        document.querySelector(".modal-container")
    );
}

export default Modal;
