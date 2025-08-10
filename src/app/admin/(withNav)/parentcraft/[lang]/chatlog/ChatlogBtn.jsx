"use client";
import React from "react";
import { mongoDateToObject } from "@/lib/mongoDateToObject";
import downloadCSV from "@/lib/downloadCSV";

function ChatlogBtn({ info }) {
  return (
    <div className="chatlog_item col">
      <strong>{info.date}</strong>
      <div
        className="download_btn row"
        onClick={() => {
          downloadCSV(info.messages, info.workshop.name);
        }}
      >
        Download CSV
        <span className="material-symbols-outlined">download</span>
      </div>
    </div>
  );
}

export default ChatlogBtn;
