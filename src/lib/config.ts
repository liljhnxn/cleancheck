import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchain } from "./chain";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

// Wagmi configuration for Botchain Mainnet
export const wagmiConfig = createConfig({
  chains: [botchain],
  connectors: [
    injected(),
  ],
  transports: {
    [botchain.id]: http(
      process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"
    ),
  },
  ssr: true,
});
