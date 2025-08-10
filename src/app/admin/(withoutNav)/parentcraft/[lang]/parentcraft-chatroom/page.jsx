"use client";
import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { useChannel, usePresenceListener, usePresence } from "ably/react";
import {
  PARENTCRAFT_ABLY_CHAT_CHANNEL,
  PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
  PARENTCRAFT_BM_ABLY_CHAT_CHANNEL,
} from "@/lib/constant";
import epochToDateTime from "@/lib/epochToDateTime";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { getSpeakerSlides } from "@/app/admin/(withNav)/parentcraft/[lang]/serverAction";
import { useParams } from "next/navigation";
import { useLanguage } from "@/app/customHooks/useLanguage";

function ParentcraftChatroom() {
  const channelNameMap = {
    eng: PARENTCRAFT_ABLY_CHAT_CHANNEL,
    cn: PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
    bm: PARENTCRAFT_BM_ABLY_CHAT_CHANNEL,
  };

  const { lang } = useParams();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [error, setError] = useState(false);

  const { channel } = useChannel(channelNameMap[lang], (message) => {
    console.log(message);
    if (message.name == "history-cleared") setChatLog([]);
    else setChatLog((prev) => [message, ...prev]);
  });
  const { presenceData } = usePresenceListener(channelNameMap[lang]);
  const [hideChat, setHideChat] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const [activeSlides, setActiveSlides] = useState("");
  const chatroom_ref = useRef(null);

  const fetchHistoryMsg = async () => {
    try {
      let res = await channel.history({ limit: 300 });
      let _chatlog = [];
      if (res.items.length) {
        res.items.every((item) => {
          if (item.name == "history-cleared") {
            return false;
          }
          if (item.name == "chat-message") _chatlog.push(item);
          return true;
        });
      }
      setChatLog(_chatlog);
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    GetSlides();
    fetchHistoryMsg();
  }, []);

  const GetSlides = async () => {
    try {
      let res = await getSpeakerSlides(lang);
      console.log(res);
      if (!res.success) throw res.message;
      setData(res.data);
      if (res.data.length) {
        setActiveSlides(res.data[0]);
      }
    } catch (e) {
      setError(e);
    }
  };

  const toggleChatroomFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      chatroom_ref.current.requestFullscreen();
    }
  };

  return (
    <div className="chatroom row">
      <div className="slides row">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <>
            <div
              className={`slides_options col ${hideMenu ? "hide_options" : ""}`}
              style={{ overflow: hideMenu ? "visible" : "auto" }}
            >
              <span
                onClick={() => {
                  setHideMenu((prev) => !prev);
                }}
                className="material-symbols-outlined menu_btn"
              >
                {hideMenu ? "list" : "chevron_left"}
              </span>
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
            {activeSlides && (
              <iframe
                allowfullscreen="true"
                src={activeSlides.slides_url}
                frameBorder="0"
              ></iframe>
            )}
          </>
        )}
      </div>
      <div
        ref={chatroom_ref}
        className={`sidechat col ${hideChat ? "hidechat" : ""}`}
      >
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
            <span>{t("parentcraft.parentcraft_chatroom")}</span>
            <span className="status">
              {presenceData?.length} {t("parentcraft.online")}
            </span>
          </div>
          <span
            onClick={toggleChatroomFullscreen}
            className="material-symbols-outlined fullscreen_btn"
          >
            fullscreen
          </span>
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
            if (info.name == "announcement") {
              return (
                <div key={index} className="announcement">
                  <strong>{info.data.from}</strong> changed name to{" "}
                  <strong>{info.data.to}</strong>
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
