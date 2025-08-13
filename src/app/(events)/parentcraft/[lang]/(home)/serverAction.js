"use server";
import getDatabase from "@/lib/mongo/mongoConnection";

export async function GetSpeakerSlides(lang = "eng") {
  const eventLang = {
    eng: "parentcraft",
    cn: "parentcraftCN",
    bm: "parentcraftBM",
  };

  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  const event = await eventConfig.findOne({ event: eventLang[lang] });

  if (!event) {
    return { success: false, message: "No active event found" };
  }

  const { disable_client_slides, speaker_slides } = event;

  const data = {
    disable_client_slides,
    speaker_slides,
  };

  return { success: true, data };
}
