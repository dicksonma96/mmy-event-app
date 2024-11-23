"use client";
import React, { useEffect, useState, useRef } from "react";
import ChatIllustration from "@/assets/img/parentcraft/chat_illustration.png";
import Image from "next/image";
import Modal from "../component/Modal";
import { useChannel, usePresenceListener, usePresence } from "ably/react";
import { PARENTCRAFT_CN_ABLY_CHAT_CHANNEL } from "@/lib/constant";
import { getCookie, setCookie, hasCookie } from "cookies-next";
import daysToSeconds from "@/lib/daysToSeconds";
import "./chat.css";
import epochToDateTime from "@/lib/epochToDateTime";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { SaveMessage } from "./serverAction";

function Chat() {
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(null);
  const [nameModal, setNameModal] = useState(false);
  const [chatAnony, setChatAnony] = useState(false);
  const [chatLog, setChatLog] = useState([]);

  const { channel, publish, connectionError, channelError } = useChannel(
    PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
    (message) => {
      console.log(message);
      if (message.name == "history-cleared") setChatLog([]);
      else setChatLog((prev) => [message, ...prev]);
    }
  );
  const { updateStatus } = usePresence(
    PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
    "online"
  );
  const { presenceData } = usePresenceListener(
    PARENTCRAFT_CN_ABLY_CHAT_CHANNEL
  );

  const fetchHistoryMsg = async () => {
    try {
      let res = await channel.history({ limit: 20 });
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

  const showNameModal = () => {
    setNameModal(true);
  };
  const closeNameModal = () => {
    setNameModal(false);
  };

  useEffect(() => {
    setName(getCookie("parentcraftCN_chat_name"));
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
      let guest_name =
        "Guest" + " " + getCookie("parentcraftCN_uid").slice(0, 5);
      if (chatAnony) {
        setName(guest_name);
      } else {
        const formData = new FormData(e.target);
        const _name = formData.get("name");
        setName(_name);
        setCookie("parentcraftCN_chat_name", _name, {
          maxAge: daysToSeconds(1),
        });
        publish("announcement", {
          type: "ChangeName",
          from: name || guest_name,
          to: _name,
        });
      }
      setNameModal(false);
    }
  };

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <div className="chatroom col">
        <div className="chat_header row">
          <div className="icon row">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <div className="header_text col">
            <span>新手爸妈聊天室</span>
            <span className="status">{presenceData?.length} online</span>
          </div>
          <div onClick={showNameModal} className="update_name s_btn">
            更新名字
          </div>
        </div>
        {mounted ? (
          name ? (
            <div className="chat_body col">
              <ChatLog chatLog={chatLog} />
              <ChatInput SendMessage={SendMessage} name={name} />
            </div>
          ) : (
            <div className="start_chat col">
              <Image src={ChatIllustration} alt="chat" />
              <h2>加入聊天室!</h2>
              <p>参与讨论：立即加入聊天室!</p>

              <div className="btn1" onClick={showNameModal}>
                立即聊天！
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
              <span className="label">告诉我们你的名字 😊</span>
              <input
                type="text"
                name="name"
                placeholder="你的名字"
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
              <span>匿名聊天</span>
            </div>

            <div className="row btns">
              <div className="btn_cancel" onClick={closeNameModal}>
                取消
              </div>
              <button className="btn1" type="submit">
                加入
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function ChatLog({ chatLog }) {
  const uid = getCookie("parentcraftCN_uid");
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
        if (info.data.hasOwnProperty("emote")) {
          return (
            <div
              key={index}
              className={`${
                info.clientId == uid ? "my_msg" : ""
              } ${msg_status} chatbox emoji_msg col`}
            >
              <div className="name">{info.data.username || "Anonymous"}</div>
              <DotLottieReact
                className="emoji"
                src={`/lottie/${info.data.emote}.lottie`}
                autoplay
                loop
              />
              <div className="time">{epochToDateTime(info.timestamp).time}</div>
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

function ChatInput({ SendMessage, name }) {
  const [msg, setMsg] = useState("");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [msgCoolDown, setMsgCoolDown] = useState(0);
  const [emojiCoolDown, setEmojiCoolDown] = useState(0);
  const msgIntervalRef = useRef(null);
  const emojiIntervalRef = useRef(null);

  useEffect(() => {
    // Only start interval if there's a cooldown greater than 0
    if (msgCoolDown > 0 && !msgIntervalRef.current) {
      msgIntervalRef.current = setInterval(() => {
        setMsgCoolDown((prev) => {
          if (prev <= 1) {
            clearInterval(msgIntervalRef.current);
            msgIntervalRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      // Clear the interval when component unmounts or before re-starting
      if (msgIntervalRef.current) {
        clearInterval(msgIntervalRef.current);
        msgIntervalRef.current = null;
      }
    };
  }, [msgCoolDown]);

  useEffect(() => {
    // Only start interval if there's a cooldown greater than 0
    if (emojiCoolDown > 0 && !emojiIntervalRef.current) {
      emojiIntervalRef.current = setInterval(() => {
        setEmojiCoolDown((prev) => {
          if (prev <= 1) {
            clearInterval(emojiIntervalRef.current);
            emojiIntervalRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      // Clear the interval when component unmounts or before re-starting
      if (emojiIntervalRef.current) {
        clearInterval(emojiIntervalRef.current);
        emojiIntervalRef.current = null;
      }
    };
  }, [emojiCoolDown]);

  const handleSend = async () => {
    inputRef.current.blur();
    try {
      setLoading(true);
      let res = await SaveMessage({
        userId: getCookie("parentcraftCN_uid"),
        name: name || "Anonymous",
        message: msg,
        timestamp: new Date(),
      });
      if (res.success == false) {
        throw res.message;
      }
      await SendMessage({
        message: msg,
      });
      setMsg("");
      setMsgCoolDown(10);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEmote = async (emote) => {
    try {
      await SendMessage({
        emote: emote,
      });
      setEmojiCoolDown(10);
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
          <button
            className="shortcut s_btn"
            onClick={() => handleEmote("clap")}
            disabled={emojiCoolDown > 0}
          >
            👏Applause! {emojiCoolDown > 0 && `(${emojiCoolDown})`}
          </button>
          <button
            className="shortcut s_btn"
            onClick={() => handleEmote("love")}
            disabled={emojiCoolDown > 0}
          >
            ❤️ Love It! {emojiCoolDown > 0 && `(${emojiCoolDown})`}
          </button>
        </div>
        <button
          className="send_btn btn1"
          disabled={!msg || loading}
          onClick={handleSend}
        >
          {loading ? (
            <div
              className="loader"
              style={{ fontSize: "0.4em", margin: "0 auto" }}
            ></div>
          ) : (
            <>Send ➤{msgCoolDown > 0 && `(${msgCoolDown})`}</>
          )}
        </button>
      </div>
    </div>
  );
}

function Error({ error }) {
  function ShowErrorMessage() {
    if (typeof error === "string" || error instanceof String) return error;

    if (error?.message) {
      return error.message;
    } else return "Something went wrong. Please try again";
  }
  return (
    <div
      className="chat_error col"
      onClick={() => {
        location.reload();
      }}
    >
      <span className={`material-symbols-outlined `}>refresh</span>
      <span>{ShowErrorMessage()}</span>
    </div>
  );
}

export default Chat;
