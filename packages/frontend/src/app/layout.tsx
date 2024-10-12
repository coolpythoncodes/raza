import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { kanit } from "@/lib/font";
import { siteConfig } from "@/lib/site";
import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${kanit.variable} ${kanit.className}`}>
      <body className="flex min-h-dvh flex-col bg-[#2C1F48]">
        <div className="fixed top-0 z-50 w-full bg-yellow-400 h-14 text-center text-[#2C1F48] flex items-center justify-center">
          <p className="text-sm font-semibold">
            You are currently using Lisk Testnet environment. Please note that
            all transactions are for testing purposes only.
          </p>
        </div>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
