"use client";
import {
  getAgenda,
  getSpeakersOptions,
  getSponsorsOptions,
  saveAgenda,
  deleteAgenda,
  setActive,
} from "./serverAction";
import { useEffect, useState, useRef } from "react";
import {
  mongoDateToObject,
  mongoDateToInputValue,
} from "@/lib/mongoDateToObject";
import convertTo12Hour from "@/lib/convertTo12Hour";
import ReactPaginate from "react-paginate";
import { Flipper, Flipped } from "react-flip-toolkit";
import { uid } from "uid";
import { useParentcraftContext } from "./Context";

function Agenda() {
  const [target, setTarget] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetActive = async (info) => {
    try {
      setLoading(true);
      await setActive(info);
      await GetData();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agenda_module module">
      {target == null ? (
        <AgendaListing
          setLoading={setLoading}
          setError={setError}
          setTarget={setTarget}
          handleSetActive={handleSetActive}
        />
      ) : (
        <AgendaForm
          target={target}
          setTarget={setTarget}
          setLoading={setLoading}
        />
      )}
      {loading && (
        <div className="module_loading">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

function AgendaListing({ setLoading, setError, setTarget, handleSetActive }) {
  const { refreshData, setRefreshData } = useParentcraftContext();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
  });

  useEffect(() => {
    if (refreshData == true) {
      GetData();
      setRefreshData(false);
    }
  }, [refreshData]);

  const GetData = async () => {
    try {
      setLoading(true);
      let res = await getAgenda(query);
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  const agendaTemplate = {
    _id: "",
    name: "",
    date: "",
    sponsors: [],
    speakers: [],
    agendas: [],
  };

  const AgendaItem = ({ info, active }) => {
    return (
      <div
        className={`agenda_item row`}
        onClick={() => {
          setTarget(info);
        }}
      >
        <div className="date col">
          <span className="day">{mongoDateToObject(info.date).day}</span>
          <span className="month">
            {mongoDateToObject(info.date).monthName}
          </span>
        </div>
        <div className="col">
          <div className="name">{info.name}</div>
          <div className="row" style={{ alignItems: "center" }}>
            <div className="year">{mongoDateToObject(info.date).year}</div>
            {info.agendas.length ? (
              <div className="time">
                {convertTo12Hour(info.agendas[0].time_start)} -{" "}
                {convertTo12Hour(
                  info.agendas[info.agendas.length - 1].time_end
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {active ? (
          <div className="live_btn" style={{ color: "green" }}>
            ACTIVE
          </div>
        ) : (
          <div
            className="live_btn"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Set ${info.name} to active?`)) handleSetActive(info);
            }}
          >
            INACTIVE
          </div>
        )}
        <span className="material-symbols-outlined right_icon">
          chevron_right
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="module_header row">
        <h2>WORKSHOPS</h2>

        <div
          onClick={() => setTarget(agendaTemplate)}
          className="btn1"
          style={{ marginLeft: "auto" }}
        >
          ADD WORKSHOP
        </div>
      </div>
      <div className="horizontal_listing agenda_listing col">
        {data?.data?.map((item, index) => {
          return (
            <AgendaItem info={item} key={index} active={item.isActiveAgenda} />
          );
        })}
      </div>
      <>
        <br />
        <ReactPaginate
          className="admin_paginate"
          forcePage={query.page - 1}
          breakLabel="..."
          nextLabel="Next"
          onPageChange={(e) => {
            setQuery((prev) => ({ ...prev, page: e.selected + 1 }));
          }}
          pageRangeDisplayed={10}
          pageCount={Math.ceil(data?.totalPage) || 1}
          marginPagesDisplayed={0}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
        />
      </>
    </>
  );
}

function AgendaForm({ target, setTarget, setLoading }) {
  const formRef = useRef(null);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let form = formRef.current;
      if (form.checkValidity()) {
        await saveAgenda(target);
        setTarget(null);
      } else {
        // alert("Please fill out the required fields correctly.");
        // Optionally, report which inputs are invalid
        form.reportValidity(); // This triggers the browser to display validation messages
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteAgenda(target);
      setTarget(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const addAgenda = () => {
    const agendaTemplate = {
      id: uid(),
      time_start: "",
      time_end: "",
      agenda: "",
      description: "",
    };
    setTarget((prev) => ({
      ...prev,
      agendas: [...prev.agendas, agendaTemplate],
    }));
  };

  const sortAgenda = (move, currentIndex) => {
    setTarget((prev) => {
      const currentAgendas = [...prev.agendas]; // Make a copy of the agendas array
      // Assuming you have a way to identify the selected agenda item

      if (currentIndex === -1) return prev; // No item is selected, return the previous state

      const newIndex = currentIndex + move;

      // Ensure the new index is within bounds
      if (newIndex >= 0 && newIndex < currentAgendas.length) {
        // Swap the agenda item
        const temp = currentAgendas[newIndex];
        currentAgendas[newIndex] = currentAgendas[currentIndex];
        currentAgendas[currentIndex] = temp;
      }

      return {
        ...prev,
        agendas: currentAgendas,
      };
    });
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
          {target._id ? target.name : "Add New Workshop"}
        </h2>

        {target._id && (
          <div
            className="delete_btn"
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
            Delete
          </div>
        )}

        <div
          onClick={handleUpdate}
          className="btn1"
          style={{ marginLeft: "1em" }}
        >
          {target._id ? "UPDATE" : "ADD"}
        </div>
      </div>
      <form className="admin_form" ref={formRef}>
        <div className="inputs_row row">
          <div className="input col">
            <span className="label">AGENDA NAME</span>
            <input
              type="text"
              value={target.name}
              onChange={(e) => {
                setTarget((prev) => ({ ...prev, name: e.target.value }));
              }}
              required
            />
          </div>
          <div className="input col">
            <span className="label">DATE</span>
            <input
              type="date"
              value={mongoDateToInputValue(target.date)}
              onChange={(e) => {
                setTarget((prev) => ({
                  ...prev,
                  date: new Date(e.target.value),
                }));
              }}
              required
            />
          </div>
        </div>
        <div className="inputs_row row">
          <div className="input col">
            <span className="label">SPEAKERS TODAY</span>
            <SpeakersPicker selected={target.speakers} setTarget={setTarget} />
          </div>
          <div className="input col">
            <span className="label">SPONSORS TODAY</span>
            <SponsorsPicker selected={target.sponsors} setTarget={setTarget} />
          </div>
        </div>

        <div className="sort_listing col">
          <div className="sort_header row">
            <h2>AGENDA DETAILS</h2>
          </div>
          <Flipper flipKey={target.agendas.map((c) => c.id).join("-")}>
            <div className="listing col">
              {target.agendas.map((item, index) => {
                let isLast = index == target.agendas.length - 1 ? true : false;
                return (
                  <Flipped key={item.id} flipId={item.id}>
                    <div>
                      <AgendaDetail
                        key={index}
                        index={index}
                        isLast={isLast}
                        detail={item}
                        sortAgenda={sortAgenda}
                        setTarget={setTarget}
                      />
                    </div>
                  </Flipped>
                );
              })}
            </div>
          </Flipper>
          <div
            className="btn2"
            style={{ alignSelf: "flex-end" }}
            onClick={addAgenda}
          >
            ADD AGENDA
          </div>
        </div>
      </form>
    </>
  );
}

function AgendaDetail({ detail, index, isLast, sortAgenda, setTarget }) {
  const [edit, setEdit] = useState(false);

  const updateField = (field, value) => {
    setTarget((prev) => {
      let updated_agenda = prev.agendas.map((item, i) => {
        if (index != i) return item;

        return {
          ...item,
          [field]: value,
        };
      });

      return {
        ...prev,
        agendas: updated_agenda,
      };
    });
  };

  const removeDetail = () => {
    setTarget((prev) => ({
      ...prev,
      agendas: prev.agendas.filter((item, i) => i != index),
    }));
  };

  return (
    <div className="agenda_item sortable_item row">
      <div className="sort_btn col">
        <span
          style={{ opacity: index == 0 ? 0 : 1 }}
          className="material-symbols-outlined"
          onClick={() => sortAgenda(-1, index)}
        >
          keyboard_arrow_up
        </span>
        <span
          style={{ opacity: isLast ? 0 : 1 }}
          className="material-symbols-outlined"
          onClick={() => sortAgenda(1, index)}
        >
          keyboard_arrow_down
        </span>
      </div>
      <div className="info col">
        <div className="input col">
          <span className="label">Agenda</span>
          <input
            type="text"
            value={detail.agenda}
            required
            onChange={(e) => {
              updateField("agenda", e.target.value);
            }}
          />
        </div>
        <>
          <div className="input col">
            <span className="label">Description</span>
            <textarea
              value={detail.description}
              onChange={(e) => {
                updateField("description", e.target.value);
              }}
            />
          </div>
          <div className="inputs_row row">
            <div className="input col">
              <span className="label">TIME START</span>
              <input
                type="time"
                value={detail.time_start}
                required
                onChange={(e) => {
                  updateField("time_start", e.target.value);
                }}
              />
            </div>
            <div className="input col">
              <span className="label">TIME END</span>
              <input
                type="time"
                value={detail.time_end}
                required
                onChange={(e) => {
                  updateField("time_end", e.target.value);
                }}
              />
            </div>
          </div>
        </>
      </div>
      <div className="action row">
        <span onClick={removeDetail} className="material-symbols-outlined">
          delete
        </span>
      </div>
    </div>
  );
}

function SpeakersPicker({ selected, setTarget }) {
  const [data, setData] = useState([]);
  const [expand, setExpand] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (expand) GetData();
  }, [expand]);
  const GetData = async () => {
    try {
      setPending(true);
      let res = await getSpeakersOptions();
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="custom_dropdown row">
      <div
        className="selected_items row"
        onClick={() => setExpand((prev) => !prev)}
      >
        {selected.map((item, index) => (
          <div
            key={index}
            className="item row"
            onClick={(e) => {
              e.stopPropagation();
              setTarget((prev) => ({
                ...prev,
                speakers: prev.speakers.filter((a, i) => i != index),
              }));
            }}
          >
            <span>{item.name}</span>
            <span className="material-symbols-outlined remove_btn">close</span>
          </div>
        ))}

        <span className={`material-symbols-outlined dropdown_icon`}>
          {expand ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </div>

      {expand && (
        <div className="dropdown_list col">
          {pending ? (
            <div className="loader"></div>
          ) : (
            data
              ?.filter((item) => {
                return !selected.some((a) => a._id == item._id);
              })
              .map((item, index) => {
                return (
                  <div
                    onClick={() => {
                      setTarget((prev) => ({
                        ...prev,
                        speakers: [...prev.speakers, item],
                      }));
                    }}
                    key={index}
                    className="dropdown_item row"
                  >
                    <img src={item.img_url} alt="" />
                    <div className="col">
                      <strong>{item.name}</strong>
                      <span>{item.specialist}</span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
}

function SponsorsPicker({ selected, setTarget }) {
  const [data, setData] = useState([]);
  const [expand, setExpand] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (expand) GetData();
  }, [expand]);
  const GetData = async () => {
    try {
      setPending(true);
      let res = await getSponsorsOptions();
      setData(res);
    } catch (e) {
      setError(e);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="custom_dropdown row">
      <div
        className="selected_items row"
        onClick={() => setExpand((prev) => !prev)}
      >
        {selected.map((item, index) => (
          <div
            key={index}
            className="item row"
            onClick={(e) => {
              e.stopPropagation();
              setTarget((prev) => ({
                ...prev,
                sponsors: prev.sponsors.filter((a, i) => i != index),
              }));
            }}
          >
            <span>{item.name}</span>
            <span className="material-symbols-outlined remove_btn">close</span>
          </div>
        ))}

        <span className={`material-symbols-outlined dropdown_icon`}>
          {expand ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </div>

      {expand && (
        <div className="dropdown_list col">
          {pending ? (
            <div className="loader"></div>
          ) : (
            data
              ?.filter((item) => {
                return !selected.some((a) => a._id == item._id);
              })
              .map((item, index) => {
                return (
                  <div
                    onClick={() => {
                      setTarget((prev) => ({
                        ...prev,
                        sponsors: [...prev.sponsors, item],
                      }));
                    }}
                    key={index}
                    className="dropdown_item row"
                  >
                    <img src={item.img_url} />
                    <strong>{item.name}</strong>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
}

export default Agenda;

//25.52
//135.7  - 27.14
//34.8  - 17.4
//18.56
//30.16 - 10.05

// 54.28 +
