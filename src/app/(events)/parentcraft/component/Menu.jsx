"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function Menu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "eng";
  const basePath = "/parentcraft";
  const routes = [
    {
      icon: "home",
      route: basePath + "?lang=" + lang,
    },
    {
      icon: "forum",
      route: basePath + "/chatroom?lang=" + lang,
    },
    // {
    //   icon: "live_tv",
    //   route: basePath + "/live-stream",
    // },
  ];
  return (
    <div className="menu row">
      {routes.map((route, index) => {
        return (
          <Link
            key={index}
            className={`menu_item row 
              ${
                //pathname.includes(route.route) ? "active" : ""
                ""
              }
              `}
            href={route.route}
          >
            <span className="material-symbols-outlined">{route.icon}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default Menu;
