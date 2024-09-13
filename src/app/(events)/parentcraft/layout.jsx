import "./parentcraft.scss";
import Menu from "./component/Menu";
import AblyContainer from "./ably";

function ParentcraftLayout({ children }) {
  return (
    <AblyContainer>
      <div className="app parentcraft col">
        {children}
        <Menu />
      </div>
    </AblyContainer>
  );
}

export default ParentcraftLayout;
