import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { CleanCheck } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("CleanCheck Smart Contract", function () {
  let cleanCheck: CleanCheck;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const CleanCheckFactory = await ethers.getContractFactory("CleanCheck");
    cleanCheck = (await CleanCheckFactory.deploy()) as CleanCheck;
    await cleanCheck.waitForDeployment();
  });

  // Requirement 1: The contract deploys successfully.
  it("1. Should deploy successfully with initial counters at 0", async function () {
    const address = await cleanCheck.getAddress();
    expect(address).to.be.properAddress;
    expect(await cleanCheck.getTotalCompletions()).to.equal(0);
    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(0);
    expect(await cleanCheck.getTaskCompletionCount(2)).to.equal(0);
    expect(await cleanCheck.getTaskCompletionCount(3)).to.equal(0);
  });

  // Requirement 2: Task IDs 1, 2, and 3 are accepted.
  it("2. Should accept task IDs 1, 2, and 3", async function () {
    await expect(cleanCheck.connect(user1).completeTask(1)).to.not.be.reverted;
    await expect(cleanCheck.connect(user1).completeTask(2)).to.not.be.reverted;
    await expect(cleanCheck.connect(user1).completeTask(3)).to.not.be.reverted;

    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(1);
    expect(await cleanCheck.getTaskCompletionCount(2)).to.equal(1);
    expect(await cleanCheck.getTaskCompletionCount(3)).to.equal(1);
    expect(await cleanCheck.getTotalCompletions()).to.equal(3);
  });

  // Requirement 3: Invalid task IDs are rejected.
  it("3. Should reject invalid task IDs (0, 4, 99)", async function () {
    await expect(cleanCheck.connect(user1).completeTask(0))
      .to.be.revertedWithCustomError(cleanCheck, "InvalidTaskId")
      .withArgs(0);

    await expect(cleanCheck.connect(user1).completeTask(4))
      .to.be.revertedWithCustomError(cleanCheck, "InvalidTaskId")
      .withArgs(4);

    await expect(cleanCheck.connect(user1).completeTask(99))
      .to.be.revertedWithCustomError(cleanCheck, "InvalidTaskId")
      .withArgs(99);

    await expect(cleanCheck.getTaskCompletionCount(0))
      .to.be.revertedWithCustomError(cleanCheck, "InvalidTaskId");

    await expect(cleanCheck.hasCompletedToday(user1.address, 4))
      .to.be.revertedWithCustomError(cleanCheck, "InvalidTaskId");
  });

  // Requirement 4: A wallet can complete a task successfully.
  it("4. Should allow a wallet to complete a task successfully", async function () {
    const tx = await cleanCheck.connect(user1).completeTask(1);
    await tx.wait();

    const completed = await cleanCheck.hasCompletedToday(user1.address, 1);
    expect(completed).to.be.true;
  });

  // Requirement 5: The total completion count increases correctly.
  it("5. Should increment total completion count correctly across multiple actions", async function () {
    expect(await cleanCheck.getTotalCompletions()).to.equal(0);

    await cleanCheck.connect(user1).completeTask(1);
    expect(await cleanCheck.getTotalCompletions()).to.equal(1);

    await cleanCheck.connect(user1).completeTask(2);
    expect(await cleanCheck.getTotalCompletions()).to.equal(2);

    await cleanCheck.connect(user2).completeTask(1);
    expect(await cleanCheck.getTotalCompletions()).to.equal(3);
  });

  // Requirement 6: The relevant task completion count increases correctly.
  it("6. Should increment the specific task completion count correctly", async function () {
    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(0);
    expect(await cleanCheck.getTaskCompletionCount(2)).to.equal(0);

    await cleanCheck.connect(user1).completeTask(1);
    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(1);
    expect(await cleanCheck.getTaskCompletionCount(2)).to.equal(0);

    await cleanCheck.connect(user2).completeTask(1);
    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(2);
    expect(await cleanCheck.getTaskCompletionCount(2)).to.equal(0);

    await cleanCheck.connect(user1).completeTask(2);
    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(2);
    expect(await cleanCheck.getTaskCompletionCount(2)).to.equal(1);
  });

  // Requirement 7: A wallet cannot complete the same task twice on the same day.
  it("7. Should reject duplicate completion attempts for the same task on the same day", async function () {
    await cleanCheck.connect(user1).completeTask(1);

    const currentDay = await cleanCheck.getCurrentDay();
    await expect(cleanCheck.connect(user1).completeTask(1))
      .to.be.revertedWithCustomError(cleanCheck, "TaskAlreadyCompletedToday")
      .withArgs(user1.address, 1, currentDay);
  });

  // Requirement 8: A wallet can complete a different task on the same day.
  it("8. Should allow a wallet to complete a different task on the same day", async function () {
    await cleanCheck.connect(user1).completeTask(1);
    expect(await cleanCheck.hasCompletedToday(user1.address, 1)).to.be.true;

    // Completing Task 2 on the same day should succeed
    await expect(cleanCheck.connect(user1).completeTask(2)).to.not.be.reverted;
    expect(await cleanCheck.hasCompletedToday(user1.address, 2)).to.be.true;

    // Completing Task 3 on the same day should also succeed
    await expect(cleanCheck.connect(user1).completeTask(3)).to.not.be.reverted;
    expect(await cleanCheck.hasCompletedToday(user1.address, 3)).to.be.true;
  });

  // Requirement 9: A wallet can complete the same task on a later day.
  it("9. Should allow a wallet to complete the same task on a later day", async function () {
    await cleanCheck.connect(user1).completeTask(1);
    expect(await cleanCheck.hasCompletedToday(user1.address, 1)).to.be.true;

    // Fast-forward time by 1 day (86400 seconds)
    await time.increase(86400);

    // Now hasCompletedToday should return false for the new day
    expect(await cleanCheck.hasCompletedToday(user1.address, 1)).to.be.false;

    // The user can complete the task again for the new day
    await expect(cleanCheck.connect(user1).completeTask(1)).to.not.be.reverted;
    expect(await cleanCheck.hasCompletedToday(user1.address, 1)).to.be.true;
    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(2);
  });

  // Requirement 10: Different wallets can complete the same task.
  it("10. Should allow different wallets to complete the same task on the same day", async function () {
    await cleanCheck.connect(user1).completeTask(1);
    expect(await cleanCheck.hasCompletedToday(user1.address, 1)).to.be.true;

    // user2 should be able to complete task 1 as well
    expect(await cleanCheck.hasCompletedToday(user2.address, 1)).to.be.false;
    await expect(cleanCheck.connect(user2).completeTask(1)).to.not.be.reverted;
    expect(await cleanCheck.hasCompletedToday(user2.address, 1)).to.be.true;

    expect(await cleanCheck.getTaskCompletionCount(1)).to.equal(2);
  });

  // Requirement 11: The correct completion event is emitted.
  it("11. Should emit TaskCompleted event with correct arguments", async function () {
    const currentDay = await cleanCheck.getCurrentDay();

    await expect(cleanCheck.connect(user1).completeTask(1))
      .to.emit(cleanCheck, "TaskCompleted")
      .withArgs(
        user1.address,
        1,
        currentDay,
        (timestamp: bigint) => timestamp > 0n
      );
  });
});
