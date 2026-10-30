const fs = require("fs");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function check() {
  const addr = process.argv[2] || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!addr) {
    throw new Error("No contract address provided or found in NEXT_PUBLIC_CONTRACT_ADDRESS");
  }

  console.log(`Verifying contract at ${addr} on scan.botchain.ai...`);
  const sourceCode = fs.readFileSync("contracts/CleanCheck.sol", "utf8");

  for (const evm of ["paris", "default", "shanghai"]) {
    console.log(`\n--- Submitting with evm_version: ${evm} ---`);
    const payload = {
      compiler_version: "v0.8.20+commit.a1b79de6",
      source_code: sourceCode,
      contract_name: "CleanCheck",
      is_optimization_enabled: true,
      optimization_runs: 200,
      evm_version: evm,
      constructor_args: ""
    };

    const res = await fetch(
      `https://scan.botchain.ai/api/v2/smart-contracts/${addr}/verification/via/flattened-code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text}`);

    console.log("Waiting 10s for verification to process...");
    await new Promise(r => setTimeout(r, 10000));

    const checkRes = await fetch(`https://scan.botchain.ai/api/v2/smart-contracts/${addr}`);
    const checkData = await checkRes.json();
    console.log("Check:", {
      verified: checkData.is_verified,
      name: checkData.name,
      methods: checkData.has_custom_methods_read
    });

    if (checkData.is_verified) {
      console.log("SUCCESSFULLY VERIFIED ON SCAN.BOTCHAIN.AI!");
      break;
    }
  }
}

check().catch(console.error);
