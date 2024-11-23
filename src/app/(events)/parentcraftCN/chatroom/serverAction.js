"use server";
import getDatabase from "@/lib/mongo/mongoConnection";

// Server-side action callable by the client
export async function SaveMessage(messageInfo) {
  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  const currentWorkshop = await eventConfig.findOne({ event: "parentcraftCN" });
  if (currentWorkshop == null || currentWorkshop?.agenda == null)
    return { success: false, message: "No active workshop found" };

  const collection = await db.collection("parentcraftCN-chatlog");
  if (!messageInfo || messageInfo.message == "") {
    return { success: false, message: "Message content is required" };
  }
  const result = await collection.updateOne(
    { workshop_id: currentWorkshop.agenda },
    { $push: { messages: messageInfo } },
    {
      upsert: true,
    }
  );
  if (result.matchedCount === 0) {
    if (result.upsertedCount === 0)
      return { success: false, message: "Failed to send message" };
  }

  return { success: true };
}
