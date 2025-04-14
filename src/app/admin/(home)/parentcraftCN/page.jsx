import React from "react";
import Workshop from "./Workshop";
import Contributors from "./Contributors";
import { ParentcraftContextProvider } from "./Context";
import Events from "./Events";
import AdminSlides from "./AdminSlides";
import Link from "next/link";
import ZoomLink from "./ZoomLink";
function Parentcraft() {
  return (
    <div className="admin_content col">
      <div className="admin_header row">
        <div className="title">PARENTCRAFT CN</div>

        <Link
          style={{ marginLeft: "auto" }}
          className="view_btn btn1"
          href={"/parentcraftCN"}
          target="_blank"
        >
          View Site
        </Link>
        <Link
          style={{ marginLeft: "1em" }}
          className="view_btn btn1"
          href={"/admin/parentcraftCN-chatroom"}
          target="_blank"
        >
          Speaker Chatroom
        </Link>
        <Link
          style={{ marginLeft: "1em" }}
          className="view_btn btn1"
          href={"/admin/parentcraftCN/chatlog"}
        >
          Chat Log
        </Link>
      </div>
      <div className="modules parentcraft_modules">
        <ParentcraftContextProvider>
          <Workshop />
          <Contributors />
          {/* <Events /> */}
          <AdminSlides />
          <ZoomLink />
        </ParentcraftContextProvider>
      </div>
    </div>
  );
}

export default Parentcraft;
