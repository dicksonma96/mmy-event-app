"use client";
import { ABLY_API, PARENTCRAFT_CN_ABLY_CHAT_CHANNEL } from "@/lib/constant";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";

const client = new Ably.Realtime({
  key: ABLY_API,
  clientId: "PARENTCRAFT-CN-ADMIN",
});

const AblyContainer = ({ children }) => {
  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={PARENTCRAFT_CN_ABLY_CHAT_CHANNEL}>
        {children}
      </ChannelProvider>
    </AblyProvider>
  );
};

export default AblyContainer;
