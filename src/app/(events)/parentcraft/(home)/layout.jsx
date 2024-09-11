import Banner from "@/assets/img/parentcraft/banner.jpg";
import Image from "next/image";
import HomeNav from "../component/HomeNav";

function HomeLayout({ children }) {
  return (
    <>
      <div className="banner">
        <div className="info col">
          <h3>Welcome To</h3>
          <h2>Motherhood Parentcraft</h2>
          <div className="date">10/10/2024</div>
        </div>
        <Image src={Banner} alt="parentcraft banner" />
      </div>

      <HomeNav />
      <div className="section">{children}</div>
    </>
  );
}

export default HomeLayout;
