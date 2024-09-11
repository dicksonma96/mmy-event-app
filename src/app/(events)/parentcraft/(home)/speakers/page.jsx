import React from "react";

function Speakers() {
  const speakers = [
    {
      name: "Dr Dickson",
      title: "Obstetrics & Gynaecologist",
      place: "Tung Shin Hospital",
      img: "https://img.freepik.com/premium-vector/gallery-icon-picture-landscape-vector-sign-symbol_660702-224.jpg",
    },
    {
      name: "Dr Dickson",
      title: "Obstetrics & Gynaecologist",
      place: "Tung Shin Hospital",
      img: "https://img.freepik.com/premium-vector/gallery-icon-picture-landscape-vector-sign-symbol_660702-224.jpg",
    },
    {
      name: "Dr Dickson",
      title: "Obstetrics & Gynaecologist",
      place: "Tung Shin Hospital",
      img: "https://img.freepik.com/premium-vector/gallery-icon-picture-landscape-vector-sign-symbol_660702-224.jpg",
    },
  ];

  return (
    <>
      <div className="section_title">SPEAKERS TODAY</div>
      <div className="speaker_list col">
        {speakers.map((speaker, index) => (
          <div key={index} className="speaker row">
            <img src={speaker.img} alt="" />
            <div className="text col">
              <h2>{speaker.name}</h2>
              <p>{speaker.title}</p>
              <p>{speaker.place}</p>
            </div>
          </div>
        ))}
      </div>
      <br />
      <div className="section_title">OUR SPONSORS</div>
    </>
  );
}

export default Speakers;
