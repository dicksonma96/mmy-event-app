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
  const UpdateEventStatus = useMcaAdminStore((s) => s.UpdateEventStatus);
  const eventInfo = useMcaAdminStore((s) => s.eventInfo);
  const loading = useMcaAdminStore((s) => s.loading);
  const [searchTerm, setSearchTerm] = useState("");

  const EVENT_STATUS = ["pending", "ongoing", "ended", "winner"];

  useEffect(() => {
    GetEventInfo();
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

  const ChangeEventStatus = (status) => {
    UpdateEventStatus(status);
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
        <br />
        <div className="module col">
          <div className="module_header row">
            <h2>EVENT STATUS</h2>
          </div>
          <div className="row" style={{ gap: "10px" }}>
            {EVENT_STATUS.map((status, index) => {
              return (
                <div
                  key={index}
                  className={`${eventInfo?.status == status ? "btn1" : "btn2"}`}
                  style={{ textTransform: "capitalize" }}
                  onClick={() => ChangeEventStatus(status)}
                >
                  {status}
                </div>
              );
            })}
          </div>
        </div>
        <br />
        <div className="module col">
          <div className="module_header row">
            <h2>GUESTS MANAGEMENT</h2>
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

            <button
              className="btn1"
              onClick={() => GetEventInfo()}
              style={{ marginLeft: "20px" }}
            >
              Refresh Table
            </button>
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
        <br />
        <div className="module col">
          <div className="module_header row">
            <h2>QUIZ MANAGEMENT</h2>
          </div>
          <div className="row" style={{ gap: "100px" }}>
            <SetWinner quizNo={1} />
            <SetWinner quizNo={2} />
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
  const DeleteGuest = useMcaAdminStore((s) => s.DeleteGuest);

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
      name: data.name,
      updatedFields: {
        ...rowInfo,
      },
    });
  };

  const handleDelete = () => {
    let text = `Are you sure to delete ${data.seat}, ${data.name}?`;
    if (confirm(text) == true) {
      DeleteGuest(data);
    }
  };

  return (
    <form
      className="tr"
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdate();
      }}
    >
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
            <div className="btn btn3" onClick={handleDelete}>
              Delete
            </div>
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
            onSubmit={(e) => {
              e.preventDefault();
              HandleAddGuest(info);
            }}
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

function SetWinner({ quizNo }) {
  const [winner, setWinner] = useState(null);
  const eventInfo = useMcaAdminStore((s) => s.eventInfo);
  const official_ans = eventInfo?.[`quiz${quizNo}`].map((q) => q.answer);

  function getQuizScore(guest) {
    if (guest == null) return 0;
    let score = 0;

    for (let i = 0; i < official_ans.length; i++) {
      const correct = official_ans[i];
      const answer = guest[i];

      if (Array.isArray(correct) && Array.isArray(answer)) {
        // Compare as sets (same length, same items, same order not required)
        const sortedCorrect = [...correct].sort().join(",");
        const sortedAnswer = [...answer].sort().join(",");
        if (sortedCorrect === sortedAnswer) {
          score++;
        }
      } else if (!Array.isArray(correct) && correct === answer) {
        score++;
      }
    }

    return score;
  }

  const winnerlist = eventInfo?.guests
    .map((guest) => {
      return {
        ...guest,
        score: getQuizScore(guest?.[`quiz${quizNo}`]),
      };
    })
    .sort((a, b) => b.score - a.score);

  function GetRandomWinner() {
    const highestScore = Math.max(...winnerlist?.map((g) => g.score));
    const topGuests = winnerlist?.filter((g) => g.score === highestScore);

    const randomIndex = Math.floor(Math.random() * topGuests.length);
    setWinner(topGuests[randomIndex]);
  }

  return (
    <div className="setwinner col">
      <h4>Quiz {quizNo} Winner</h4>
      <div
        className="row"
        style={{ width: "100%", gap: "20px", fontSize: "15px" }}
      >
        <div className="selected_winner row">
          {winner?.seat} - {winner?.name}
        </div>
        <span
          style={{ fontSize: "20px", cursor: "pointer", marginLeft: "-52px" }}
          onClick={GetRandomWinner}
        >
          🎲
        </span>
        <div className="btn1">Save</div>
      </div>
      <div className="guest_list">
        <div className="user_table col">
          <div className="thead" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="th">Seat No</div>
            <div className="th">Name</div>
            <div className="th">Score</div>
          </div>
          <div className="tbody col">
            {winnerlist?.map((g, index) => {
              return (
                <div
                  className="tr"
                  style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
                  key={index}
                  onClick={() => setWinner(g)}
                >
                  <div className="td">{g.seat}</div>
                  <div className="td">{g.name}</div>
                  <div className="td">{g.score}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MCA;
