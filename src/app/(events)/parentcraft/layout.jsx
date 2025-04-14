import "./parentcraft.scss";
import Menu from "./component/Menu";
import AblyContainer from "./ably";
import { Suspense } from "react";
import PageLoading from "./component/PageLoading";
import getDatabase from "@/lib/mongo/mongoConnection";
import { unstable_noStore as noStore } from "next/cache";
import RedirectComponent from "@/app/components/RedirectComponent";

async function ParentcraftLayout({ children }) {
  noStore();
  const db = await getDatabase();
  const collection = db.collection("event_config");

  const data = await collection.find({ event: "parentcraft" }).toArray();

  // console.log(data);

  if (data[0].online == false) {
    let redirectUrl =
      data[0].offline_redirect || "https://www.motherhood.com.my/home";
    return <RedirectComponent url={redirectUrl} />;
  }

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
