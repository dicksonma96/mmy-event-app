"use client";
import { ABLY_API, PARENTCRAFT_ABLY_CHAT_CHANNEL } from "@/lib/constant";
import getCookie from "@/lib/getCookie";
import setCookie from "@/lib/setCookie";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { v4 as uuidv4 } from "uuid";

const getId = () => {
  let existing_id = getCookie("parentcraft_uid");
  if (existing_id) return existing_id;

  let uid = uuidv4();
  setCookie("parentcraft_uid", uid, 1);
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
