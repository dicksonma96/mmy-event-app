"use client";
import React from "react";
import Agenda from "@/assets/img/parentcraft/agenda.png";
import Speakers from "@/assets/img/parentcraft/speakers.png";
import Events from "@/assets/img/parentcraft/events.png";
import LuckyDraw from "@/assets/img/parentcraft/luckydraw.png";
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
      route: basePath + "/speakers",
      module: "Speakers",
    },
    {
      icon: Events,
      route: basePath + "/events",
      module: "Events",
    },
    {
      icon: LuckyDraw,
      route: basePath + "/luckydraw",
      module: "Lucky Draw",
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
        >
          <Image src={item.icon} alt={`${item.module} icon`} />
          <span>{item.module}</span>
        </Link>
      ))}
    </div>
  );
}

export default HomeNav;
