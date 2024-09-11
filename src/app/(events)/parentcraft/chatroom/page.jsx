"use client";
import React, { useState } from "react";
import ChatIllustration from "@/assets/img/parentcraft/chat_illustration.png";
import Image from "next/image";
import Modal from "../component/Modal";

function Chat() {
  const [nameModal, setNameModal] = useState(false);
  const [chatAnony, setChatAnony] = useState(false);

  const showNameModal = () => {
    setNameModal(true);
  };
  const closeNameModal = () => {
    setNameModal(false);
  };

  return (
    <>
      <div className="chatroom col">
        <div className="chat_header row">
          <div className="icon row">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <div className="header_text col">
            <span>Parentcraft Chatroom</span>
            <span className="status">0 online</span>
          </div>
        </div>
        <div className="start_chat col">
          <Image src={ChatIllustration} alt="chat" />
          <h2>JOIN THE CONVERSATION!</h2>
          <p>Be Part of the Discussion: Enter the Chat Now!</p>

          <div className="btn1" onClick={showNameModal}>
            Chat Now
          </div>
        </div>
      </div>
      {nameModal && (
        <Modal className="name_modal" clickoutside={closeNameModal}>
          <form className="modal_content col">
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
              <button className="btn1">Chat Now</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

export default Chat;
