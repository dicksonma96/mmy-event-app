import React from "react";
import Agenda from "./Agenda";
import Link from "next/link";
import Contributors from "./Contributors";
import { ParentcraftContextProvider } from "./Context";
function Parentcraft() {
  return (
    <div className="admin_content col">
      <div className="admin_header row">
        <div className="title">PARENTCRAFT</div>

        <Link className="view_btn btn1" href={"/parentcraft"} target="_blank">
          View Site
        </Link>
      </div>
      <div className="top_nav"></div>
      <div className="modules parentcraft_modules">
        <ParentcraftContextProvider>
          <Agenda />
          <Contributors />
        </ParentcraftContextProvider>
      </div>
    </div>
  );
}

export default Parentcraft;
