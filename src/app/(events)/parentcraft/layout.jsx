import "./parentcraft.scss";
import Menu from "./component/Menu";
import AblyContainer from "./ably";
import { Suspense } from "react";
import PageLoading from "./component/PageLoading";

function ParentcraftLayout({ children }) {
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
