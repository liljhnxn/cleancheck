# CleanCheck — A Simple Web3 Cleanliness Tracker

CleanCheck is a simple, lightweight blockchain-based cleanliness checklist designed for facilities such as hospitals, clinics, schools, and offices.

Connected users can record when designated cleaning tasks have been completed. Each completion is permanently recorded on **Botchain Mainnet**, and the dashboard displays live, transparent completion counters and status directly from the smart contract.

> **Portfolio Disclaimer:** CleanCheck is a portfolio demonstration dApp. Records are submitted by users on-chain and do not independently verify or prove that cleaning physically took place.

---

## 1. Features

- **Fixed Cleaning Tasks:**
  1. *Clean waiting room* (Task ID: `1`)
  2. *Clean reception desk* (Task ID: `2`)
  3. *Empty waste bin* (Task ID: `3`)
- **UTC Day Tracking:** Each wallet address can complete each task at most once per UTC day, preventing duplicate submissions on the same day while allowing repeated completions on subsequent days.
- **On-Chain Counters:** Live total completions and per-task completion counters are queried directly from the smart contract via `wagmi` and `viem`.
- **Wallet Connection:** Seamless Web3 wallet connectivity (MetaMask, Rabby, Coinbase Wallet, Browser Injected, or WalletConnect).
- **Network Awareness:** Automatically detects Botchain Mainnet (Chain ID `677`) and alerts the user to switch networks if needed.
- **Recent On-Chain Activity:** Queries `TaskCompleted` events directly from the blockchain to display recent verifiable submissions.

---

## 2. Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS (Custom dark aesthetic: `#15171C` background, `#20232B` cards, `#45C4B0` teal accent)
- **Web3 Integration:** `wagmi`, `viem`, `@tanstack/react-query`, `@reown/appkit`
- **Smart Contract & Tooling:** Solidity `^0.8.20`, Hardhat, Chai, TypeScript
- **Target Network:** Botchain Mainnet (Chain ID: `677`, Currency: `BOT`)

---

## 3. Network Configuration (Botchain Mainnet)

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Currency Symbol** | `BOT` |
| **Currency Decimals** | `18` |
| **Total Supply** | `150,000,000 BOT` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |

---

## 4. Prerequisites

- [Node.js](https://nodejs.org/) v18+ (tested on Node v25)
- npm or yarn
- A Web3 wallet browser extension (e.g., MetaMask, Rabby)
- `BOT` tokens for the deployer wallet (for gas fees)

---

## 5. Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd cleancheck
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file by copying the template:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Botchain Mainnet RPC
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai

# Deployed Smart Contract Address (add after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55

# Private key of the deployer wallet (REQUIRED only for deploying the contract)
PRIVATE_KEY=your_private_key_here

# Optional: Reown / WalletConnect Cloud Project ID (from https://cloud.reown.com)
NEXT_PUBLIC_PROJECT_ID=
```

> **Security Note:** Never commit your private key or `.env.local` to Git. `.gitignore` is already configured to exclude environment and secret files.

---

## 6. Smart Contract: Compile & Test

### Compile the Solidity Contract

```bash
npm run compile
```

### Run the Test Suite

Run the comprehensive 11-point test suite covering deployment, task ID validations, UTC day duplicate prevention, time skipping, multi-wallet interactions, and event emissions:

```bash
npm run test
```

---

## 7. Deploying to Botchain Mainnet

Ensure you have set `PRIVATE_KEY` in `.env.local` with some `BOT` balance:

```bash
npm run deploy:mainnet
```

The script will:
1. Verify the deployer account balance on Botchain Mainnet.
2. Estimate the minimal required gas units and set an optimal gas price (20 gwei).
3. Deploy the `CleanCheck` contract.
4. Print the deployed contract address and transaction hash with an explorer link.
5. Automatically update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

---

## 8. Running the Frontend Locally

After configuring `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

1. Connect your wallet (e.g. MetaMask).
2. If your wallet is on another network, click **"Switch to Botchain Mainnet"**.
3. Click **"Mark as Cleaned"** on any task to record a cleanliness completion.
4. Confirm the transaction in your wallet and observe the on-chain confirmation and live counter updates.

---

## 9. Deploying to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Environment Variables**, configure:
   - `NEXT_PUBLIC_BOTCHAIN_RPC_URL` = `https://rpc.botchain.ai`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55`
   - `NEXT_PUBLIC_PROJECT_ID` = `<your_reown_project_id>` *(optional)*
4. Click **Deploy**.

---

## 10. Viewing on the Block Explorer

You can inspect the deployed contract and all transactions on the Botchain block explorer:
- Contract View: [https://scan.botchain.ai/address/0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55](https://scan.botchain.ai/address/0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55)
- BOT Chain Website: [https://botchain.ai](https://botchain.ai)
- BOT Chain Explorer: [https://scan.botchain.ai](https://scan.botchain.ai)
