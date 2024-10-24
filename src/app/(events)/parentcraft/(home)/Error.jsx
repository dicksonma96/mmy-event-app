"use client";

import React, { useEffect, useState } from "react";

function Error() {
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    function Refresh() {
      setRefreshing(true);
    }

    window.addEventListener("beforeunload", Refresh);

    return () => {
      window.removeEventListener("beforeunload", Refresh);
    };
  }, []);
  return (
    <div
      className="error col"
      onClick={() => {
        location.reload();
      }}
    >
      <span
        className={`material-symbols-outlined ${
          refreshing ? "refreshing" : ""
        }`}
      >
        refresh
      </span>
      <p>
        We're sorry, but something went wrong. <br />
        Please try again.
      </p>
    </div>
  );
}

export default Error;
