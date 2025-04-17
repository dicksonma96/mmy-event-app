"use client";
import React, { useState, useEffect } from "react";
import { getSpeakerSlides, updateSpeakerSlides } from "./serverAction";
import ErrorModule from "../ErrorModule";
function AdminSlides() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetData();
  }, []);

  const GetData = async () => {
    try {
      setLoading(true);
      let res = await getSpeakerSlides();
      if (!res.success) throw res.message;

      setData(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const slidesTemplate = {
      slides_name: "",
      slides_url: "",
    };
    setData((prev) => [...prev, slidesTemplate]);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let res = await updateSpeakerSlides(data);
      if (!res.success) throw res.message;

      GetData();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module speaker_slide col">
      {error ? (
        <ErrorModule
          error={error}
          retryFunc={() => {
            setError(null);
            setLoading(false);
          }}
        />
      ) : (
        <>
          {loading ? (
            <div className="module_loading">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <div className="module_header row">
                <h2>SPEAKER'S SLIDES</h2>
                <div
                  onClick={handleUpdate}
                  className="btn1"
                  style={{ marginLeft: "auto" }}
                >
                  UPDATE
                </div>
                <div
                  onClick={handleAdd}
                  className="btn1"
                  style={{ marginLeft: "0.5em" }}
                >
                  ADD SLIDES
                </div>
              </div>
              <form className="col admin_form">
                {data.map((item, index) => (
                  <div key={index} className="speaker_slide_item col">
                    <div
                      className="remove"
                      onClick={() => {
                        setData((prev) => prev.filter((itm, i) => i != index));
                      }}
                    >
                      &#215;
                    </div>
                    <div className="number">Slides {index + 1}</div>
                    <div className="input col">
                      <span className="label">SLIDES NAME</span>
                      <input
                        type="text"
                        value={item.slides_name}
                        onChange={(e) => {
                          setData((prev) =>
                            prev.map((itm, i) => {
                              if (index == i) {
                                return {
                                  ...itm,
                                  slides_name: e.target.value,
                                };
                              }
                              return itm;
                            })
                          );
                        }}
                        required
                      />
                    </div>

                    <div className="input col">
                      <span className="label">
                        SLIDES URL{" "}
                        <em
                          style={{ fontSize: "10px" }}
                        >{`(OneDrive > Your PPT File > File > Share > Manage Access > Links Tab > Copy)`}</em>
                      </span>
                      <input
                        type="text"
                        value={item.slides_url}
                        onChange={(e) => {
                          let input = e.target.value;

                          if (input.includes("docs.google.com")) {
                            input = input.replace(/edit.*$/, "embed");
                          }

                          if (input.includes("<iframe")) {
                            input = input.match(
                              /<iframe[^>]+src=["']([^"']+)["']/i
                            )[1];
                          }

                          setData((prev) =>
                            prev.map((itm, i) => {
                              if (index == i) {
                                return {
                                  ...itm,
                                  slides_url: input,
                                };
                              }
                              return itm;
                            })
                          );
                        }}
                        required
                      />
                    </div>
                  </div>
                ))}
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminSlides;
