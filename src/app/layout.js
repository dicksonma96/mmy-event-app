import { Inter } from "next/font/google";
import "./global.css";
const inter = Inter({ subsets: ["latin"] });
import Logo from "@/assets/img/admin/home.png";

export const metadata = {
  title: "Motherhood Events",
  description: "Motherhood Events",
  icons: {
    icon: "https://media.nurengroup.com/lib/images/favicon/nuren_favicon2.ico",
  },
  openGraph: {
    images: Logo,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
