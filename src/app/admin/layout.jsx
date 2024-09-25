import MainNav from "./MainNav";
import "./style.scss";

function AdminLayout({ children }) {
  return (
    <div className="admin row">
      <MainNav />
      <div className="content">{children}</div>
    </div>
  );
}

export default AdminLayout;
