"use client";
import { ABLY_API, PARENTCRAFT_ABLY_CHAT_CHANNEL } from "@/lib/constant";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { v4 as uuidv4 } from "uuid";
import { getCookie, setCookie, hasCookie } from "cookies-next";
import daysToSeconds from "@/lib/daysToSeconds";

const getId = () => {
  let existing_id = getCookie("parentcraft_uid");
  if (existing_id) return existing_id;

  let uid = uuidv4();
  setCookie("parentcraft_uid", uid, {
    maxAge: daysToSeconds(1),
  });
  return uid;
};

const client = new Ably.Realtime({
  key: ABLY_API,
  clientId: getId(),
});

const AblyContainer = ({ children }) => {
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={PARENTCRAFT_ABLY_CHAT_CHANNEL}>
        {children}
      </ChannelProvider>
    </AblyProvider>
  );
};

export default AblyContainer;
