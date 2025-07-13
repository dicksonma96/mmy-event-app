"use client";
import React, { useEffect, useState } from "react";
import useMcaAdminStore from "./mcaAdminStore";

function getAlphabetByNumber(num) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (num < 0 || num > 26) {
    throw new Error("Number must be between 1 and 26");
  }
  return alphabet[num];
}

function convertArrayToAlphabet(arr) {
  if (arr == null) return null;
  return arr.map((item) => {
    if (Array.isArray(item)) {
      return convertArrayToAlphabet(item); // recursive call for nested arrays
    }
    return getAlphabetByNumber(item);
  });
}

function MCA() {
  const GetEventInfo = useMcaAdminStore((s) => s.GetEventInfo);
  const eventInfo = useMcaAdminStore((s) => s.eventInfo);
  const loading = useMcaAdminStore((s) => s.loading);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log();
    GetEventInfo("yoyoyyoyo");
  }, []);

  const FilteredGuests = () => {
    if (searchTerm == "") return eventInfo?.guests;

    return eventInfo?.guests.filter((guest) => {
      const keyword = searchTerm.toLowerCase();
      return (
        guest.name.toLowerCase().includes(keyword) ||
        guest.seat.toLowerCase().includes(keyword) ||
        guest.brand.toLowerCase().includes(keyword)
      );
    });
  };

  return (
    <>
      {loading && (
        <div
          className="overlay row"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="loader"></div>
        </div>
      )}
      <div className="mca admin_content col">
        <div className="admin_header row">
          <div className="title">Motherhood Choice Awards</div>
        </div>

        <div className="filter_panel row">
          <AddGuest />

          <input
            type="text"
            placeholder="Search by name, seat, or brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search_input"
          />
          <button className="btn">Clear</button>
        </div>
        <div className="user_table col">
          <div className="thead ">
            <div className="th">Table-Seat No</div>
            <div className="th">Name</div>
            <div className="th">From</div>
            <div className="th">Quiz 1 Ans</div>
            <div className="th">Quiz 2 Ans</div>
            <div className="th">Actions</div>
          </div>
          <div className="tbody col">
            {FilteredGuests()?.map((item, index) => {
              return <GuestRow data={item} key={index} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function GuestRow({ data }) {
  const [rowInfo, setRowInfo] = useState(null);
  const [edit, setEdit] = useState(false);
  const UpdateGuest = useMcaAdminStore((s) => s.UpdateGuest);

  useEffect(() => {
    setRowInfo(data);
  }, [data]);

  const handleChange = (e, prop) => {
    setRowInfo((prev) => ({
      ...prev,
      [prop]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    UpdateGuest({
      seat: data.seat,
      updatedFields: {
        ...rowInfo,
      },
    });
  };

  return (
    <form className="tr" onSubmit={handleUpdate}>
      <div className="td">
        {
          <input
            value={rowInfo?.seat}
            onChange={(e) => handleChange(e, "seat")}
            readOnly={!edit}
            required
          />
        }
      </div>
      <div className="td">
        {
          <input
            value={rowInfo?.name}
            onChange={(e) => handleChange(e, "name")}
            readOnly={!edit}
            required
          />
        }
      </div>
      <div className="td">
        {
          <input
            value={rowInfo?.brand}
            onChange={(e) => handleChange(e, "brand")}
            readOnly={!edit}
            required
          />
        }
      </div>
      <div
        className="td col"
        style={{ padding: "5px 10px", alignItems: "start" }}
      >
        {convertArrayToAlphabet(data.quiz1)?.map((ans, index) => {
          return (
            <span>
              {index + 1}. {ans}
            </span>
          );
        })}
      </div>
      <div
        className="td col"
        style={{ padding: "5px 10px", alignItems: "start" }}
      >
        {convertArrayToAlphabet(data.quiz2)?.map((ans, index) => {
          return (
            <span>
              {index + 1}. {ans}
            </span>
          );
        })}
      </div>
      <div className="td btns row">
        {edit ? (
          <>
            <button type="submit" className="btn btn4">
              Update
            </button>
            <div
              className="btn btn2"
              onClick={() => {
                setEdit(false);
                setRowInfo(data);
              }}
            >
              Cancel
            </div>
          </>
        ) : (
          <>
            <div className="btn" onClick={() => setEdit((prev) => !prev)}>
              Edit
            </div>
            <div className="btn btn3">Delete</div>
          </>
        )}
      </div>
    </form>
  );
}

function AddGuest() {
  const [expand, setExpand] = useState(false);
  const [info, setInfo] = useState({ name: "", seat: "", brand: "" });
  const HandleAddGuest = useMcaAdminStore((state) => state.AddGuest);

  const handleChange = (e, prop) => {
    setInfo((prev) => ({
      ...prev,
      [prop]: e.target.value,
    }));
  };

  return (
    <div className="row" style={{ alignItems: "center", marginRight: "auto" }}>
      {expand ? (
        <>
          <form
            className="row"
            style={{ gap: "5px" }}
            onSubmit={() => HandleAddGuest(info)}
          >
            <input
              type="text"
              placeholder="Guest Table-Seat (01-01)"
              value={info.seat}
              onChange={(e) => handleChange(e, "seat")}
              required
            />

            <input
              type="text"
              placeholder="Guest Name"
              value={info.name}
              onChange={(e) => handleChange(e, "name")}
              required
            />

            <input
              type="text"
              placeholder="Guest From (Brand)"
              value={info.brand}
              onChange={(e) => handleChange(e, "brand")}
              required
            />
            <button className="btn1">Add</button>
            <div className="btn2" onClick={() => setExpand(false)}>
              Cancel
            </div>
          </form>
        </>
      ) : (
        <div className="btn btn1" onClick={() => setExpand(true)}>
          Add Guest
        </div>
      )}
    </div>
  );
}

export default MCA;
