import React from "react";
import Carousel from "../../component/Slider";
import { unstable_noStore as noStore } from "next/cache";
import { not_found_img } from "@/lib/constant";
import getDatabase from "@/lib/mongo/mongoConnection";

async function Events() {
  noStore();
  const db = await getDatabase();
  const collection = db.collection("parentcraft-sliders");

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
}

export default Events;
