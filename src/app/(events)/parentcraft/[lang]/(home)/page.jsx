"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Banner from "@/assets/img/parentcraft/banner.jpg";
import HomeNav from "./HomeNav";
import { useLanguage } from "@/app/customHooks/useLanguage";
import PageLoading from "../component/PageLoading";
import ZOOM_ILLUSTRATION from "@/assets/img/parentcraft/zoom_logo.png";
import { GetSpeakerSlides } from "./serverAction";

function Parentcraft({ params }) {
  // ["agenda", "contributors", "slides", "zoom"]
  const { lang } = params;

  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState("agenda");
  const [data, setData] = useState([]);
  const [slides, setSlides] = useState([]);
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

    const fetchSlides = async () => {
      try {
        const slidesData = await GetSpeakerSlides(lang);
        if (slidesData.success) {
          setSlides(slidesData.data);
        } else {
          throw new Error(slidesData.message || "Failed to fetch slides");
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchData();
    fetchSlides();
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
          {nav == "slides" && <SlideListing data={slides} />}
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
        {info?.speakers?.map((speaker, index) => (
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
        {info?.sponsors?.map((sponsor, index) => (
          <div key={index} className="sponsor row">
            <img src={sponsor.img_url || not_found_img} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Zoom({ link_html }) {
  const { t } = useLanguage();

  return (
    <div className="section zoom col">
      <Image src={ZOOM_ILLUSTRATION} />
      <span style={{ fontSize: "1.25em" }}>{t("parentcraft.join_us_on")}</span>
      <strong>{t("parentcraft.zoom_meeting")}</strong>
      {link_html ? (
        <div
          className="zoom_link"
          dangerouslySetInnerHTML={{ __html: link_html }}
        ></div>
      ) : (
        <span className="zoom_link">{t("parentcraft.stay_tuned")}</span>
      )}
    </div>
  );
}

function SlideListing({ data }) {
  const { t } = useLanguage();
  const [slideUrl, setSlideUrl] = useState(null);
  return (
    <>
      {slideUrl && (
        <div className="overlay_modal slide_modal col">
          <iframe
            allowfullscreen="true"
            src={slideUrl}
            frameBorder={0}
          ></iframe>
          <span
            className="material-symbols-outlined close_btn"
            onClick={() => {
              setSlideUrl(null);
            }}
          >
            close
          </span>
        </div>
      )}
      <section className="section col">
        <div className="section_title">{t("parentcraft.slides_today")}</div>
        <div className="slides_list col">
          {data?.speaker_slides?.map((item, index) => {
            return (
              <div
                key={index}
                className="slide_item row"
                onClick={() => setSlideUrl(item.slides_url)}
              >
                {item.slides_name}
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Parentcraft;
