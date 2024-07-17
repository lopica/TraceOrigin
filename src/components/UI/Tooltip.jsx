import { useFloating, useHover, useInteractions } from "@floating-ui/react";
import { useState } from "react";

export default function Tooltip({ children, content }) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right",
    strategy: "fixed",
  });

  const hover = useHover(context, {
    delay: 200,
    restMs: 200,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 9999 }}
          {...getFloatingProps()}
        >
          <div className=" bg-white p-2 rounded ml-2 border shadow-xl">{content}</div>
        </div>
      )}
    </>
  );
}
