const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function main() {
  console.log("==========================================");
  console.log("Starting CleanCheck Mainnet Deployment");
  console.log("==========================================");

  const rawPrivateKey = process.env.PRIVATE_KEY?.trim();
  if (!rawPrivateKey) {
    throw new Error(
      "No PRIVATE_KEY found. Please ensure PRIVATE_KEY is set in your .env or .env.local file."
    );
  }

  const privateKey = rawPrivateKey.startsWith("0x")
    ? rawPrivateKey
    : `0x${rawPrivateKey}`;

  const rpcUrl = process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
  console.log(`Connecting to RPC: ${rpcUrl}...`);
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  console.log(`Target Chain ID:  ${chainId} (Expected: 677 for Mainnet)`);

  const wallet = new ethers.Wallet(privateKey, provider);
  const deployerAddress = wallet.address;
  const balance = await provider.getBalance(deployerAddress);

  console.log(`Deployer Wallet:  ${deployerAddress}`);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOT`);
  console.log("------------------------------------------");

  // Load compiled artifact
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/CleanCheck.sol/CleanCheck.json"
  );
  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      `Artifact not found at ${artifactPath}. Please run 'npm run compile' first.`
    );
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  console.log("Estimating minimal deployment gas fee...");
  const deployTx = await factory.getDeployTransaction();
  const estimatedGas = await provider.estimateGas(deployTx);
  const feeData = await provider.getFeeData();
  
  // Use current network gas price (typically 20 gwei)
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  // Tight gas limit: estimated gas + 5% safety buffer so we do not over-allocate gas
  const gasLimit = (estimatedGas * 105n) / 100n;
  const estimatedFee = gasLimit * gasPrice;

  console.log(`Gas Limit:        ${gasLimit.toString()} units`);
  console.log(`Gas Price:        ${ethers.formatUnits(gasPrice, "gwei")} gwei`);
  console.log(`Max Fee:          ${ethers.formatEther(estimatedFee)} BOT`);
  console.log("------------------------------------------");

  if (balance < estimatedFee) {
    throw new Error(
      `Insufficient BOT balance. Balance: ${ethers.formatEther(balance)} BOT, Needed: ${ethers.formatEther(estimatedFee)} BOT`
    );
  }

  console.log("Deploying CleanCheck contract to Botchain Mainnet...");
  const contract = await factory.deploy({
    gasLimit,
    gasPrice,
  });

  console.log("Transaction submitted! Waiting for confirmation...");
  const txResponse = contract.deploymentTransaction();
  console.log(`Transaction Hash: ${txResponse.hash}`);

  await contract.waitForDeployment();
  const deployedAddress = await contract.getAddress();

  console.log("==========================================");
  console.log("CleanCheck successfully deployed to Mainnet!");
  console.log(`Contract Address: ${deployedAddress}`);
  console.log(`Explorer Link:    https://scan.botchain.ai/tx/${txResponse.hash}`);
  console.log(`Contract Page:    https://scan.botchain.ai/address/${deployedAddress}`);
  console.log("==========================================");

  // Automatically update .env.local with deployed contract address
  const envLocalPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envLocalPath)) {
    let envContent = fs.readFileSync(envLocalPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${deployedAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${deployedAddress}\n`;
    }
    fs.writeFileSync(envLocalPath, envContent, "utf8");
    console.log("Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
  }

  console.log("");
  console.log("NEXT STEPS:");
  console.log("1. Verify contract on https://scan.botchain.ai");
  console.log("2. Restart your Next.js development server (npm run dev).");
  console.log("==========================================");

  return { deployedAddress, txHash: txResponse.hash };
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Deployment failed with error:", error);
    process.exitCode = 1;
  });
}

module.exports = { main };
