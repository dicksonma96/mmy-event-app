"use client";
import { useState, useEffect } from "react";
import {
  ABLY_API,
  PARENTCRAFT_ABLY_CHAT_CHANNEL,
  PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
  PARENTCRAFT_BM_ABLY_CHAT_CHANNEL,
} from "@/lib/constant";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useParams } from "next/navigation";

const channelNameMap = {
  eng: PARENTCRAFT_ABLY_CHAT_CHANNEL,
  cn: PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
  bm: PARENTCRAFT_BM_ABLY_CHAT_CHANNEL,
};

const AblyContainer = ({ children }) => {
  const [client, setClient] = useState(null);
  const [channelName, setChannelName] = useState("");
  const { lang } = useParams();

  useEffect(() => {
    const ablyClient = new Ably.Realtime({
      key: ABLY_API,
      clientId: "PARENTCRAFT-ADMIN",
    });

    setClient(ablyClient);
    setChannelName(channelNameMap[lang]);
  }, []);

  if (!client || !channelName) return null; // or a loading spinner

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={channelName}>{children}</ChannelProvider>
    </AblyProvider>
  );
};

export default AblyContainer;
