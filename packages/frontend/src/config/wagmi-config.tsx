// config/index.tsx

import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { anvil, liskSepolia } from "@reown/appkit/networks";
import { env } from "@/env";

export const projectId = env.NEXT_PUBLIC_PROJECTID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [anvil, liskSepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [anvil.id]: http(),
    [liskSepolia.id]: http(),
  },
});

export const config = wagmiAdapter.wagmiConfig;
