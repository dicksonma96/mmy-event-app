import React from "react";

function ConfirmDialog({
  title,
  message,
  confirmFunc,
  closeFunc,
  confirmText,
  closeText,
}) {
  return (
    <div className="dialog_overlay">
      <div className="dialog_window col"></div>
    </div>
  );
}

export default ConfirmDialog;
