import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import { Toaster } from "@/components/ui/toaster";
import ContextProvider from "@/context";
import { kanit } from "@/lib/font";
import { siteConfig } from "@/lib/site";
import "@/styles/globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { headers } from "next/headers";

import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  manifest: `${siteConfig.url}manifest.json`,
  openGraph: {
    type: "website",
    title: siteConfig.name,
    siteName: siteConfig.name,
    url: siteConfig.url,
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}og.png`,
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@devrapture",
    images: [`${siteConfig.url}og.png`], // Must be an absolute URL
  },
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookies = headers().get("cookie");
  return (
    <html lang="en" className={`${kanit.variable} ${kanit.className}`}>
      <body className="flex min-h-dvh flex-col bg-[#2C1F48]">
        <div className="fixed top-0 z-20 flex h-14 w-full items-center justify-center bg-yellow-400 text-center text-[#2C1F48]">
          <p className="text-sm font-semibold">
            You are currently using Lisk Testnet environment. Get Lisk sepolia{" "}
            <Link
              className="text-blue-700 underline"
              href="https://console.optimism.io/faucet"
              target="_blank"
            >
              here
            </Link>
          </p>
        </div>
        <Navbar />
        <ContextProvider cookies={cookies}>
          <div className="flex-1">
            <AntdRegistry>{children}</AntdRegistry>
          </div>
          <Toaster />
        </ContextProvider>
        <Footer />
      </body>
    </html>
  );
}
