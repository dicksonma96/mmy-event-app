"use client";
import React, { useState, useEffect } from "react";
import "./style.scss";
import { useChannel, usePresenceListener, usePresence } from "ably/react";
import { PARENTCRAFT_ABLY_CHAT_CHANNEL } from "@/lib/constant";
import epochToDateTime from "@/lib/epochToDateTime";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getSpeakerSlides } from "../(home)/parentcraft/serverAction";

function ParentcraftChatroom() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([]);

  const { channel } = useChannel(PARENTCRAFT_ABLY_CHAT_CHANNEL, (message) => {
    console.log(message);
    setChatLog((prev) => [message, ...prev]);
  });
  const { presenceData } = usePresenceListener(PARENTCRAFT_ABLY_CHAT_CHANNEL);
  const [hideChat, setHideChat] = useState(false);
  const [activeSlides, setActiveSlides] = useState("");

  useEffect(() => {
    GetSlides();
  }, []);

  const GetSlides = async () => {
    try {
      let data = await getSpeakerSlides();
      setData(data);
      if (data.length) {
        setActiveSlides(data[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="chatroom row">
      <div className="slides col">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <>
            {activeSlides && (
              <iframe src={activeSlides.slides_url} frameBorder="0"></iframe>
            )}

            <div className="slides_options row">
              {data?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setActiveSlides(item)}
                  className={`slides_option ${
                    activeSlides == item ? "active_slides" : ""
                  }`}
                >
                  {item.slides_name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={`sidechat col ${hideChat ? "hidechat" : ""}`}>
        <div
          className="toggle_btn"
          onClick={() => setHideChat((prev) => !prev)}
        >
          <span className="material-symbols-outlined">
            {hideChat ? "chat" : "chevron_right"}
          </span>
        </div>
        <div className="chat_header row">
          <div className="icon row">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <div className="header_text col">
            <span>Parentcraft Chatroom</span>
            <span className="status">{presenceData?.length} online</span>
          </div>
        </div>
        <div className="chat_log col">
          {chatLog.map((info, index) => {
            let msg_status = "first";

            if (index != 0) {
              if (chatLog[index - 1]?.clientId == info.clientId) {
                msg_status = "continue";
              }
            }
            if (chatLog[index + 1]?.clientId != info.clientId) {
              msg_status = "last";
            }
            if (info.data.hasOwnProperty("emote")) {
              return (
                <div
                  key={index}
                  className={`${msg_status} chatbox emoji_msg col `}
                >
                  <div className="name">
                    {info.data.username || "Anonymous"}
                  </div>
                  <DotLottieReact
                    className="emoji"
                    src={`/lottie/${info.data.emote}.lottie`}
                    autoplay
                    loop
                  />
                  <div className="time">
                    {epochToDateTime(info.timestamp).time}
                  </div>
                </div>
              );
            }
            return (
              <div key={index} className={` ${msg_status} chatbox col`}>
                <div className="name">{info.data.username || "Anonymous"}</div>
                <div className="message">{info.data.message}</div>
                <div className="time">
                  {epochToDateTime(info.timestamp).time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ParentcraftChatroom;
