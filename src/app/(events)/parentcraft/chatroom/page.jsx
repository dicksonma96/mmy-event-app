"use client";
import React, { useEffect, useState, useRef } from "react";
import ChatIllustration from "@/assets/img/parentcraft/chat_illustration.png";
import Image from "next/image";
import Modal from "../component/Modal";
import { useChannel, usePresenceListener, usePresence } from "ably/react";
import { PARENTCRAFT_ABLY_CHAT_CHANNEL } from "@/lib/constant";
import { getCookie, setCookie, hasCookie } from "cookies-next";
import daysToSeconds from "@/lib/daysToSeconds";
import "./chat.css";
import epochToDateTime from "@/lib/epochToDateTime";

function Chat() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(null);
  const [nameModal, setNameModal] = useState(false);
  const [chatAnony, setChatAnony] = useState(false);
  const [chatLog, setChatLog] = useState([]);

  const { channel, publish, connectionError, channelError } = useChannel(
    PARENTCRAFT_ABLY_CHAT_CHANNEL,
    (message) => {
      setChatLog((prev) => [message, ...prev]);
    }
  );
  const { updateStatus } = usePresence(PARENTCRAFT_ABLY_CHAT_CHANNEL, "online");
  const { presenceData } = usePresenceListener(PARENTCRAFT_ABLY_CHAT_CHANNEL);

  const fetchHistoryMsg = async () => {
    let res = await channel.history({ limit: 10 });
    setChatLog(res.items);
  };

  const showNameModal = () => {
    setNameModal(true);
  };
  const closeNameModal = () => {
    setNameModal(false);
  };

  useEffect(() => {
    setName(getCookie("parentcraft_chat_name"));
    fetchHistoryMsg();
    setMounted(true);
    return () => {
      setMounted(false);
      channel.unsubscribe();
    };
  }, []);

  const SendMessage = (message) => {
    publish("chat-message", {
      username: name,
      ...message,
    });
  };

  const setChatName = (e) => {
    if (e.target.checkValidity()) {
      e.preventDefault();
      if (chatAnony) {
        setName("Guest" + " " + getCookie("parentcraft_uid").slice(0, 5));
      } else {
        const formData = new FormData(e.target);
        const _name = formData.get("name");
        setName(_name);
        setCookie("parentcraft_chat_name", _name, { maxAge: daysToSeconds(1) });
      }
      setNameModal(false);
    }
  };

  useEffect(() => {
    if (name) {
      SendMessage({
        announcement: `${name} joined the chatroom`,
      });
    }
  }, [name]);

  return (
    <>
      <div className="chatroom col">
        <div className="chat_header row">
          <div className="icon row">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <div className="header_text col">
            <span>Parentcraft Chatroom</span>
            <span className="status">{presenceData?.length} online</span>
          </div>
        </div>
        {mounted ? (
          name ? (
            <div className="chat_body col">
              <ChatLog chatLog={chatLog} />
              <ChatInput SendMessage={SendMessage} />
            </div>
          ) : (
            <div className="start_chat col">
              <Image src={ChatIllustration} alt="chat" />
              <h2>JOIN THE CONVERSATION!</h2>
              <p>Be Part of the Discussion: Enter the Chat Now!</p>

              <div className="btn1" onClick={showNameModal}>
                Chat Now
              </div>
            </div>
          )
        ) : (
          <div style={{ display: "grid", placeItems: "center", flex: 1 }}>
            Connecting...
          </div>
        )}
      </div>
      {nameModal && (
        <Modal className="name_modal" clickoutside={closeNameModal}>
          <form className="modal_content col" onSubmit={setChatName}>
            <div
              className="col"
              style={
                chatAnony
                  ? {
                      opacity: 0.5,
                      pointerEvents: "none",
                    }
                  : {}
              }
            >
              <span className="label">Tell us your name 😊</span>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required={!chatAnony}
              />
            </div>

            <div
              className="row anony"
              onClick={() => setChatAnony((prev) => !prev)}
            >
              <span className="material-symbols-outlined">
                {chatAnony ? "check_box" : "check_box_outline_blank"}
              </span>
              <span>Chat Anonymously</span>
            </div>

            <div className="row btns">
              <div className="btn_cancel" onClick={closeNameModal}>
                Cancel
              </div>
              <button className="btn1" type="submit">
                Chat Now
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function ChatLog({ chatLog }) {
  const uid = getCookie("parentcraft_uid");
  return (
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

        if (info.data.hasOwnProperty("announcement")) {
          return (
            <div key={index} className="announcement">
              {info.data.announcement}
            </div>
          );
        }
        return (
          <div
            key={index}
            className={`${
              info.clientId == uid ? "my_msg" : ""
            } ${msg_status} chatbox col`}
          >
            <div className="name">{info.data.username || "Anonymous"}</div>
            <div className="message">{info.data.message}</div>
            <div className="time">{epochToDateTime(info.timestamp).time}</div>
          </div>
        );
      })}
    </div>
  );
}

function ChatInput({ SendMessage }) {
  const [msg, setMsg] = useState("");
  const inputRef = useRef(null);

  const handleSend = async () => {
    inputRef.current.blur();
    try {
      await SendMessage({
        message: msg,
      });
      setMsg("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleEmote = async (emote) => {
    try {
      await SendMessage({
        message: emote,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="chat_input col">
      <textarea
        ref={inputRef}
        placeholder="Write a message..."
        value={msg}
        onChange={(e) => {
          setMsg(e.target.value);
        }}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            handleSend();
          }
        }}
      />
      <div className="chat_toolbar row">
        <div className="shortcut_btns row">
          <div className="shortcut s_btn" onClick={() => handleEmote("👏")}>
            👏Applause!
          </div>
          <div className="shortcut s_btn" onClick={() => handleEmote("❤️")}>
            ❤️ Love It!
          </div>
        </div>
        <button className="send_btn btn1" disabled={!msg} onClick={handleSend}>
          Send ➤
        </button>
      </div>
    </div>
  );
}

export default Chat;
