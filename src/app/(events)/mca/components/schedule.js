"use client";

import agenda from "../agenda.js";

function Schedule() {
  return (
    <div className="agenda_listing col">
      {agenda.map((agenda, index) => (
        <div className="agenda row" key={index}>
          <div className="time">{agenda?.time}</div>
          <div className="col">
            <strong className="color1">{agenda?.agenda}</strong>
            <ul>
              {agenda?.description?.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Schedule;
