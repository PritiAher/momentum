export interface User {
  id: string;
  name: string;
  email: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Topic =
  | "Arrays"
  | "Binary Search"
  | "Strings"
  | "Hashing"
  | "Two Pointers"
  | "Sliding Window"
  | "Linked List"
  | "Stack"
  | "Queue"
  | "Heap"
  | "Trees"
  | "BST"
  | "Graphs"
  | "Greedy"
  | "Backtracking"
  | "Trie"
  | "Dynamic Programming"
  | "Segment Tree"
  | "Bit Manipulation"
  | "Math";

export type Platform = "LeetCode" | "GFG" | "Codeforces" | "CodeStudio" | "HackerRank" | "Other";

export interface Problem {
  _id: string;
  date: string;
  platform: Platform;
  problemNumber: string;
  problemName: string;
  difficulty: Difficulty;
  topic: Topic;
  pattern: string;
  timeTakenMinutes: number | null;
  solved: boolean;
  hintUsed: boolean;
  confidence: 1 | 2 | 3 | 4 | 5;
  revisionRequired: boolean;
  notebookPage: string;
  remarks: string;
  createdAt: string;
}

export type TaskCategory = "DSA" | "Algorithms" | "Coursework" | "Assignments" | "Projects" | "Personal";
export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Todo" | "InProgress" | "Done";

export interface Task {
  _id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  deadline: string | null;
  estimatedMinutes: number | null;
  status: TaskStatus;
}
