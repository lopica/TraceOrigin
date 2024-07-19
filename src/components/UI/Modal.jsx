import { useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';  

function Modal({ onClose, children, className, primary, easy }) {
  const dynamicClasses = classNames('relative w-full max-h-[80svh] min-h-[40svh] container max-w-3xl bg-white rounded', {
    'border-blue-500 bg-sky-500 text-white': primary,
  });

  // Use `twMerge` to combine `props.className` with the classes from `classNames`
  const classes = twMerge(dynamicClasses, className);

  useEffect(() => {
    document.body.classList.add("overflow-y-hidden");
    // document.html.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-y-hidden");
      // document.html.classList.remove('overflow-hidden')
    };
  }, []);

  return createPortal(
    <div className="relative z-20">
      <div
        className="fixed inset-0 flex items-center justify-center p-4 md:p-10 bg-black bg-opacity-50"
        onClick={easy && onClose}
      >
        <div
          className={classes}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative top-0 right-0 z-20 max-h-[80svh] min-h-[40svh] h-auto">
            <button
              onClick={onClose}
              className="absolute top-0 right-2 z-20 text-gray-500 hover:text-gray-800 text-4xl"
            >
              &times;
            </button>
            <div className="flex flex-col gap-6 max-h-[80svh] min-h-[40svh] overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  );
}

export default Modal;
