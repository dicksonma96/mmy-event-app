"use server";
import getDatabase from "@/lib/mongo/mongoConnection";
import { ObjectId } from "mongodb";
import * as Ably from "ably";
import { PARENTCRAFT_ABLY_CHAT_CHANNEL } from "@/lib/constant";
//--------------Workshops---------------------------

async function clearChannelHistory() {
  const channelName = PARENTCRAFT_ABLY_CHAT_CHANNEL;
  const ably = new Ably.Rest(process.env.ABLY_API);
  const channel = ably.channels.get(channelName);
  try {
    // Step 1: Retrieve message history
    const history = await channel.history({ limit: 20 });
    if (history.items.length > 0) {
      console.log(history.items);
      // Step 2: Overwrite messages with a placeholder (this won't truly delete them)
      await channel.publish("history-cleared", {
        message: "Previous messages have been cleared.",
        timestamp: new Date(),
      });
    } else {
      console.log("No message history found to clear.");
    }
  } catch (error) {
    console.error("Error clearing history:", error);
  }
}

export async function getConfig() {
  const db = await getDatabase();
  const collection = db.collection("event_config");
  const data = await collection
    .aggregate([
      {
        $match: {
          event: { $eq: "parentcraft" },
        },
      },
      {
        $lookup: {
          from: "parentcraft-agenda",
          localField: "agenda",
          foreignField: "_id",
          as: "agenda",
        },
      },
      {
        $unwind: "$agenda",
      },
      {
        $lookup: {
          from: "parentcraft-speakers",
          localField: "agenda.speakers",
          foreignField: "_id",
          as: "agenda.speakers",
        },
      },
    ])
    .toArray();
  let return_data = JSON.parse(JSON.stringify(data));
  return return_data[0];
}

