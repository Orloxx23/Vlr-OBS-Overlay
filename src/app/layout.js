import { Montserrat } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Taply | Valorant OBS Overlay",
  description: "Valorant OBS Overlay for streamers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
