"use client";
import React from "react";
import Agenda from "@/assets/img/parentcraft/agenda.png";
import Speakers from "@/assets/img/parentcraft/speakers.png";
import Slides from "@/assets/img/parentcraft/slides.png";
import Zoom from "@/assets/img/parentcraft/zoom.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/customHooks/useLanguage";

function HomeNav({ setNav, activeNav }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const basePath = "/parentcraft";
  const nav = [
    {
      icon: Agenda,
      route: basePath,
      module: "agenda",
    },
    {
      icon: Speakers,
      route: basePath + "/contributors",
      module: "contributors",
    },
    // {
    //   icon: Events,
    //   route: basePath + "/events",
    //   module: "Events",
    // },
    {
      icon: Slides,
      route: basePath + "/slides",
      module: "slides",
    },
    {
      icon: Zoom,
      route: basePath + "/zoom",
      module: "zoom",
    },
  ];

  return (
    <div className="home_nav row">
      {nav.map((item, index) => (
        <div
          key={index}
          className={`${
            activeNav == item.module ? "nav_active" : ""
          } nav_item col`}
          onClick={() => {
            setNav(item.module);
          }}
        >
          <Image src={item.icon} alt={`${item.module} icon`} />
          <span>{t(`parentcraft.${item.module}`)}</span>
        </div>
      ))}
    </div>
  );
}

export default HomeNav;