export async function setActive(input) {
  try {
    const db = await getDatabase();
    let id = input._id;
    if (id == null) {
      throw "Id not found";
    }
    const collection = await db.collection("event_config");
    let data = await collection.updateOne(
      {
        event: "parentcraft",
      },
      {
        $set: {
          agenda: ObjectId.createFromHexString(input._id),
        },
      }
    );
    await clearChannelHistory();
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getAgenda(query) {
  try {
    const entries = 5;
    const db = await getDatabase();
    const collection = db.collection("parentcraft-agenda");

    const filter = {};
    const totalDocuments = await collection.countDocuments(filter);

    const activeAgenda = await getConfig();
    const activeAgendaId = activeAgenda?.agenda?._id || null;
    const activeAgendaIdObject = activeAgendaId
      ? ObjectId.createFromHexString(activeAgendaId)
      : null;

    const data = await collection
      .aggregate([
        // {
        //   $match: {
        //     _id: { $ne: ObjectId.createFromHexString(activeAgendaId) },
        //   },
        // },
        {
          $lookup: {
            from: "parentcraft-speakers", // The collection to join with (speakers)
            localField: "speakers", // The field in parentcraft-agenda (array of speaker ObjectIds)
            foreignField: "_id", // The field in speakers collection (the _id field)
            as: "speakers", // The name of the new array field to store the speaker info
          },
        },
        {
          $lookup: {
            from: "parentcraft-sponsors", // The collection to join with (speakers)
            localField: "sponsors", // The field in parentcraft-agenda (array of speaker ObjectIds)
            foreignField: "_id", // The field in speakers collection (the _id field)
            as: "sponsors", // The name of the new array field to store the speaker info
          },
        },
        {
          $addFields: {
            isActiveAgenda: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [activeAgendaId, null] },
                    {
                      $eq: ["$_id", activeAgendaIdObject],
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
        {
          $sort: {
            isActiveAgenda: -1, // Sort the active agenda first
            date: -1, // Then sort the remaining documents by date
          },
        },
      ])
      .skip(entries * (query.page - 1))
      .limit(entries)
      .toArray();

    let return_data = JSON.parse(
      JSON.stringify({
        data: data,
        totalDocs: totalDocuments,
        totalPage: Math.ceil(totalDocuments / entries),
        currentPage: query.page,
      })
    );
    return { data: return_data, success: true };
  } catch (e) {
    return { message: e.message, success: false };
  }
}

export async function getSpeakersOptions() {
  try {
    const db = await getDatabase();
    const collection = db.collection("parentcraft-speakers");
    const filter = {};
    const data = await collection.find(filter).toArray();
    let return_data = JSON.parse(JSON.stringify(data));
    return { data: return_data, success: true };
  } catch (e) {
    return { message: e.message, success: false };
  }
}

export async function getSponsorsOptions() {
  try {
    const db = await getDatabase();
    const collection = db.collection("parentcraft-sponsors");
    const filter = {};
    const data = await collection.find(filter).toArray();
    let return_data = JSON.parse(JSON.stringify(data));
    return { data: return_data, success: true };
  } catch (e) {
    return { message: e.message, success: false };
  }
}

export async function saveAgenda(input) {
  try {
    const db = await getDatabase();
    let id = input._id;
    let filter;
    if (id && id.length === 24) {
      filter = { _id: ObjectId.createFromHexString(id) };
    } else {
      filter = { _id: new ObjectId() };
    }
    const collection = await db.collection("parentcraft-agenda");
    let data = await collection.updateOne(
      filter,
      {
        $set: {
          name: input.name,
          date: input.date,
          speakers: input.speakers.map((item) =>
            ObjectId.createFromHexString(item._id)
          ),
          sponsors: input.sponsors.map((item) =>
            ObjectId.createFromHexString(item._id)
          ),
          agendas: input.agendas,
        },
      },
      {
        upsert: true,
      }
    );
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

export async function deleteAgenda(input) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("parentcraft-agenda");
    let data = await collection.deleteOne({
      _id: ObjectId.createFromHexString(input._id),
    });
    if (data.modifiedCount == 0) throw "Delete failed";

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//-----------Contributors, Speakers and Sponsors---------------------------------------------

export async function getSpeakers(query) {
  try {
    const entries = 5;
    const db = await getDatabase();
    const collection = db.collection("parentcraft-speakers");

    const filter = {};
    const totalDocuments = await collection.countDocuments(filter);

    const data = await collection
      .find(filter)
      .skip(entries * (query.page - 1))
      .limit(entries)
      .toArray();

    let return_data = JSON.parse(
      JSON.stringify({
        data: data,
        totalDocs: totalDocuments,
        totalPage: Math.ceil(totalDocuments / entries),
        currentPage: query.page,
      })
    );

    return { data: return_data, success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateSpeaker(input) {
  try {
    const db = await getDatabase();
    let id = input._id;
    let filter;
    if (id && id.length === 24) {
      filter = { _id: ObjectId.createFromHexString(id) };
    } else {
      filter = { _id: new ObjectId() };
    }
    const collection = await db.collection("parentcraft-speakers");
    let data = await collection.updateOne(
      filter,
      {
        $set: {
          name: input.name,
          specialist: input.specialist,
          hospital: input.hospital,
          img_url: input.img_url,
        },
      },
      {
        upsert: true,
      }
    );
    return { success: true };
  } catch (e) {
    return { success: false, message: error.message };
  }
}

export async function deleteSpeaker(input) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("parentcraft-speakers");
    let data = await collection.deleteOne({
      _id: ObjectId.createFromHexString(input._id),
    });
    if (data.modifiedCount == 0) throw "Delete failed";
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function getSponsors(query) {
  try {
    const entries = 5;
    const db = await getDatabase();
    const collection = db.collection("parentcraft-sponsors");

    const filter = {};
    const totalDocuments = await collection.countDocuments(filter);

    const data = await collection
      .find(filter)
      .skip(entries * (query.page - 1))
      .limit(entries)
      .toArray();

    let return_data = JSON.parse(
      JSON.stringify({
        data: data,
        totalDocs: totalDocuments,
        totalPage: Math.ceil(totalDocuments / entries),
        currentPage: query.page,
      })
    );
    return { success: true, data: return_data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateSponsor(input) {
  try {
    const db = await getDatabase();
    let id = input._id;
    let filter;
    if (id && id.length === 24) {
      filter = { _id: ObjectId.createFromHexString(id) };
    } else {
      filter = { _id: new ObjectId() };
    }
    const collection = await db.collection("parentcraft-sponsors");
    let data = await collection.updateOne(
      filter,
      {
        $set: {
          name: input.name,
          img_url: input.img_url,
        },
      },
      {
        upsert: true,
      }
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteSponsor(input) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("parentcraft-sponsors");
    let data = await collection.deleteOne({
      _id: ObjectId.createFromHexString(input._id),
    });
    if (data.modifiedCount == 0) throw "Delete failed";

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//----Events Slider-----

export async function getSlider() {
  try {
    const db = await getDatabase();
    const collection = db.collection("parentcraft-sliders");

    const filter = {};

    const data = await collection
      .find(filter)
      .sort({
        order: 1,
      })
      .toArray();
    let return_data = JSON.parse(JSON.stringify(data));

    return { success: true, data: return_data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateSliderPosition(sortedData) {
  try {
    const db = await getDatabase();
    const collection = db.collection("parentcraft-sliders");

    const bulkOperations = sortedData.map((item) => ({
      updateOne: {
        filter: { _id: ObjectId.createFromHexString(item._id) }, // Match by _id
        update: { $set: { order: item.order } }, // Update the order field
      },
    }));

    let data = await collection.bulkWrite(bulkOperations);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateSlider(input) {
  try {
    const db = await getDatabase();
    let id = input._id;
    let filter;
    if (id && id.length === 24) {
      filter = { _id: ObjectId.createFromHexString(id) };
    } else {
      filter = { _id: new ObjectId() };
    }
    const collection = await db.collection("parentcraft-sliders");
    let data = await collection.updateOne(
      filter,
      {
        $set: {
          title: input.title,
          order: input.order,
          layout: input.layout,
          showTitle: input.showTitle,
          banners: input.banners,
        },
      },
      {
        upsert: true,
      }
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteSlider(input) {
  try {
    const db = await getDatabase();
    const collection = await db.collection("parentcraft-sliders");
    let data = await collection.deleteOne({
      _id: ObjectId.createFromHexString(input._id),
    });
    if (data.modifiedCount == 0) throw "Delete failed";

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

//-----Speaker Slides-------

export async function getSpeakerSlides() {
  try {
    const db = await getDatabase();
    const collection = db.collection("event_config");
    let data = await collection
      .aggregate([
        {
          $match: {
            event: { $eq: "parentcraft" },
          },
        },
        {
          $project: {
            speaker_slides: 1,
          },
        },
      ])
      .toArray();
    data = data[0].speaker_slides;
    let return_data = JSON.parse(JSON.stringify(data));

    return { success: true, data: return_data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateSpeakerSlides(input) {
  try {
    const db = await getDatabase();
    const collection = db.collection("event_config");
    const data = await collection.updateOne(
      {
        event: "parentcraft",
      },
      {
        $set: {
          speaker_slides: input,
        },
      }
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
