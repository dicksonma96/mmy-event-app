import React from "react";
import Banner from "@/assets/img/parentcraft/banner.jpg";
import Image from "next/image";
import getDatabase from "@/lib/mongo/mongoConnection";
import { unstable_noStore as noStore } from "next/cache";

async function HomeBanner() {
  noStore();
  const db = await getDatabase();
  const collection = db.collection("event_config");

  const data = await collection
    .aggregate([
      {
        $match: { event: "parentcraftCN" }, // Filter for the specific event
      },
      {
        $lookup: {
          from: "parentcraftCN-agenda", // The collection to join with
          localField: "agenda", // The field in event_config to match against parentcraftCN-agenda
          foreignField: "_id", // The field in parentcraftCN-agenda
          as: "agenda", // The name of the new array field to store the joined info
        },
      },
      {
        $unwind: {
          path: "$agenda", // The field to unwind
          preserveNullAndEmptyArrays: true, // Optional: preserves documents without matching agendaDetails
        },
      },
    ])
    .toArray();

  return (
    <div className="banner">
      <div className="info col">
        <h3>欢迎来到</h3>
        <h2>新手爸妈必备班</h2>
        <div className="date">{data[0]?.agenda?.name}</div>
      </div>
      <Image src={Banner} alt="parentcraftCN banner" />
    </div>
  );
}

export default HomeBanner;
