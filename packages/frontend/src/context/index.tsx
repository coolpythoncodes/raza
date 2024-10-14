// context/index.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { anvil, liskSepolia } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { siteConfig } from "@/lib/site";
import { wagmiAdapter, projectId } from "@/config/wagmi-config";
import { env } from "@/env";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Raza",
  description: siteConfig.description,
  // url: "https://reown.com/appkit", // origin must match your domain & subdomain
  // icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [liskSepolia, anvil],
  defaultNetwork:
    env.NEXT_PUBLIC_ENVIRONMENT === "development" ? anvil : liskSepolia,
  // @ts-expect-error unknown error
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
