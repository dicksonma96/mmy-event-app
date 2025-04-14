"use client";
import React from "react";
import Agenda from "@/assets/img/parentcraft/agenda.png";
import Speakers from "@/assets/img/parentcraft/speakers.png";
import Events from "@/assets/img/parentcraft/events.png";
import Slides from "@/assets/img/parentcraft/slides.png";
import App from "@/assets/img/parentcraft/our_app.png";
import Zoom from "@/assets/img/parentcraft/zoom.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeNav() {
  const pathname = usePathname();
  const basePath = "/parentcraft";
  const nav = [
    {
      icon: Agenda,
      route: basePath,
      module: "Agenda",
    },
    {
      icon: Speakers,
      route: basePath + "/contributors",
      module: "Contributors",
    },
    // {
    //   icon: Events,
    //   route: basePath + "/events",
    //   module: "Events",
    // },
    {
      icon: Slides,
      route: basePath + "/slides",
      module: "Slides",
    },
    {
      icon: Zoom,
      route: basePath + "/zoom",
      module: "Zoom",
    },
  ];

  return (
    <div className="home_nav row">
      {nav.map((item, index) => (
        <Link
          key={index}
          href={item.route}
          className={`${
            pathname == item.route ? "nav_active" : ""
          } nav_item col`}
          target={item.target ? item.target : "_self"}
        >
          <Image src={item.icon} alt={`${item.module} icon`} />
          <span>{item.module}</span>
        </Link>
      ))}
    </div>
  );
}

export default HomeNav;
