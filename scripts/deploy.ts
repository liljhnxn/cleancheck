import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("==========================================");
  console.log("Starting CleanCheck Contract Deployment");
  console.log("==========================================");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error(
      "No deployer signer found. Please ensure PRIVATE_KEY is set in your .env or .env.local file."
    );
  }

  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  const network = await ethers.provider.getNetwork();

  console.log(`Network Name:    ${network.name}`);
  console.log(`Chain ID:        ${network.chainId}`);
  console.log(`Deployer Wallet: ${deployerAddress}`);
  console.log(`Deployer Balance:${ethers.formatEther(balance)} BOT/native tokens`);
  console.log("------------------------------------------");

  console.log("Deploying CleanCheck...");
  const CleanCheckFactory = await ethers.getContractFactory("CleanCheck");
  const cleanCheck = await CleanCheckFactory.deploy();
  await cleanCheck.waitForDeployment();

  const deployedAddress = await cleanCheck.getAddress();
  const txHash = cleanCheck.deploymentTransaction()?.hash;

  console.log("==========================================");
  console.log("CleanCheck successfully deployed!");
  console.log(`Contract Address: ${deployedAddress}`);
  if (txHash) {
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Explorer Link:    https://scan.bohr.life/tx/${txHash}`);
  }
  console.log("==========================================");
  console.log("");
  console.log("NEXT STEPS:");
  console.log("1. Copy this address into your frontend .env.local file:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${deployedAddress}`);
  console.log("2. Restart your Next.js development server (npm run dev).");
  console.log("==========================================");
}

main().catch((error) => {
  console.error("Deployment failed with error:", error);
  process.exitCode = 1;
});
