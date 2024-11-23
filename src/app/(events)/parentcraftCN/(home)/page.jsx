import convertTo12Hour from "@/lib/convertTo12Hour";
import getDatabase from "@/lib/mongo/mongoConnection";
import { unstable_noStore as noStore } from "next/cache";
import Error from "./Error";

async function Agenda() {
  try {
    noStore();
    const db = await getDatabase();
    const collection = db.collection("event_config");

    const data = await collection
      .aggregate([
        {
          $match: { event: "parentcraftCN" }, // Filter for the specific event
        },
        {
          $lookup: {
            from: "parentcraftCN-agenda", // The collection to join with
            localField: "agenda", // The field in event_config to match against parentcraft-agenda
            foreignField: "_id", // The field in parentcraft-agenda
            as: "agenda", // The name of the new array field to store the joined info
          },
        },
        {
          $unwind: {
            path: "$agenda", // The field to unwind
            preserveNullAndEmptyArrays: true, // Optional: preserves documents without matching agendaDetails
          },
        },
      ])
      .toArray();

    return (
      <>
        <div className="section_title">今日流程</div>
        <div className="agenda_list col">
          {data[0]?.agenda?.agendas?.map((agenda, index) => (
            <div key={index} className="agenda col">
              <div className="time row">
                <span>{convertTo12Hour(agenda.time_start)}</span>-
                <span>{convertTo12Hour(agenda.time_end)}</span>
              </div>
              <h2>{agenda.agenda}</h2>
              <p>{agenda.description}</p>
            </div>
          ))}
        </div>
      </>
    );
  } catch {
    return <Error />;
  }
}

export default Agenda;
