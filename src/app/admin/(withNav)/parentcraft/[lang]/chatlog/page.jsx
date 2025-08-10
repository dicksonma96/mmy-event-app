import React from "react";
import Link from "next/link";
import ErrorModule from "../../../ErrorModule";
import getDatabase from "@/lib/mongo/mongoConnection";
import { unstable_noStore as noStore } from "next/cache";
import ChatlogBtn from "./ChatlogBtn";

async function Chatlog({ params }) {
  const { lang } = params;
  const chatLogDoc = {
    eng: "parentcraft-chatlog",
    cn: "parentcraftCN-chatlog",
    bm: "parentcraftBM-chatlog",
  };

  try {
    noStore();
    const db = await getDatabase();
    const collection = db.collection(chatLogDoc[lang] || "parentcraft-chatlog");

    const data = await collection.find({}).toArray();
    console.log(data);
    return (
      <div className="admin_content col">
        <div className="admin_header row" style={{ alignItems: "center" }}>
          <Link
            href={"/admin/parentcraft"}
            style={{ marginRight: "10px", color: "black" }}
          >
            <span
              class="material-symbols-outlined"
              style={{
                fontSize: "30px",
              }}
            >
              arrow_back
            </span>
          </Link>
          <div className="title">PARENTCRAFT CHATLOG</div>
        </div>
        <div className="chatlog_list">
          {data.map((item, index) => {
            return <ChatlogBtn key={index} info={item} />;
          })}
        </div>
      </div>
    );
  } catch (e) {
    console.log(e);
    return <ErrorModule />;
  }
}

export default Chatlog;
