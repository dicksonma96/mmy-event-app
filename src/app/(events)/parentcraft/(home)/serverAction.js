"use server";
import getDatabase from "@/lib/mongo/mongoConnection";

export async function GetSpeakerSlides(lang = "eng") {
  const eventLang = {
    eng: "parentcraft",
    cn: "parentcraftCN",
  };

  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  const event = await eventConfig.findOne({ event: eventLang[lang] });

  if (!event) {
    return { success: false, message: "No active event found" };
  }

  const { speaker_slides } = event;

  const data = {
    speaker_slides,
  };

  return { success: true, data };
}
