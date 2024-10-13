import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import ContextProvider from "@/context";
import { kanit } from "@/lib/font";
import { siteConfig } from "@/lib/site";
import { headers } from "next/headers";
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
  const cookies = headers().get("cookie");
  return (
    <html lang="en" className={`${kanit.variable} ${kanit.className}`}>
      <body className="flex min-h-dvh flex-col bg-[#2C1F48]">
        <div className="fixed top-0 z-50 flex h-14 w-full items-center justify-center bg-yellow-400 text-center text-[#2C1F48]">
          <p className="text-sm font-semibold">
            You are currently using Lisk Testnet environment. Please note that
            all transactions are for testing purposes only.
          </p>
        </div>
        <Navbar />
        <ContextProvider cookies={cookies}>
          <div className="flex-1">{children}</div>
        </ContextProvider>
        <Footer />
      </body>
    </html>
  );
}
