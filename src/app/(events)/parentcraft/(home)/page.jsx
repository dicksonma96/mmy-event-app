"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Banner from "@/assets/img/parentcraft/banner.jpg";
import HomeNav from "./HomeNav";
import { useLanguage } from "@/app/customHooks/useLanguage";
import { useSearchParams } from "next/navigation";
import PageLoading from "../component/PageLoading";
import ZOOM_ILLUSTRATION from "@/assets/img/parentcraft/zoom_logo.png";

function Parentcraft() {
  // ["agenda", "contributors", "slides", "zoom"]
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "eng";

  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState("agenda");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useLanguage("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/getClass?language=${lang}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await res.json();
        if (result.status == "success") {
          setData(result.data.class);
        } else {
          throw new Error(result.msg || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Detailed fetch error:", error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    console.log(lang);
  }, []);

  return (
    <>
      <div className="banner">
        {loading ? (
          <></>
        ) : (
          <div className="info col">
            <h3>{t("parentcraft.welcome_to")}</h3>
            <h2>{data?.event_name}</h2>
            <div className="date">{data?.date}</div>
          </div>
        )}

        <Image src={Banner} alt="parentcraft banner" />
      </div>
      <HomeNav activeNav={nav} setNav={setNav} />

      {loading ? (
        <div className="section">
          <PageLoading />
        </div>
      ) : (
        <>
          {nav == "agenda" && <AgendaList agendas={data?.agendas} />}
          {nav == "contributors" && (
            <Contributors
              info={{
                speakers: data?.speakers,
                sponsors: data?.sponsors,
              }}
            />
          )}
          {nav == "zoom" && <Zoom link_html={data?.live_stream_info} />}
        </>
      )}
    </>
  );
}

function AgendaList({ agendas }) {
  const { t } = useLanguage("");

  return (
    <section className="section agenda_section col">
      <div className="section_title">{t("parentcraft.today_agenda")}</div>
      <div className="agenda_list col">
        {agendas?.map((agenda, index) => (
          <div key={index} className="agenda col">
            <div className="time row">
              <span>{agenda.from}</span>-<span>{agenda.to}</span>
            </div>
            <h2>{agenda.agenda}</h2>
            <p>{agenda.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contributors({ info }) {
  const { t } = useLanguage();

  return (
    <section className="section contributors_section col">
      <div className="section_title">{t("parentcraft.speakers_today")}</div>
      <div className="speaker_list col">
        {info?.speakers.map((speaker, index) => (
          <div key={index} className="speaker row">
            <img src={speaker.img_url || not_found_img} alt="" />
            <div className="text col">
              <h2>{speaker.name}</h2>
              <em>{speaker.specialty}</em>
              <hr />
              <p>{speaker.hospital}</p>
            </div>
          </div>
        ))}
      </div>
      <br />
      <br />
      <div className="section_title">{t("parentcraft.sponsors_today")}</div>
      <div className="sponsors_list">
        {info?.sponsors.map((sponsor, index) => (
          <div key={index} className="sponsor row">
            <img src={sponsor.img_url || not_found_img} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Zoom({ link_html }) {
  return (
    <div className="section zoom col">
      <Image src={ZOOM_ILLUSTRATION} />
      <span style={{ fontSize: "1.25em" }}>Join Us On</span>
      <strong>ZOOM MEETING</strong>
      {link_html ? (
        <div
          className="zoom_link"
          dangerouslySetInnerHTML={{ __html: link_html }}
        ></div>
      ) : (
        <span className="zoom_link">Stay tuned</span>
      )}
    </div>
  );
}

export default Parentcraft;
