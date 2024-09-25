"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  getSpeakers,
  updateSpeaker,
  deleteSpeaker,
  getSponsors,
} from "./serverAction";
import ReactPaginate from "react-paginate";
import { not_found_img } from "@/lib/constant";
import { useParentcraftContext } from "./Context";

function Contributors() {
  const [tab, setTab] = useState("Speakers");
  const subnav = ["Speakers", "Sponsors"];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speakerTarget, setSpeakerTarget] = useState(null);
  const [sponsorTarget, setSponsorTarget] = useState(null);

  return (
    <div className="contributor_module module col">
      {speakerTarget == null && sponsorTarget == null && (
        <>
          <div className="module_header row">
            <h2>CONTRIBUTORS</h2>
          </div>
          <div className="subnav row">
            {subnav.map((item, index) => (
              <div
                onClick={() => setTab(item)}
                key={index}
                className={`subnav_item ${tab == item ? "subnav_active" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
          {tab == "Speakers" && (
            <SpeakersList
              setLoading={setLoading}
              setError={setError}
              setSpeakerTarget={setSpeakerTarget}
            />
          )}
          {tab == "Sponsors" && (
            <SponsorsList
              setLoading={setLoading}
              setError={setError}
              setSponsorTarget={setSponsorTarget}
            />
          )}
        </>
      )}

      {speakerTarget && (
        <SpeakerForm
          target={speakerTarget}
          setTarget={setSpeakerTarget}
          setLoading={setLoading}
          setError={setError}
        />
      )}

      {sponsorTarget && (
        <SponsorForm
          target={sponsorTarget}
          setTarget={setSponsorTarget}
          setLoading={setLoading}
          setError={setError}
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

function SpeakersList({ setLoading, setError, setSpeakerTarget }) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
  });

  useEffect(() => {
    GetData();
  }, []);

  const GetData = async () => {
    try {
      setLoading(true);
      let res = await getSpeakers(query);
      setData(res);
      console.log(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  function Speaker({ info }) {
    return (
      <div className="contr_item row" onClick={() => setSpeakerTarget(info)}>
        <img src={info.img_url} alt={info.name} />
        <div className="info col">
          <strong>{info.name}</strong>
          <span>{info.specialist}</span>
        </div>

        <span className="material-symbols-outlined right_icon">
          chevron_right
        </span>
      </div>
    );
  }

  function AddSpeaker() {
    setSpeakerTarget({
      name: "",
      specialist: "",
      hospital: "",
      img_url: "",
    });
  }

  return (
    <>
      <div className="contr_listing col">
        {data?.data?.map((item, index) => {
          return <Speaker info={item} key={index} />;
        })}
      </div>
      <br />
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="btn1" onClick={AddSpeaker}>
          Add Speaker
        </div>
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
      </div>
    </>
  );
}

function SpeakerForm({ target, setTarget, setLoading, setError }) {
  const { setRefreshData } = useParentcraftContext();
  const formRef = useRef(null);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteSpeaker(target);
      setTarget(null);
      setRefreshData(true);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let form = formRef.current;
      if (form.checkValidity()) {
        await updateSpeaker(target);
        setTarget(null);
        setRefreshData(true);
      } else {
        form.reportValidity(); // This triggers the browser to display validation messages
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
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
          {target._id ? target.name : "Add Speaker"}
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

      <form ref={formRef} className="admin_form">
        <div className="input col">
          <span className="label">SPEAKER NAME</span>
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
          <span className="label">SPEAKER SPECIALIST</span>
          <input
            type="text"
            value={target.specialist}
            onChange={(e) => {
              setTarget((prev) => ({ ...prev, specialist: e.target.value }));
            }}
            required
          />
        </div>
        <div className="input col">
          <span className="label">SPEAKER'S HOSPITAL</span>
          <input
            type="text"
            value={target.hospital}
            onChange={(e) => {
              setTarget((prev) => ({ ...prev, hospital: e.target.value }));
            }}
            required
          />
        </div>
        <div className="input col">
          <span className="label">SPEAKER IMG URL</span>
          <input
            type="text"
            value={target.img_url}
            onChange={(e) => {
              setTarget((prev) => ({ ...prev, img_url: e.target.value }));
            }}
            required
          />
          <img
            className="preview"
            src={target.img_url}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop in case fallback image also fails
              e.target.src = not_found_img;
            }}
            alt=""
          />
        </div>
      </form>
    </>
  );
}

function SponsorsList({ setLoading, setError, setSponsorTarget }) {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
  });

  useEffect(() => {
    GetData();
  }, []);

  const GetData = async () => {
    try {
      setLoading(true);
      let res = await getSponsors(query);
      setData(res);
      console.log(res);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  function Sponsor({ info }) {
    return (
      <div className="contr_item row" onClick={() => setSponsorTarget(info)}>
        <img src={info.img_url} alt={info.name} />
        <div className="info col">
          <strong>{info.name}</strong>
          <span>{info.specialist}</span>
        </div>

        <span className="material-symbols-outlined right_icon">
          chevron_right
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="contr_listing col">
        {data?.data?.map((item, index) => {
          return <Sponsor info={item} key={index} />;
        })}
      </div>
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
  );
}

function SponsorForm({ target, setTarget, setLoading, setError }) {
  const formRef = useRef(null);
  const handleDelete = () => {};

  const handleUpdate = async () => {
    // try {
    //   setLoading(true);
    //   let form = formRef.current;
    //   if (form.checkValidity()) {
    //     await updateSpeaker(target);
    //     setTarget(null);
    //   } else {
    //     form.reportValidity(); // This triggers the browser to display validation messages
    //   }
    // } catch (e) {
    //   console.log(e);
    // } finally {
    //   setLoading(false);
    // }
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
          {target._id ? target.name : "Add Speaker"}
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
    </>
  );
}

export default Contributors;
