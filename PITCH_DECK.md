# CleanCheck — Pitch Deck

**Decentralized Facility Cleanliness & Sanitation Verification on Botchain**

---

### Slide 1: Cover
* **Title:** CleanCheck 🧼📋
* **Subtitle:** Trustless, Real-Time Facility Sanitation Verification on Blockchain
* **Network:** Built on Botchain Mainnet (Chain ID: `677`)
* **Tagline:** *"Eliminating falsified clipboards with immutable on-chain cleanliness records."*
* **Links:**
  * GitHub: [github.com/liljhnxn/cleancheck](https://github.com/liljhnxn/cleancheck)
  * Smart Contract: [`0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55`](https://scan.botchain.ai/address/0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55)
  * Block Explorer: [scan.botchain.ai](https://scan.botchain.ai)
  * BOT Chain Website: [botchain.ai](https://botchain.ai)

---

### Slide 2: The Real-World Problem
* **The Clipboard Dilemma:** Hospitals, clinics, and commercial facilities rely on paper clipboards hanging behind doors to track sanitization.
* **Temptation to "Pencil-Whip":** Paper logs are routinely backdated, filled out in bulk right before inspections, or forged entirely.
* **Audit Blindness:** Health inspectors, administrators, and the public have zero real-time visibility into whether a clinic was genuinely cleaned today.
* **High Infection Risks:** Unverified cleaning in high-traffic zones leads to preventable hospital-acquired infections (HAIs) and lost customer trust.

---

### Slide 3: The Insight
* **Facility logs don't need complex data—they need indisputable temporal proof.**
* When an authorized cleaner signs a routine task, the single most critical guarantee is:
  1. *Did it happen today?*
  2. *Was it recorded in real time rather than backdated?*
  3. *Can anyone independently verify the log without asking for permission?*
* **Blockchain is the ideal timestamp and proof-of-work registry for facility operations.**

---

### Slide 4: The Solution — CleanCheck
* **Decentralized Facility Checklist:** A lightweight Web3 application enabling custodial staff and facility managers to record daily sanitization tasks on-chain.
* **Tamper-Proof State:** Once signed and broadcast, records are mathematically impossible to forge, delete, or retroactively edit.
* **Instant Public & Staff Visibility:** Real-time counters showing total facility completions and task breakdown directly from the blockchain.

---

### Slide 5: How It Works
* **1. Connect Wallet:** Custodial staff or facility managers connect their Web3 wallet.
* **2. Standardized Tasks:**
  * Task 1: *Clean waiting room*
  * Task 2: *Clean reception desk*
  * Task 3: *Empty waste bin*
* **3. Cryptographic Sign-Off:** One click signs and broadcasts `completeTask(taskId)` to Botchain.
* **4. Anti-Duplicate UTC Enforcement:** The smart contract ensures each task can only be completed once per wallet per day, preventing spam and double-counting.

---

### Slide 6: Zero-PII / Zero-PHI Privacy Moat
* **Zero Medical or Personal Data:** The smart contract stores only the submitting address, task ID, and UTC day timestamp.
* **HIPAA & GDPR Compliant:** No employee names, ID numbers, or patient information ever touches the chain.
* **Decoupled Identity:** Organizations maintain internal employee-to-wallet mapping off-chain, achieving public auditability without leaking internal roster data.

---

### Slide 7: Technical Architecture & Performance
* **Smart Contract:** Solidity `^0.8.20` running on Botchain Mainnet (Chain ID `677`).
* **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript.
* **Web3 Integration:** Wagmi v2 + Viem + TanStack React Query v5.
* **Ultra-Low Gas Overhead:** Pure $O(1)$ storage mappings and custom error reverts ensure transaction costs are negligible (~0.008 BOT per deployment/interaction).

---

### Slide 8: Enterprise & Commercial Value
* **Healthcare Facilities & Clinics:** Verifiable compliance records for healthcare accreditation and regulatory inspections.
* **Commercial Real Estate & Coworking:** Public-facing dashboard screens that reassure tenants and visitors of daily cleanliness.
* **Educational Institutions & Schools:** Transparent accountability across multi-building campuses.
* **Insurance Premium Reduction:** Verifiable on-chain maintenance history can lower liability insurance costs.

---

### Slide 9: Strategic Roadmap
* **Phase 1 (Completed):** Smart contract deployed on Botchain Mainnet; live interactive web application with real-time counters and anti-spam controls.
* **Phase 2 (Near-Term):** On-wall NFC & QR code integration allowing staff to tap a phone or badge to sign transactions instantly.
* **Phase 3 (Enterprise):** Multi-tenant campus registries, supervisor multi-signature verification, and automated CSV/PDF compliance export.

---

### Slide 10: Summary & Traction
* **Live Smart Contract:** [`0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55`](https://scan.botchain.ai/address/0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55) on Botchain Mainnet.
* **Open Source Repository:** [github.com/liljhnxn/cleancheck](https://github.com/liljhnxn/cleancheck)
* **Status:** Fully functional, verified on mainnet, and ready for immediate evaluation.
