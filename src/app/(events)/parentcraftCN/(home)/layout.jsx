import HomeNav from "./HomeNav";
import HomeBanner from "./HomeBanner";

function HomeLayout({ children }) {
  return (
    <>
      <HomeBanner />
      <HomeNav />
      <div className="section">{children}</div>
    </>
  );
}

export default HomeLayout;
