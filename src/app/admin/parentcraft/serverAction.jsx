"use server";
import getDatabase from "@/lib/mongo/mongoConnection";
import { ObjectId } from "mongodb";

//--------------Workshops---------------------------

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
  console.log(data);
}

export async function getAgenda(query) {
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

  return return_data;
}

export async function getSpeakersOptions() {
  const db = await getDatabase();
  const collection = db.collection("parentcraft-speakers");
  const filter = {};
  const data = await collection.find(filter).toArray();
  let return_data = JSON.parse(JSON.stringify(data));
  return return_data;
}

export async function getSponsorsOptions() {
  const db = await getDatabase();
  const collection = db.collection("parentcraft-sponsors");
  const filter = {};
  const data = await collection.find(filter).toArray();
  let return_data = JSON.parse(JSON.stringify(data));
  return return_data;
}

export async function saveAgenda(input) {
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
}

export async function deleteAgenda(input) {
  const db = await getDatabase();
  const collection = await db.collection("parentcraft-agenda");
  let data = await collection.deleteOne({
    _id: ObjectId.createFromHexString(input._id),
  });
  if (data.modifiedCount == 0) throw "Delete failed";
}

//-----------Contributors, Speakers and Sponsors---------------------------------------------

export async function getSpeakers(query) {
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

  return return_data;
}

export async function updateSpeaker(input) {
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
}

export async function deleteSpeaker(input) {
  const db = await getDatabase();
  const collection = await db.collection("parentcraft-speakers");
  let data = await collection.deleteOne({
    _id: ObjectId.createFromHexString(input._id),
  });
  if (data.modifiedCount == 0) throw "Delete failed";
}

export async function getSponsors(query) {
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

  return return_data;
}
