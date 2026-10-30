# CleanCheck Whitepaper

**Decentralized Facility Cleanliness & Sanitation Verification Protocol on Botchain**

*Version 1.0 — October 2026*  
*Project Repository: [liljhnxn/cleancheck](https://github.com/liljhnxn/cleancheck)*  
*Smart Contract Address: [`0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55`](https://scan.botchain.ai/address/0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55)*  
*Network: Botchain Mainnet (Chain ID: `677`)*  
*Explorer: [scan.botchain.ai](https://scan.botchain.ai)*  
*BOT Chain Website: [botchain.ai](https://botchain.ai)*  

---

## 1. Executive Summary

Maintaining consistent sanitation standards in shared environments—such as outpatient clinics, hospital reception areas, schools, and enterprise offices—is critical to public health, infection prevention, and operational trust. However, current facility maintenance workflows rely almost universally on paper clipboards, magnetic door signs, or closed internal software that can be easily backdated, modified, or forged during health inspections.

**CleanCheck** is a lightweight, tamper-resistant decentralized cleanliness checklist and verification protocol deployed on **Botchain**. CleanCheck allows designated custodial staff, facility operators, and authorized personnel to sign and record task completions directly on the blockchain. 

By leveraging native cryptographic time-indexing (UTC day calculations) and immutable event logging, CleanCheck ensures that sanitation records cannot be retroactively altered, fabricated, or spammed. With its **Zero-PII / Zero-PHI** design, CleanCheck delivers verifiable operational accountability without storing any personal or private data on-chain.

---

## 2. Problem Statement

### 2.1 The Vulnerability of Paper & Centralized Logs
In high-traffic environments, physical paper clipboards hung behind doors or in waiting areas are the industry standard for sanitization logs. These physical records suffer from several fundamental flaws:
* **Retroactive Falsification:** Staff can sign off on missed days or future times in a single batch right before an inspection.
* **Lack of Real-Time Visibility:** Supervisors and building occupants cannot verify whether an area was actually disinfected today without physically walking over to inspect the paper sheet.
* **Loss & Tampering:** Paper records are frequently lost, water-damaged, or replaced without an audit trail.

### 2.2 Proprietary Software Silos
Where enterprise digital facilities software exists, it is locked within walled gardens requiring expensive per-seat licenses, complex hardware integrations, and centralized cloud databases. These databases provide no trustless verification layer for third-party health auditors or the general public visiting the facility.

---

## 3. The CleanCheck Protocol

CleanCheck introduces a lean, gas-efficient on-chain protocol that transforms everyday cleaning routines into verifiable, immutable records.

```
       +---------------------------------------------+
       |             Custodial Staff / App           |
       +---------------------------------------------+
                              |
                     Sign Transaction
               completeTask(taskId = 1 | 2 | 3)
                              v
    +---------------------------------------------------+
    |                 CleanCheck.sol                    |
    |  - Enforce Valid Task ID (1..3)                   |
    |  - Compute UTC Day: block.timestamp / 86400       |
    |  - Verify: lastCompletionDay != currentDay        |
    |  - Store: lastCompletionDay[caller][taskId] = Day |
    |  - Increment: taskCompletionCounts & total        |
    |  - Emit: TaskCompleted(...)                       |
    +---------------------------------------------------+
                              |
               State Updated & Event Emitted
                              v
       +---------------------------------------------+
       |    Real-Time Dashboard & Public Explorer    |
       |  - Live task status (Completed vs Pending)  |
       |  - Verifiable transaction receipts          |
       |  - Historical log of sanitation events      |
       +---------------------------------------------+
```

### 3.1 Standardized Core Tasks
CleanCheck standardizes essential high-touch operational tasks:
1. **Task 1: Clean Waiting Room** — Disinfection of seating, tables, door handles, and public touchpoints.
2. **Task 2: Clean Reception Desk** — Sanitization of counters, check-in terminals, and front-desk surfaces.
3. **Task 3: Empty Waste Bin** — Safe disposal of waste containers and replacement of liners.

### 3.2 Anti-Duplicate UTC Day Cadence
To prevent double-submission and spamming within the same work shift, CleanCheck calculates an on-chain day index:
$$\text{Day Index} = \left\lfloor \frac{\text{block.timestamp}}{86400} \right\rfloor$$
Each wallet address can record completion for any given task ID at most once per UTC day. Subsequent attempts by the same address on the same day revert immediately with `TaskAlreadyCompletedToday`.

---

## 4. Privacy & Compliance Architecture (Zero-PII / Zero-PHI)

Health facilities and enterprise environments operate under stringent data privacy standards (such as HIPAA, GDPR, and OSHA guidelines). Storing employee identification numbers, staff names, patient records, or internal shift rosters on a public blockchain introduces severe legal and compliance vulnerabilities.

CleanCheck solves this through **Zero-PII / Zero-PHI by Design**:
* **No Identifying Information:** The smart contract stores only the submitting `address`, `taskId`, and `day` index.
* **Pseudonymous Cryptographic Attribution:** Facility credentials and staff identity mapping can be maintained off-chain by the organization while the blockchain guarantees temporal validity and completion integrity.
* **Public Auditability without Risk:** Anyone—from facility managers to patients—can view the live checklist status without exposing any private data.

---

## 5. Smart Contract Architecture

The CleanCheck protocol is implemented in Solidity (`^0.8.20`) and deployed on Botchain Mainnet.

### 5.1 Contract Interface & Methods

* **`completeTask(uint256 taskId)`**: Validates that `taskId` is between 1 and 3, ensures the caller hasn't submitted today, increments completion counters, and emits `TaskCompleted`.
* **`hasCompletedToday(address user, uint256 taskId)`**: Pure/view check returning whether a wallet has completed a given task during the active UTC day.
* **`getTaskCompletionCount(uint256 taskId)`**: Returns total all-time completions for a specific task.
* **`getTotalCompletions()`**: Returns total aggregate completions across all tasks and users.
* **`getCurrentDay()`**: Utility function exposing the on-chain day index.

### 5.2 Event Specification

```solidity
event TaskCompleted(
    address indexed user,
    uint256 indexed taskId,
    uint256 day,
    uint256 timestamp
);
```

Events are indexed by `user` and `taskId`, enabling instant sub-second filtering via RPC log queries for real-time dashboard updates without needing heavy indexing infrastructure.

---

## 6. Frontend & Application Architecture

CleanCheck provides an intuitive, high-performance web dashboard built on modern Web3 tooling:
* **Next.js 14 (App Router) & React:** Server-rendered shell with optimized client components.
* **Wagmi v2 & Viem:** Type-safe Ethereum client interactions with multi-wallet support (MetaMask, Rabby, Coinbase Wallet, Browser Injected).
* **TanStack React Query v5:** Automated background refetching and cache invalidation upon transaction confirmations.
* **Tailwind CSS Hospital Aesthetic:** Dark-mode slate/charcoal background (`#15171C`), contrast card containers (`#20232B`), and teal accents (`#45C4B0`) engineered for clarity and low eye-strain in facility workstations.

---

## 7. Economics & Gas Efficiency

Built specifically for high-frequency daily operations, CleanCheck is optimized for minimal gas consumption:
* **O(1) Direct Storage Mappings:** No dynamic arrays or loops in write transactions.
* **Custom Errors:** Utilizes Solidity custom errors (`InvalidTaskId`, `TaskAlreadyCompletedToday`) rather than expensive error strings, minimizing bytecode and revert costs.
* **Low-Cost Transactions on Botchain:** Near-zero transaction fees on Botchain allow facilities to log dozens of daily tasks without incurring burdensome operational overhead.

---

## 8. Strategic Roadmap

### Phase 1: Core Protocol Launch (Current)
- [x] Solidity smart contract deployment on Botchain Mainnet (`0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55`).
- [x] Web3 dApp with wallet integration, live counters, and anti-duplicate day tracking.
- [x] Comprehensive test suite with Hardhat and Chai.

### Phase 2: Hardware & Physical Integration
- [ ] NFC / QR tag scanning: Cleaners tap an on-wall NFC tag to trigger mobile wallet transaction signing.
- [ ] Supervisor multi-signature sign-off for end-of-shift audits.

### Phase 3: Enterprise & Multi-Facility Scaling
- [ ] Multi-tenant facility IDs: Enable hospitals and multi-building campuses to deploy isolated task suites under a single master registry.
- [ ] Automated compliance reporting: One-click export of verifiable cryptographic audit trails for regulatory bodies.

---

## 9. Conclusion & Disclaimer

CleanCheck demonstrates how decentralized technology can solve an everyday operational trust problem in healthcare and facility management. By replacing vulnerable paper sign-off sheets with immutable on-chain state updates, CleanCheck provides tamper-proof operational transparency while safeguarding privacy.

*Disclaimer: CleanCheck is a demonstration decentralized application. On-chain completion records signify that an authorized transaction was broadcasted; they do not physically guarantee the chemical or biological efficacy of cleaning actions.*
