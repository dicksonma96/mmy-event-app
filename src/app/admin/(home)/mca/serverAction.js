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

export async function AddGuest(info) {
  try {
    const db = await getDatabase();
    const result = await db.collection("event_config").updateOne(
      { event: "mca" },
      {
        $push: {
          guests: {
            ...info,
            quiz1: [],
            quiz2: [],
          },
        },
      }
    );

    return result.modifiedCount == 1
      ? { success: true, message: "Successfully added" }
      : { success: false, message: "Failed to add guest" };
  } catch (e) {
    console.error("AddGuest error:", e);
    return { success: false, message: e.message || "Unexpected error" };
  }
}

export async function UpdateGuest({ seat, name, updatedFields }) {
  const db = await getDatabase();
  const eventConfig = await db.collection("event_config");

  const event = await eventConfig.findOne({ event: "mca" });
  if (!event) {
    return { success: false, message: "Event not found" };
  }

  const guestIndex = event.guests.findIndex(
    (g) => g.seat == seat && g.name == name
  );
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

  if (result.modifiedCount == 1) {
    return { success: true, message: "Guest updated successfully" };
  } else {
    return { success: false, message: "No changes were made" };
  }
}

export async function DeleteGuest({ seat, name }) {
  try {
    const db = await getDatabase();
    const eventConfig = db.collection("event_config");

    const result = await eventConfig.updateOne(
      { event: "mca" },
      { $pull: { guests: { seat, name } } }
    );

    if (result.modifiedCount === 1) {
      return { success: true, message: "Guest deleted successfully" };
    } else {
      return { success: false, message: "Guest not found or already deleted" };
    }
  } catch (e) {
    console.error("DeleteGuest error:", e);
    return { success: false, message: e.message || "Failed to delete guest" };
  }
}

export async function UpdateEventStatus(status) {
  try {
    const db = await getDatabase();
    const eventConfig = db.collection("event_config");

    const result = await eventConfig.updateOne(
      { event: "mca" },
      { $set: { status } }
    );

    if (result.modifiedCount === 1) {
      return { success: true, message: `Status updated to "${status}"` };
    } else {
      return { success: false, message: "No change made or event not found" };
    }
  } catch (e) {
    console.error("UpdateEventStatus error:", e);
    return { success: false, message: e.message || "Failed to update status" };
  }
}
