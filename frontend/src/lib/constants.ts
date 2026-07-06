import type { Topic, Platform } from "@/types";

export const TOPICS: Topic[] = [
  "Arrays",
  "Binary Search",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
  "Linked List",
  "Stack",
  "Queue",
  "Heap",
  "Trees",
  "BST",
  "Graphs",
  "Greedy",
  "Backtracking",
  "Trie",
  "Dynamic Programming",
  "Segment Tree",
  "Bit Manipulation",
  "Math",
];

export const PLATFORMS: Platform[] = ["LeetCode", "GFG", "Codeforces", "CodeStudio", "HackerRank", "Other"];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const TASK_CATEGORIES = ["DSA", "Algorithms", "Coursework", "Assignments", "Projects", "Personal"] as const;
export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TASK_STATUSES = ["Todo", "InProgress", "Done"] as const;
export const TASK_STATUS_LABELS: Record<string, string> = {
  Todo: "To Do",
  InProgress: "In Progress",
  Done: "Done",
};

export const EVENT_TYPES = ["Class", "StudyBlock", "Exam", "Assignment", "PlacementEvent"] as const;
export const EVENT_TYPE_LABELS: Record<string, string> = {
  Class: "Class",
  StudyBlock: "Study Block",
  Exam: "Exam",
  Assignment: "Assignment",
  PlacementEvent: "Placement Event",
};
export const EVENT_TYPE_COLORS: Record<string, string> = {
  Class: "#7C6FF0",
  StudyBlock: "#34D399",
  Exam: "#F87171",
  Assignment: "#F5A623",
  PlacementEvent: "#38BDF8",
};
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
