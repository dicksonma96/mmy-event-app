import { Inter } from "next/font/google";
import "./global.css";
const inter = Inter({ subsets: ["latin"] });
import Logo from "@/assets/img/admin/home.png";
import NavigateLoader from "./NavigateLoader";

export const metadata = {
  title: "Motherhood Events",
  description: "Motherhood Events",
  icons: {
    icon: "/favicon-32x32.png",
  },
  openGraph: {
    images: Logo,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigateLoader>{children}</NavigateLoader>
      </body>
    </html>
  );
}
