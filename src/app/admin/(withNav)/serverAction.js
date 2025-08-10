"use server";
import getDatabase from "@/lib/mongo/mongoConnection";
import { ObjectId } from "mongodb";

export async function getConfig() {
  const db = await getDatabase();
  const collection = db.collection("event_config");
  const data = await collection.find({}).toArray();
  let return_data = JSON.parse(JSON.stringify(data));
  return {
    success: true,
    data: return_data,
  };
}

export async function setActive(event, target, flag) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("event_config");
    await collection.updateOne(
      {
        event: event,
      },
      {
        $set: {
          [target]: flag,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
