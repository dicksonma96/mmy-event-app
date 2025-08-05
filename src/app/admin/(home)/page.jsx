"use client";
import React, { useState, useEffect } from "react";
import { getConfig, setActive } from "./serverAction";
import ErrorModule from "./ErrorModule";
import Link from "next/link";

function page() {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetData();
  }, []);

  const GetData = async () => {
    try {
      setLoading(true);
      let res = await getConfig();
      if (!res.success) throw res.message;
      setData(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const UpdateStatus = async (eventName, target, flag) => {
    try {
      setLoading(true);

      let res = await setActive(eventName, target, flag);
      if (!res.success) throw res.message;

      let res2 = await getConfig();
      if (!res2.success) throw res.message;
      setData(res2.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return <></>;
}

export default page;
