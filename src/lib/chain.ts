import { defineChain } from "viem";

/**
 * Botchain Mainnet definition for viem and wagmi
 * Chain ID: 677
 * RPC: https://rpc.botchain.ai
 * Explorer: https://scan.botchain.ai
 * Native currency: BOT
 */
export const botchain = defineChain({
  id: 677,
  name: "Botchain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai",
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Botchain Explorer",
      url: "https://scan.botchain.ai",
    },
  },
  testnet: false,
});
