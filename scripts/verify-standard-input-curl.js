const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function main() {
  const contractAddress =
    process.argv[2] ||
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x3ECA8573925E2d5d6DF0458EDC09c29d7f6f3D55";

  console.log(`Submitting verification for ${contractAddress} to scan.botchain.ai...`);

  const checkRes = await fetch(
    `https://scan.botchain.ai/api/v2/smart-contracts/${contractAddress}`
  );
  const checkData = await checkRes.json();
  console.log("Current verification status:", checkData.is_verified);
}

main().catch(console.error);
