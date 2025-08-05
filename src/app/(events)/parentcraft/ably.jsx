"use client";

import { useState, useEffect } from "react";
import {
  ABLY_API,
  PARENTCRAFT_ABLY_CHAT_CHANNEL,
  PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
} from "@/lib/constant";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { v4 as uuidv4 } from "uuid";
import { getCookie, setCookie, hasCookie } from "cookies-next";
import daysToSeconds from "@/lib/daysToSeconds";
import GetUrlParams from "@/lib/GetUrlParams";

const uidName = {
  eng: "parentcraft_uid",
  cn: "parentcraft_cn_uid",
};

const channelNameMap = {
  eng: PARENTCRAFT_ABLY_CHAT_CHANNEL,
  cn: PARENTCRAFT_CN_ABLY_CHAT_CHANNEL,
};

function getId(lang = "eng") {
  let existing_id = getCookie(uidName[lang]);
  if (existing_id) return existing_id;

  let uid = uuidv4();
  setCookie(uidName[lang], uid, {
    maxAge: daysToSeconds(1),
  });
  return uid;
}

const AblyContainer = ({ children }) => {
  const [client, setClient] = useState(null);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const lang = GetUrlParams("lang") || "eng";

    const ablyClient = new Ably.Realtime({
      key: ABLY_API,
      clientId: getId(lang),
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
