const fs = require("fs");

async function check() {
  const addr = "0x4766e84507B7119a12870f536eB1D0BE95a977F6";
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
      `https://scan.bohr.life/api/v2/smart-contracts/${addr}/verification/via/flattened-code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text}`);

    console.log("Waiting 10s...");
    await new Promise(r => setTimeout(r, 10000));

    const checkRes = await fetch(`https://scan.bohr.life/api/v2/smart-contracts/${addr}`);
    const checkData = await checkRes.json();
    console.log("Check:", {
      verified: checkData.is_verified,
      name: checkData.name,
      methods: checkData.has_custom_methods_read
    });

    if (checkData.is_verified) {
      console.log("SUCCESSFULLY VERIFIED ON SCAN.BOHR.LIFE!");
      break;
    }
  }
}

check().catch(console.error);
