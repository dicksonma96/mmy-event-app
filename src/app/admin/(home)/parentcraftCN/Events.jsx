"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  getSlider,
  updateSliderPosition,
  updateSlider,
  deleteSlider,
} from "./serverAction";
import { Flipped, Flipper } from "react-flip-toolkit";
import { uid } from "uid";
import Image from "next/image";
import Layout1 from "@/assets/img/admin/layout1.png";
import Layout2 from "@/assets/img/admin/layout2.png";
import ErrorModule from "../ErrorModule";

function Events() {
  const [target, setTarget] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="events_module module">
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
          {target == null ? (
            <EventsListing
              setLoading={setLoading}
              setError={setError}
              setTarget={setTarget}
            />
          ) : (
            <EventsForm
              target={target}
              setError={setError}
              setTarget={setTarget}
              setLoading={setLoading}
            />
          )}
          {loading && (
            <div className="module_loading">
              <div className="loader"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EventsListing({ setTarget, setLoading, setError }) {
  const [data, setData] = useState([]);
  const [alterOrder, setAlterOrder] = useState(true);

  const GetData = async () => {
    try {
      setLoading(true);
      let res = await getSlider();
      if (!res.success) throw res.message;
      setData(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const sliderTemplate = {
    title: "",
    order: data.length,
    layout: 1,
    showTitle: true,
    banners: [],
  };

  useEffect(() => {
    setAlterOrder(false);
    GetData();
  }, []);

  const sortItem = (move, currentIndex) => {
    setAlterOrder(true);
    setData((prev) => {
      const currentOrder = [...prev];
      // Assuming you have a way to identify the selected agenda item

      if (currentIndex === -1) return prev; // No item is selected, return the previous state

      const newIndex = currentIndex + move;

      // Ensure the new index is within bounds
      if (newIndex >= 0 && newIndex < currentOrder.length) {
        // Swap the agenda item
        const temp = currentOrder[newIndex];
        currentOrder[newIndex] = currentOrder[currentIndex];
        currentOrder[currentIndex] = temp;
      }

      return currentOrder;
    });
  };

  const UpdateSlider = async () => {
    try {
      setLoading(true);
      let res = await updateSliderPosition(
        data.map((d, index) => ({
          ...d,
          order: index,
        }))
      );
      if (!res.success) throw res.message;
      setAlterOrder(false);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="module_header row">
        <h2>EVENT BANNERS</h2>
        <div
          onClick={() => setTarget(sliderTemplate)}
          className="btn1"
          style={{ marginLeft: "auto" }}
        >
          ADD SLIDER
        </div>
      </div>

      <div className="slider_listing col">
        {alterOrder && (
          <div className="btn2" onClick={UpdateSlider}>
            SAVE ORDER
          </div>
        )}

        <Flipper flipKey={data?.map((c) => c._id).join("-")}>
          <div className="listing col">
            {data?.map((item, index) => {
              let isLast = index == data.length - 1 ? true : false;
              return (
                <Flipped key={item._id} flipId={item._id}>
                  <div
                    className="slider_item row"
                    onClick={() => setTarget(item)}
                  >
                    <div className="sort_btn col">
                      <span
                        className={`material-symbols-outlined ${
                          index == 0 ? "disabled" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sortItem(-1, index);
                        }}
                      >
                        keyboard_arrow_up
                      </span>
                      <span
                        className={`material-symbols-outlined ${
                          isLast ? "disabled" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sortItem(1, index);
                        }}
                      >
                        keyboard_arrow_down
                      </span>
                    </div>
                    <strong>{item.title}</strong>

                    <span className="material-symbols-outlined right_icon">
                      chevron_right
                    </span>
                  </div>
                </Flipped>
              );
            })}
          </div>
        </Flipper>
      </div>
    </>
  );
}

function EventsForm({ setTarget, target, setLoading, setError }) {
  const formRef = useRef(null);
  const Layout = [
    {
      value: 1,
      img: Layout1,
    },
    {
      value: 2,
      img: Layout2,
    },
  ];

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let form = formRef.current;
      if (form.checkValidity()) {
        let res = await updateSlider(target);
        if (!res.success) throw res.message;
        setTarget(null);
      } else {
        form.reportValidity(); // This triggers the browser to display validation messages
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      let res = await deleteSlider(target);
      if (!res.success) throw res.message;
      setTarget(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const sortItem = (move, currentIndex) => {
    setTarget((prev) => {
      const currentItems = [...prev.banners]; // Make a copy of the agendas array
      // Assuming you have a way to identify the selected agenda item

      if (currentIndex === -1) return prev; // No item is selected, return the previous state

      const newIndex = currentIndex + move;

      // Ensure the new index is within bounds
      if (newIndex >= 0 && newIndex < currentItems.length) {
        // Swap the agenda item
        const temp = currentItems[newIndex];
        currentItems[newIndex] = currentItems[currentIndex];
        currentItems[currentIndex] = temp;
      }

      return {
        ...prev,
        banners: currentItems,
      };
    });
  };

  const addBanner = () => {
    const newBanner = {
      id: uid(),
      name: "",
      img: "",
      link: "",
    };

    setTarget((prev) => ({
      ...prev,
      banners: [...prev.banners, newBanner],
    }));
  };

  const removeBanner = (id) => {
    setTarget((prev) => ({
      ...prev,
      banners: prev.banners.filter((b) => b.id != id),
    }));
  };

  return (
    <>
      <div className="module_header row">
        <span
          className="material-symbols-outlined back_btn"
          onClick={() => {
            setTarget(null);
          }}
        >
          chevron_left
        </span>
        <h2 style={{ marginRight: "auto" }}>
          {target._id ? target.title : "Add New Banner"}
        </h2>

        {target._id && (
          <div
            className="delete_btn"
            style={{ marginRight: "1em" }}
            onClick={() => {
              let deleteConfirm = prompt(
                "Please type DELETE to complete the deletion"
              );
              if (
                deleteConfirm != null &&
                deleteConfirm.toLowerCase() == "delete"
              ) {
                handleDelete();
              } else {
                alert(
                  "Incorrect input. Please type DELETE to complete the deletion."
                );
              }
            }}
          >
            DELETE
          </div>
        )}

        <div className="btn1" onClick={handleUpdate}>
          UPDATE
        </div>
      </div>
      <form ref={formRef} className="admin_form">
        <div className="input col">
          <span className="label">SLIDER NAME</span>
          <input
            type="text"
            value={target.title}
            onChange={(e) => {
              setTarget((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            required
          />
        </div>
        <label className="checkbox row">
          <input
            type="checkbox"
            checked={target.showTitle}
            onChange={(e) => {
              setTarget((prev) => ({
                ...prev,
                showTitle: !prev.showTitle,
              }));
            }}
          />
          <span>SHOW TITLE</span>
        </label>

        <div className="layout_type row">
          {Layout.map((item, index) => (
            <label key={index} className="layout_item row">
              <input
                type="radio"
                value={item.value}
                checked={item.value == target.layout}
                onChange={(e) =>
                  setTarget((prev) => ({
                    ...prev,
                    layout: e.target.value,
                  }))
                }
              />
              <Image src={item.img} alt={item.value} />
            </label>
          ))}
        </div>

        <br />
        <div className="sort_listing col">
          <div className="sort_header">
            <h2>SLIDES</h2>
          </div>
          <br />
          <Flipper flipKey={target.banners.map((b) => b.id).join("-")}>
            <div className="listing col">
              {target.banners.map((item, index) => {
                let isLast = index == target.banners.length - 1 ? true : false;
                return (
                  <Flipped key={item.id} flipId={item.id}>
                    <div className="banner_item row">
                      <div className="sort_btn col">
                        <span
                          className={`material-symbols-outlined ${
                            index == 0 ? "disabled" : ""
                          }`}
                          onClick={() => sortItem(-1, index)}
                        >
                          keyboard_arrow_up
                        </span>
                        <span
                          className={`material-symbols-outlined ${
                            isLast ? "disabled" : ""
                          }`}
                          onClick={() => sortItem(1, index)}
                        >
                          keyboard_arrow_down
                        </span>
                      </div>
                      <div className="banner_info col">
                        <div className="input col">
                          <span className="label">BANNER NAME</span>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              setTarget((prev) => ({
                                ...prev,
                                banners: prev.banners.map((i) => {
                                  if (i.id == item.id) {
                                    return {
                                      ...i,
                                      name: e.target.value,
                                    };
                                  }
                                  return i;
                                }),
                              }));
                            }}
                            required
                          />
                        </div>
                        <div className="input col">
                          <span className="label">BANNER IMG URL</span>
                          <input
                            type="text"
                            value={item.img}
                            onChange={(e) => {
                              setTarget((prev) => ({
                                ...prev,
                                banners: prev.banners.map((i) => {
                                  if (i.id == item.id) {
                                    return {
                                      ...i,
                                      img: e.target.value,
                                    };
                                  }
                                  return i;
                                }),
                              }));
                            }}
                            required
                          />
                        </div>
                        <div className="input col">
                          <span className="label">BANNER CLICK URL</span>
                          <input
                            type="text"
                            value={item.link}
                            onChange={(e) => {
                              setTarget((prev) => ({
                                ...prev,
                                banners: prev.banners.map((i) => {
                                  if (i.id == item.id) {
                                    return {
                                      ...i,
                                      link: e.target.value,
                                    };
                                  }
                                  return i;
                                }),
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div className="action row">
                        <span
                          onClick={() => removeBanner(item.id)}
                          className="material-symbols-outlined"
                        >
                          delete
                        </span>
                      </div>
                    </div>
                  </Flipped>
                );
              })}
            </div>
          </Flipper>
          <div
            onClick={addBanner}
            className="btn2"
            style={{ alignSelf: "flex-end" }}
          >
            ADD BANNER
          </div>
        </div>
      </form>
    </>
  );
}

export default Events;
