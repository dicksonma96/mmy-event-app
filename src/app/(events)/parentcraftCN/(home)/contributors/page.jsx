import React from "react";
import convertTo12Hour from "@/lib/convertTo12Hour";
import getDatabase from "@/lib/mongo/mongoConnection";
import { not_found_img } from "@/lib/constant";
import { unstable_noStore as noStore } from "next/cache";
import Error from "../Error";
import PageLoading from "../../component/PageLoading";

async function Contributors() {
  try {
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
            path: "$agenda", // Unwind the agendaDetails array
            preserveNullAndEmptyArrays: true, // Optional: preserves documents without matching agendaDetails
          },
        },
        {
          $lookup: {
            from: "parentcraftCN-speakers", // The collection to join with (speakers)
            localField: "agenda.speakers", // The field in parentcraftCN-agenda (array of speaker ObjectIds)
            foreignField: "_id", // The field in speakers collection (the _id field)
            as: "agenda.speakers", // The name of the new array field to store the speaker info
          },
        },
        {
          $lookup: {
            from: "parentcraftCN-sponsors", // The collection to join with (speakers)
            localField: "agenda.sponsors", // The field in parentcraftCN-agenda (array of speaker ObjectIds)
            foreignField: "_id", // The field in speakers collection (the _id field)
            as: "agenda.sponsors", // The name of the new array field to store the speaker info
          },
        },
      ])
      .toArray();

    return (
      <>
        <div className="section_title">今日演讲者</div>
        <div className="speaker_list col">
          {data[0].agenda.speakers.map((speaker, index) => (
            <div key={index} className="speaker row">
              <img src={speaker.img_url || not_found_img} alt="" />
              <div className="text col">
                <h2>{speaker.name}</h2>
                <p>{speaker.specialist}</p>
                <p>{speaker.hospital}</p>
              </div>
            </div>
          ))}
        </div>
        <br />
        <div className="section_title">今日赞助</div>
        <div className="sponsors_list">
          {data[0].agenda.sponsors.map((sponsor, index) => (
            <div key={index} className="sponsor row">
              <img src={sponsor.img_url || not_found_img} alt="" />
            </div>
          ))}
        </div>
      </>
    );
  } catch (error) {
    return <Error />;
  }
}

export default Contributors;
