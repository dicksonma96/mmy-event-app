import "./home.scss";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Link
        style={{ background: "#ff8282", color: "white", padding: "1em 2em" }}
        href={"/parentcraft"}
      >
        Parentcraft Event App
      </Link>
    </div>
  );
}
