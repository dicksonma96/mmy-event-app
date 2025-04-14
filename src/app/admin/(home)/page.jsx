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

  return (
    <div className="admin_content col">
      <div className="admin_header row">
        <div className="title">EVENT STATUS</div>
      </div>
      <div className="event_list">
        {error ? (
          <ErrorModule
            error={error}
            retryFunc={() => {
              setError(null);
              setLoading(false);
            }}
          />
        ) : loading ? (
          <div className="module_loading">
            <div className="loader"></div>
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="event_item col">
              <div
                className="row"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <strong>{item.event}</strong>
                <Link href={`/${item.event}`} target="_blank">
                  View Site
                </Link>
              </div>
              <br />
              <div className="status col">
                <span style={{ fontSize: "12px" }}>Status:</span>
                <div
                  className={`row toggle_btn ${
                    item.online ? "toggleActive" : ""
                  }`}
                  onClick={() =>
                    UpdateStatus(item.event, "online", !item.online)
                  }
                >
                  <span>ONLINE</span>
                  <span>OFFLINE</span>
                  <div className="ball"></div>
                </div>
              </div>
              <br />
              <div className="status col">
                <span style={{ fontSize: "12px" }}>User Slides View:</span>
                <div
                  className={`row toggle_btn ${
                    item.disable_client_slides ? "toggleActive" : ""
                  }`}
                  onClick={() =>
                    UpdateStatus(
                      item.event,
                      "disable_client_slides",
                      !item.disable_client_slides
                    )
                  }
                >
                  <span>DISABLE</span>
                  <span>ENABLE</span>
                  <div className="ball"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default page;
