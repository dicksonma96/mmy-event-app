import React from "react";
import getDatabase from "@/lib/mongo/mongoConnection";
import { unstable_noStore as noStore } from "next/cache";
import Error from "../Error";
import PageLoading from "../../component/PageLoading";
import SlideListing from "./SlideListing";

async function Slides() {
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
      <>
        <div className="section_title">今日演示文稿</div>
        {data[0].disable_client_slides ? (
          <div className="page_loader row">
            <span style={{ margin: "auto", fontSize: "1em" }}>敬请关注...</span>
          </div>
        ) : (
          <SlideListing data={data[0]} />
        )}
      </>
    );
  } catch (error) {
    return <Error />;
  }
}

export default Slides;
