import React from "react";
import { ParentcraftContextProvider } from "./Context";
import AdminSlides from "./AdminSlides";
import Link from "next/link";
function Parentcraft({ params }) {
  const { lang } = params;
  return (
    <div className="admin_content col">
      <div className="admin_header row">
        <div className="title">PARENTCRAFT {lang}</div>

        <Link
          style={{ marginLeft: "auto" }}
          className="view_btn btn1"
          href={`/parentcraft/${lang}`}
          target="_blank"
        >
          View Site
        </Link>
        <Link
          style={{ marginLeft: "1em" }}
          className="view_btn btn1"
          href={`${lang}/parentcraft-chatroom`}
          target="_blank"
        >
          Speaker Chatroom
        </Link>
        <Link
          style={{ marginLeft: "1em" }}
          className="view_btn btn1"
          href={`${lang}/chatlog`}
        >
          Chat Log
        </Link>
      </div>
      <div className="modules parentcraft_modules">
        <ParentcraftContextProvider>
          <AdminSlides />
        </ParentcraftContextProvider>
      </div>
    </div>
  );
}

export default Parentcraft;
