import React from "react";

function Modal({ className = "", children, clickoutside }) {
  return (
    <div className="overlay_modal" onClick={clickoutside}>
      <div
        className={`modal ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
