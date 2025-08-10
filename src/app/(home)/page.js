import "./home.scss";
import Link from "next/link";

const buttonStyle = {
  background: "#ff8282",
  color: "white",
  padding: "1em 2em",
  width: "200px",
  textAlign: "center",
};

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Link style={buttonStyle} href={"/parentcraft"}>
        Parentcraft EN
      </Link>
      <Link style={buttonStyle} href={"/parentcraft?lang=cn"}>
        Parentcraft CN
      </Link>
      <Link style={buttonStyle} href={"/parentcraft?lang=bm"}>
        Parentcraft BM
      </Link>
    </div>
  );
}
