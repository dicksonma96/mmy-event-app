"use client";
import Home from "@/assets/img/admin/home.png";
import Parentcraft from "@/assets/img/admin/parentcraft.png";
import ParentcraftCN from "@/assets/img/admin/parentcraft_cn.png";
import Babyfest from "@/assets/img/admin/babyfest.png";
import MCA from "@/assets/img/admin/mca.png";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function MainNav() {
  const pathname = usePathname();

  const paths = [
    {
      icon: Home,
      path: "/admin",
    },
    {
      icon: Parentcraft,
      path: "/admin/parentcraft",
    },
    {
      icon: ParentcraftCN,
      path: "/admin/parentcraft_cn",
      disabled: true,
    },
    {
      icon: Babyfest,
      path: "/admin/babyfest",
      disabled: true,
    },
    {
      icon: MCA,
      path: "/admin/mca",
      disabled: true,
    },
  ];

  return (
    <div className="sidenav col">
      {paths.map((item, index) => (
        <Link
          key={index}
          className={`nav_item row ${pathname == item.path ? "active" : ""}`}
          href={item.path}
          style={
            item.disabled
              ? {
                  filter: "grayscale(1)",
                  opacity: 0.5,
                  pointerEvents: "none",
                }
              : {}
          }
        >
          <Image src={item.icon} alt={item.path} />
        </Link>
      ))}
    </div>
  );
}

export default MainNav;
