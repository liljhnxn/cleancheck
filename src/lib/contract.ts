export const CLEAN_CHECK_ADDRESS = (process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS || "") as `0x${string}`;

export const CLEAN_CHECK_ABI = [
  {
    type: "function",
    name: "TOTAL_TASKS",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "TASK_WAITING_ROOM",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "TASK_RECEPTION_DESK",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "TASK_WASTE_BIN",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalCompletions",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalCompletions",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTaskCompletionCount",
    inputs: [{ name: "taskId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasCompletedToday",
    inputs: [
      { name: "user", type: "address" },
      { name: "taskId", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLastCompletionDay",
    inputs: [
      { name: "user", type: "address" },
      { name: "taskId", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCurrentDay",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTaskName",
    inputs: [{ name: "taskId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "completeTask",
    inputs: [{ name: "taskId", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "TaskCompleted",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "taskId", type: "uint256", indexed: true },
      { name: "day", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidTaskId",
    inputs: [{ name: "taskId", type: "uint256" }],
  },
  {
    type: "error",
    name: "TaskAlreadyCompletedToday",
    inputs: [
      { name: "user", type: "address" },
      { name: "taskId", type: "uint256" },
      { name: "day", type: "uint256" },
    ],
  },
] as const;

export interface TaskDefinition {
  id: number;
  title: string;
  description: string;
  iconName: "armchair" | "desk" | "trash";
}

export const CLEANING_TASKS: TaskDefinition[] = [
  {
    id: 1,
    title: "Clean waiting room",
    description: "Record when the waiting room has been cleaned.",
    iconName: "armchair",
  },
  {
    id: 2,
    title: "Clean reception desk",
    description: "Record when the reception desk has been cleaned.",
    iconName: "desk",
  },
  {
    id: 3,
    title: "Empty waste bin",
    description: "Record when the waste bin has been emptied.",
    iconName: "trash",
  },
];
