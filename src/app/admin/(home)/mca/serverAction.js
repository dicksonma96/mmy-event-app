"use server";
import getDatabase from "@/lib/mongo/mongoConnection";

export async function GetEventInfo() {
  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  const event = await eventConfig.findOne({ event: "mca" });
  if (!event) {
    return { success: false, message: "No event found" };
  }

  const { status, guests, quiz1, quiz2, winner } = event;

  const data = { status, guests, quiz1, quiz2, winner };
  return { success: true, data: data };
}

export async function AddGuest({ name, seat, brand }) {
  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  // Optional: Check for duplicate seat
  const event = await eventConfig.findOne({ event: "mca" });
  if (!event) return { success: false, message: "Event not found" };

  const exists = event.guests.some((g) => g.seat == seat);
  if (exists) {
    return { success: false, message: "Seat already taken" };
  }

  const newGuest = {
    name,
    seat,
    brand,
    quiz1: null,
    quiz2: null,
  };

  const result = await eventConfig.updateOne(
    { event: "mca" },
    { $push: { guests: newGuest } }
  );

  if (result.modifiedCount === 1) {
    return { success: true, message: "Guest added successfully" };
  } else {
    return { success: false, message: "Failed to add guest" };
  }
}

export async function EditGuest({ seat, updatedFields }) {
  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  const event = await eventConfig.findOne({ event: "mca" });
  if (!event) {
    return { success: false, message: "Event not found" };
  }

  const guestIndex = event.guests.findIndex((g) => g.seat === seat);
  if (guestIndex === -1) {
    return { success: false, message: "Guest not found" };
  }

  const updatePath = Object.entries(updatedFields).reduce(
    (acc, [key, value]) => {
      acc[`guests.${guestIndex}.${key}`] = value;
      return acc;
    },
    {}
  );

  const result = await eventConfig.updateOne(
    { event: "mca" },
    { $set: updatePath }
  );

  if (result.modifiedCount === 1) {
    return { success: true, message: "Guest updated successfully" };
  } else {
    return { success: false, message: "No changes were made" };
  }
}
