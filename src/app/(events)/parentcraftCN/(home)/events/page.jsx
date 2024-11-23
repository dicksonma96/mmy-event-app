import React from "react";
import Carousel from "../../component/Slider";
import { unstable_noStore as noStore } from "next/cache";
import getDatabase from "@/lib/mongo/mongoConnection";
import Error from "../Error";

async function Events() {
  try {
    noStore();
    const db = await getDatabase();
    const collection = db.collection("parentcraftCN-sliders");

    const banners = await collection.find({}).toArray();
    return (
      <>
        {banners
          .sort((a, b) => a.order - b.order)
          .map((info, index) => (
            <Carousel key={index} info={info} />
          ))}
      </>
    );
  } catch (error) {
    return <Error />;
  }
}

export default Events;
