const fs = require("fs");
const path = require("path");

async function main() {
  const buildInfo = require("../artifacts/build-info/2e00870c54e0635829d27a19748f35da.json");
  const contractAddress = "0x4766e84507B7119a12870f536eB1D0BE95a977F6";

  const standardJsonString = JSON.stringify(buildInfo.input);

  console.log("Submitting solidity-standard-json-input to /api...");

  const params = new URLSearchParams();
  params.append("module", "contract");
  params.append("action", "verifysourcecode");
  params.append("contractaddress", contractAddress);
  params.append("codeformat", "solidity-standard-json-input");
  params.append("contractname", "CleanCheck");
  params.append("compilerversion", "v0.8.20+commit.a1b79de6");
  params.append("optimizationUsed", "1");
  params.append("runs", "200");
  params.append("sourceCode", standardJsonString);

  const res = await fetch("https://scan.bohr.life/api", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Response:", data);

  if (data.result) {
    const guid = data.result;
    console.log(`Checking verification status for GUID: ${guid}...`);
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const checkRes = await fetch(
        `https://scan.bohr.life/api?module=contract&action=checkverifystatus&guid=${guid}`
      );
      const checkData = await checkRes.json();
      console.log(`[Attempt ${i + 1}] Status:`, checkData);
      if (checkData.result && checkData.result.toLowerCase().includes("pass")) {
        console.log("SUCCESSFULLY VERIFIED!");
        break;
      }
    }
  }

  // Also verify via contract endpoint
  const finalCheck = await fetch(
    `https://scan.bohr.life/api/v2/smart-contracts/${contractAddress}`
  );
  const finalData = await finalCheck.json();
  console.log("Final check is_verified:", finalData.is_verified);
}

main().catch(console.error);
