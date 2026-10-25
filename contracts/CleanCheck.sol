// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CleanCheck
 * @notice A simple blockchain-based cleanliness checklist for facilities such as
 *         hospitals, clinics, schools, and offices.
 * @dev Records user-submitted task completions on-chain. Each task can only be completed
 *      once per wallet per UTC day.
 */
contract CleanCheck {
    // --- Constants ---
    uint256 public constant TOTAL_TASKS = 3;
    uint256 public constant TASK_WAITING_ROOM = 1;
    uint256 public constant TASK_RECEPTION_DESK = 2;
    uint256 public constant TASK_WASTE_BIN = 3;

    // --- State Variables ---
    uint256 public totalCompletions;

    // taskId => total completions count
    mapping(uint256 => uint256) public taskCompletionCounts;

    // user => taskId => last completion UTC day index
    // Day index = block.timestamp / 1 days (86400 seconds)
    mapping(address => mapping(uint256 => uint256)) public lastCompletionDay;

    // --- Events ---
    event TaskCompleted(
        address indexed user,
        uint256 indexed taskId,
        uint256 day,
        uint256 timestamp
    );

    // --- Custom Errors ---
    error InvalidTaskId(uint256 taskId);
    error TaskAlreadyCompletedToday(address user, uint256 taskId, uint256 day);

    /**
     * @notice Helper to compute the current UTC day index from block timestamp.
     * @return Current day index (days elapsed since Unix epoch).
     */
    function getCurrentDay() public view returns (uint256) {
        return block.timestamp / 1 days;
    }

    /**
     * @notice Returns the human-readable description for a valid task ID.
     * @param taskId The task identifier (1, 2, or 3).
     */
    function getTaskName(uint256 taskId) public pure returns (string memory) {
        if (taskId == TASK_WAITING_ROOM) {
            return "Clean waiting room";
        } else if (taskId == TASK_RECEPTION_DESK) {
            return "Clean reception desk";
        } else if (taskId == TASK_WASTE_BIN) {
            return "Empty waste bin";
        }
        revert InvalidTaskId(taskId);
    }

    /**
     * @notice Marks a specific cleaning task as completed for the caller.
     * @dev Validates task ID, checks that the caller has not already completed this task today,
     *      updates counters, records the day index, and emits TaskCompleted event.
     * @param taskId Task ID to complete (1, 2, or 3).
     */
    function completeTask(uint256 taskId) external {
        if (taskId < 1 || taskId > TOTAL_TASKS) {
            revert InvalidTaskId(taskId);
        }

        uint256 currentDay = getCurrentDay();
        uint256 lastDay = lastCompletionDay[msg.sender][taskId];

        // If lastDay == currentDay, user already marked this task today
        if (lastDay == currentDay && lastDay != 0) {
            revert TaskAlreadyCompletedToday(msg.sender, taskId, currentDay);
        }

        // Record completion
        lastCompletionDay[msg.sender][taskId] = currentDay;
        totalCompletions += 1;
        taskCompletionCounts[taskId] += 1;

        emit TaskCompleted(msg.sender, taskId, currentDay, block.timestamp);
    }

    /**
     * @notice Get the total number of completed tasks across all users and tasks.
     * @return Total completion count.
     */
    function getTotalCompletions() external view returns (uint256) {
        return totalCompletions;
    }

    /**
     * @notice Get the total completion count for a specific task.
     * @param taskId Task ID (1, 2, or 3).
     * @return Total completions for this task.
     */
    function getTaskCompletionCount(uint256 taskId) external view returns (uint256) {
        if (taskId < 1 || taskId > TOTAL_TASKS) {
            revert InvalidTaskId(taskId);
        }
        return taskCompletionCounts[taskId];
    }

    /**
     * @notice Check whether a given wallet address has completed a particular task today.
     * @param user The address to inspect.
     * @param taskId Task ID (1, 2, or 3).
     * @return True if already completed today (UTC), false otherwise.
     */
    function hasCompletedToday(address user, uint256 taskId) external view returns (bool) {
        if (taskId < 1 || taskId > TOTAL_TASKS) {
            revert InvalidTaskId(taskId);
        }
        uint256 currentDay = getCurrentDay();
        return lastCompletionDay[user][taskId] == currentDay && currentDay != 0;
    }

    /**
     * @notice Retrieve the last completion UTC day index for a wallet and task.
     * @param user The address to inspect.
     * @param taskId Task ID (1, 2, or 3).
     * @return The day index (0 if never completed).
     */
    function getLastCompletionDay(address user, uint256 taskId) external view returns (uint256) {
        if (taskId < 1 || taskId > TOTAL_TASKS) {
            revert InvalidTaskId(taskId);
        }
        return lastCompletionDay[user][taskId];
    }
}
