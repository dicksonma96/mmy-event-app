import React from "react";
import Workshop from "./Workshop";
import Link from "next/link";
import Contributors from "./Contributors";
import { ParentcraftContextProvider } from "./Context";
import Events from "./Events";
import AdminSlides from "./AdminSlides";
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
      </div>
      <div className="top_nav"></div>
      <div className="modules parentcraft_modules">
        <ParentcraftContextProvider>
          <Workshop />
          <Contributors />
          <Events />
          <AdminSlides />
        </ParentcraftContextProvider>
      </div>
    </div>
  );
}

export default Parentcraft;
