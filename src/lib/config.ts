import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainTestnet } from "./chain";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

// Wagmi configuration for Botchain Testnet
export const wagmiConfig = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainTestnet.id]: http(
      process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life"
    ),
  },
  ssr: true,
});
