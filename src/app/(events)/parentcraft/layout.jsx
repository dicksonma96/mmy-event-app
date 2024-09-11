import "./parentcraft.scss";
import Menu from "./component/Menu";

function ParentcraftLayout({ children }) {
  return (
    <div className="app parentcraft col">
      {children}
      <Menu />
    </div>
  );
}

export default ParentcraftLayout;
