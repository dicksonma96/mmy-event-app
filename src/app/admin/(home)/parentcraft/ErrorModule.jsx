import React, { useEffect } from "react";

function ErrorModule({ error, retryFunc }) {
  useEffect(() => {
    console.log(error);
  }, []);
  return (
    <div className="error_module col">
      <span>{error}</span>
      <div onClick={retryFunc} className="btn2">
        Try Again
      </div>
    </div>
  );
}

export default ErrorModule;
