import React, { useEffect } from "react";

function ErrorModule({ error, retryFunc }) {
  useEffect(() => {
    console.log(error);
  }, []);
  function ShowErrorMessage() {
    if (typeof error === "string" || error instanceof String) return error;
    if (error?.message) {
      return error.message;
    } else return "Something went wrong. Please try again";
  }
  return (
    <div className="error_module col">
      <span>{ShowErrorMessage()}</span>
      <div onClick={retryFunc} className="btn2">
        Try Again
      </div>
    </div>
  );
}

export default ErrorModule;
