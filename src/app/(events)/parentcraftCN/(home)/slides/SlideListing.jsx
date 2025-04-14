"use client";
import React, { useState } from "react";

function SlideListing({ data }) {
  const [slideUrl, setSlideUrl] = useState(null);
  return (
    <>
      {slideUrl && (
        <div className="overlay_modal slide_modal col">
          <iframe
            allowfullscreen="true"
            src={slideUrl}
            frameBorder={0}
          ></iframe>
          <span
            className="material-symbols-outlined close_btn"
            onClick={() => {
              setSlideUrl(null);
            }}
          >
            close
          </span>
        </div>
      )}

      <div className="slides_list col">
        {data?.speaker_slides.map((item, index) => {
          return (
            <div
              key={index}
              className="slide_item row"
              onClick={() => setSlideUrl(item.slides_url)}
            >
              {item.slides_name}
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default SlideListing;
