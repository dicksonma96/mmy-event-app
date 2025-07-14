"use client";

import Image from "next/image";
import "./mca.scss";
import Banner from "@/assets/img/mca/banner.jpg";
import Quiz from "./components/quiz";
import Login from "./components/login";
import Schedule from "./components/schedule.js";
import { useEffect, useState } from "react";
import useMcaStore from "./mcaStore";
import { useChannel, usePresenceListener, usePresence } from "ably/react";
import { MCA_ABLY_CHAT_CHANNEL } from "@/lib/constant.js";

export default function Home() {
  const nav = ["Schedule", "Quiz 1", "Quiz 2"];
  const [activeNav, setActiveNav] = useState("Schedule");
  const eventInfo = useMcaStore((state) => state.eventInfo);
  const GetEventInfo = useMcaStore((state) => state.GetEventInfo);
  const loading = useMcaStore((state) => state.loading);
  const setShowLogin = useMcaStore((state) => state.setShowLogin);
  const showLogin = useMcaStore((state) => state.showLogin);

  const { channel, publish, connectionError, channelError } = useChannel(
    MCA_ABLY_CHAT_CHANNEL,
    (message) => {
      console.log(message);
      if (message.name == "update-status") {
        GetEventInfo();
      }
      if (message.name == "refresh-eventinfo") {
        if (eventInfo?.me?.seat == message.data.seatNo)
          GetEventInfo(null, true); // second param as TRUE for reset seat no
      }
    }
  );

  useEffect(() => {
    GetEventInfo();
  }, []);

  const userInfo = {
    brand: "test",
    name: "Jinny",
    seat: "10-05",
  };
  return (
    <>
      {loading && (
        <div
          className="row"
          style={{
            justifyContent: "center",
            zIndex: "999",
            background: "rgba(0,0,0,0.5)",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <div className="loader"></div>
        </div>
      )}
      <Image className="main_banner" src={Banner} alt="MCA 2024" />
      <div className="welcome_panel col">
        {eventInfo?.me ? (
          <>
            {eventInfo.me?.brand && (
              <div className="brand">{eventInfo.me?.brand}</div>
            )}
            <h1>Welcome, {eventInfo.me?.name}</h1>
            <div className="row">
              <h5>
                Table {eventInfo.me?.seat.split("-")[0]}, Seat{" "}
                {eventInfo.me?.seat.split("-")[1]}
              </h5>
              <em onClick={() => setShowLogin(true)}>Edit Seat Number</em>
            </div>
          </>
        ) : (
          <>
            <h1>WELCOME TO</h1>
            <h5>Motherhood Choice Award 2025</h5>
            <br />
            <em onClick={() => setShowLogin(true)}>
              Enter Seat Number (To participate Skyworth Quizzes)
            </em>
          </>
        )}
      </div>
      <nav className="mca_nav row">
        {nav.map((item, index) => {
          return (
            <div
              className={`nav_item row ${
                item == activeNav ? "active_item" : ""
              }`}
              key={index}
              onClick={() => {
                setActiveNav(item);
              }}
            >
              {item}
            </div>
          );
        })}
      </nav>
      {activeNav == "Schedule" && <Schedule />}
      {activeNav == "Quiz 1" && <Quiz quizNo={1} />}
      {activeNav == "Quiz 2" && <Quiz quizNo={2} />}
      {showLogin && <Login />}{" "}
    </>
  );
}
