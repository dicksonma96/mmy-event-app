// import getDatabase from "@/lib/mongo/mongoConnection";
async function Agenda() {
  // const db = await getDatabase();
  // const collection = db.collection("parentcraft-agenda");
  // const data = await collection.find({}).toArray();
  // console.log(data);

  const agendas = [
    {
      agenda: "Arrival & Registration",
      desc: "Refreshment served upon arrival. Guests directed to their seats.",
      startTime: "08:30AM",
      endTime: "09:00AM",
    },
    {
      agenda: "Arrival & Registration 2",
      desc: "Refreshment served upon arrival. Guests directed to their seats.",
      startTime: "08:30AM",
      endTime: "09:00AM",
    },
    {
      agenda: "Arrival & Registration",
      desc: "Refreshment served upon arrival. Guests directed to their seats.",
      startTime: "08:30AM",
      endTime: "09:00AM",
    },
    {
      agenda: "Arrival & Registration",
      desc: "Refreshment served upon arrival. Guests directed to their seats.",
      startTime: "08:30AM",
      endTime: "09:00AM",
    },
    {
      agenda: "Arrival & Registration",
      desc: "Refreshment served upon arrival. Guests directed to their seats.",
      startTime: "08:30AM",
      endTime: "09:00AM",
    },
    {
      agenda: "Arrival & Registration",
      desc: "Refreshment served upon arrival. Guests directed to their seats.",
      startTime: "08:30AM",
      endTime: "09:00AM",
    },
  ];

  return (
    <>
      <div className="section_title">TODAY'S AGENDA</div>
      <div className="agenda_list col">
        {agendas.map((agenda, index) => (
          <div key={index} className="agenda col">
            <div className="time row">
              <span>{agenda.startTime}</span>-<span>{agenda.endTime}</span>
            </div>
            <h2>{agenda.agenda}</h2>
            <p>{agenda.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Agenda;
