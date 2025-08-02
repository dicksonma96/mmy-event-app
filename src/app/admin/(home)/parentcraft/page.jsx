import React from "react";
import Workshop from "./Workshop";
import Contributors from "./Contributors";
import { ParentcraftContextProvider } from "./Context";
import Events from "./Events";
import ZoomLink from "./ZoomLink";
import AdminSlides from "./AdminSlides";
import Link from "next/link";
function Parentcraft() {
  return (
    <div className="admin_content col">
      <div className="admin_header row">
        <div className="title">PARENTCRAFT</div>

        <Link
          style={{ marginLeft: "auto" }}
          className="view_btn btn1"
          href={"/parentcraft"}
          target="_blank"
        >
          View Site
        </Link>
        <Link
          style={{ marginLeft: "1em" }}
          className="view_btn btn1"
          href={"/admin/parentcraft-chatroom"}
          target="_blank"
        >
          Speaker Chatroom
        </Link>
        <Link
          style={{ marginLeft: "1em" }}
          className="view_btn btn1"
          href={"/admin/parentcraft/chatlog"}
        >
          Chat Log
        </Link>
      </div>
      <div className="modules parentcraft_modules">
        <ParentcraftContextProvider>
          {/* <Workshop />
          <Contributors /> */}
          {/* <Events /> */}
          <AdminSlides />
          {/* <ZoomLink /> */}
        </ParentcraftContextProvider>
      </div>
    </div>
  );
}

export default Parentcraft;
