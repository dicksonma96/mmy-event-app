"use client";
import React, { useEffect, useState, useRef } from "react";
import ErrorModule from "../ErrorModule";
import { getConfig, updateZoom } from "./serverAction";

function ZoomLink() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    online: false,
    url: "",
  });

  const GetData = async () => {
    try {
      setLoading(true);
      let res = await getConfig();
      if (!res.success) throw res.message;
      setData(res.data.zoom);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      let res = await updateZoom({
        online: data.online,
        url: data.url || "",
      });
      if (res.success) {
        GetData();
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="zoom_module module col">
      {error ? (
        <ErrorModule
          error={error}
          retryFunc={() => {
            setError(null);
            setLoading(false);
          }}
        />
      ) : (
        <>
          <div className="module_header row">
            <h2>ZOOM</h2>

            <div
              onClick={handleUpdate}
              className="btn1"
              style={{ marginLeft: "auto" }}
            >
              UPDATE
            </div>
          </div>
          <form className="admin_form">
            <div className="input col">
              <span className="label">Zoom Status</span>
              <div
                className={`row toggle_btn  ${
                  data?.online ? "toggleActive" : ""
                }`}
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    online: !prev?.online,
                  }))
                }
              >
                <span>LIVE NOW</span>
                <span>STAY TUNE</span>
                <div className="ball"></div>
              </div>
            </div>
            <div className="input col">
              <span className="label">Zoom Link</span>
              <input
                type="text"
                value={data?.url}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, url: e.target.value }));
                }}
                required
              />
            </div>
          </form>
          {loading && (
            <div className="module_loading">
              <div className="loader"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ZoomLink;
