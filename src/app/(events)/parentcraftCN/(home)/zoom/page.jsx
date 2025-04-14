import ZOOM_ILLUSTRATION from "@/assets/img/parentcraft/zoom_logo.png";
import Image from "next/image";
import React from "react";
import getDatabase from "@/lib/mongo/mongoConnection";
import { unstable_noStore as noStore } from "next/cache";
import Error from "../Error";

async function Zoom() {
  try {
    noStore();
    const db = await getDatabase();
    const collection = db.collection("event_config");

    const data = await collection
      .aggregate([
        {
          $match: { event: "parentcraftCN" }, // Filter for the specific event
        },
      ])
      .toArray();

    return (
      <div className="zoom col">
        <Image src={ZOOM_ILLUSTRATION} />
        <span style={{ fontSize: "1.25em" }}>加入我们的</span>
        <strong>ZOOM 线上会议</strong>
        {data[0].zoom.online ? (
          <a className="zoom_link" href={data[0].zoom.url} target="_blank">
            {data[0].zoom.url}
          </a>
        ) : (
          <span className="zoom_link">敬请关注</span>
        )}
      </div>
    );
  } catch (error) {
    return <Error />;
  }
}

export default Zoom;
