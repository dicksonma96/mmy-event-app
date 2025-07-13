import { Lato } from "next/font/google";
import "./mca.scss";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata = {
  title: "Mother Choice Award 2025",
  description: "Motherhood Choice Award ",
};

export default function HomeLayout({ children }) {
  return <main className={`client_app  ${lato.className}`}>{children}</main>;
}
