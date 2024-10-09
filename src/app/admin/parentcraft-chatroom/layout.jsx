import React from "react";
import AblyContainer from "./ably";

function Layout({ children }) {
  return <AblyContainer>{children}</AblyContainer>;
}

export default Layout;
