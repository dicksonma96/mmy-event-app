"use server";
import getDatabase from "@/lib/mongo/mongoConnection";

export async function GetEventInfo(seatInfo = null) {
  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  const event = await eventConfig.findOne({ event: "mca" });
  if (!event) {
    return { success: false, message: "No active event found" };
  }

  const { status } = event;

  const quiz1Filtered = event.quiz1?.map((q) => {
    const { answer, ...rest } = q;
    return status == "ended" ? q : rest;
  });

  const quiz2Filtered = event.quiz2?.map((q) => {
    const { answer, ...rest } = q;
    return status == "ended" ? q : rest;
  });

  let me = null;

  if (seatInfo !== null) {
    const guest = event.guests.find((g) => g.seat == seatInfo);
    if (!guest) {
      return { success: false, message: "Guest not found for this seat" };
    }

    const { name, seat, brand, quiz1, quiz2 } = guest;
    me = { name, seat, brand, quiz1, quiz2 };
  }

  const data = {
    me,
    status,
    quiz1: quiz1Filtered,
    quiz2: quiz2Filtered,
    winner: status === "ended" ? event.winner : null,
  };

  return { success: true, data };
}

export async function SubmitQuizAnswers(seat, quizNo = 1, answer = []) {
  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  // Fetch the event
  const event = await eventConfig.findOne({ event: "mca" });
  if (!event) return { success: false, message: "Event not found" };

  if (event.status == "ended") {
    return { success: false, message: "Quiz submission is closed" };
  }

  // Find the index of the guest
  const guestIndex = event.guests.findIndex((g) => g.seat == seat);

  console.log(seat);

  if (guestIndex == -1) {
    return { success: false, message: "Guest not found" };
  }

  const guest = event.guests[guestIndex];

  // 🚫 Check if already submitted
  const alreadySubmitted = (guest[`quiz${quizNo}`]?.length ?? 0) > 0;
  if (alreadySubmitted) {
    return { success: false, message: "Quiz already submitted" };
  }

  const updateFields = {};
  if (answer.length > 0)
    updateFields[`guests.${guestIndex}.quiz${quizNo}`] = answer;

  // Update the guest's quiz answers
  const updateResult = await eventConfig.updateOne(
    { event: "mca" },
    { $set: updateFields }
  );

  if (updateResult.modifiedCount == 1) {
    return { success: true, message: "Quiz answers submitted successfully" };
  } else {
    return { success: false, message: "No changes were made" };
  }
}
