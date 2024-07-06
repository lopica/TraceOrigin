import { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ onClose, children }) {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    // document.html.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
      // document.html.classList.remove('overflow-hidden')
    };
  }, []);

  return createPortal(
    <div className="relative z-10">
      <div
        className="fixed inset-0 flex items-center justify-center p-4 md:p-10 bg-black bg-opacity-50"
        onClick={onClose}
      >
        {/* Add onClick here to stop propagation */}
        <div
          className="relative w-full max-w-sm max-h-[70svh] md:max-w-2xl bg-white p-10 overflow-y-auto rounded-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-6">{children}</div>
            {/* Uncomment to add action bar at the bottom of the modal */}
            {/* <div className="flex justify-end">{actionBar}</div> */}
          </div>
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

export default Modal;
