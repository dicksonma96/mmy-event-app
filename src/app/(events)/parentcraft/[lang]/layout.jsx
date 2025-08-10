"use client";
import "./parentcraft.scss";
import { useEffect } from "react";
import AblyContainer from "./ably";
import { Suspense } from "react";
import PageLoading from "./component/PageLoading";
import Menu from "./component/Menu";
import { useRouter, usePathname } from "next/navigation";

async function ParentcraftLayout({ children, params }) {
  const allowedLangs = ["eng", "cn", "bm"];
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!allowedLangs.includes(params.lang)) {
      // Replace current URL without adding to history
      router.replace("/parentcraft/eng");
    }
  }, [params.lang, router]);

  return (
    <AblyContainer>
      <div className="app parentcraft col">
        <Suspense fallback={<PageLoading />}>{children}</Suspense>
        <Menu />
      </div>
    </AblyContainer>
  );
}

export default ParentcraftLayout;
