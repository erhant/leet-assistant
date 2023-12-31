import type { Question } from "~/types";

/** @deprecated just for testing */
export function getDummyChatHistory(): string[] {
  return ["Hi there!", "Hello.", "Isnt this a sunny day?", "Seems to be so.", "Uh-huh."];
}

/** @deprecated just for testing */
export function getDummyQuestions(): Question[] {
  return [
    {
      questionId: "1627",
      title: "Last Moment Before All Ants Fall Out of a Plank",
      slug: "last-moment-before-all-ants-fall-out-of-a-plank",
      description:
        "We have a wooden plank of the length n units. Some ants are walking on the plank, each ant moves with a speed of 1 unit per second. Some of the ants move to the left, the other move to the right. When two ants moving in two different directions meet at some point, they change their directions and continue moving again. Assume changing directions does not take any additional time. When an ant reaches one end of the plank at a time t, it falls out of the plank immediately. Given an integer n and two integer arrays left and right, the positions of the ants moving to the left and the right, return the moment when the last ant(s) fall out of the plank. ",
      topics: ["Array", "Brainteaser", "Simulation"],
      difficulty: "Medium",
      successRate: 54.8,
      submissions: 27754,
      accepteds: 15220,
      likes: 335,
      dislikes: 180,
      hints:
        "The ants change their way when they meet is equivalent to continue moving without changing their direction. Answer is the max distance for one ant to reach the end of the plank in the facing direction.",
      similarQuestionIds: ["2317"],
      similarQuestionsText: ["Count Collisions on a Road"],
    },
    {
      questionId: "95",
      title: "Unique Binary Search Trees II",
      slug: "unique-binary-search-trees-ii",
      description:
        "Given an integer n, return all the structurally unique BST's (binary search trees), which has exactly n nodes of unique values from 1 to n. Return the answer in any order. ",
      topics: ["Dynamic Programming", "Backtracking", "Tree", "Binary Search Tree", "Binary Tree"],
      difficulty: "Medium",
      successRate: 49.3,
      submissions: 612378,
      accepteds: 301936,
      likes: 4623,
      dislikes: 302,
      hints: "",
      similarQuestionIds: ["96", "241"],
      similarQuestionsText: ["Unique Binary Search Trees", "Different Ways to Add Parentheses"],
    },
    {
      questionId: "1982",
      title: "Remove Duplicates From an Unsorted Linked List",
      slug: "remove-duplicates-from-an-unsorted-linked-list",
      description: "",
      topics: ["Hash Table", "Linked List"],
      difficulty: "Medium",
      successRate: 69.9,
      submissions: 17462,
      accepteds: 12206,
      likes: 201,
      dislikes: 5,
      hints:
        "Is there a way we can know beforehand which nodes to delete? Count the number of appearances for each number.",
      similarQuestionIds: ["82", "83"],
      similarQuestionsText: ["Remove Duplicates from Sorted List II", "Remove Duplicates from Sorted List"],
    },
    {
      questionId: "364",
      title: "Nested List Weight Sum II",
      slug: "nested-list-weight-sum-ii",
      description: "",
      topics: ["Stack", "Depth-First Search", "Breadth-First Search"],
      difficulty: "Medium",
      successRate: 68.3,
      submissions: 164928,
      accepteds: 112591,
      likes: 960,
      dislikes: 289,
      hints: "",
      similarQuestionIds: ["339", "565"],
      similarQuestionsText: ["Nested List Weight Sum", "Array Nesting"],
    },
    {
      questionId: "967",
      title: "Minimum Falling Path Sum",
      slug: "minimum-falling-path-sum",
      description:
        "Given an n x n array of integers matrix, return the minimum sum of any falling path through matrix. A falling path starts at any element in the first row and chooses the element in the next row that is either directly below or diagonally left/right. Specifically, the next element from position (row, col) will be (row + 1, col - 1), (row + 1, col), or (row + 1, col + 1). ",
      topics: ["Array", "Dynamic Programming", "Matrix"],
      difficulty: "Medium",
      successRate: 67.3,
      submissions: 180018,
      accepteds: 121207,
      likes: 2215,
      dislikes: 92,
      hints: "",
      similarQuestionIds: ["1224"],
      similarQuestionsText: ["Minimum Falling Path Sum II"],
    },
    {
      questionId: "687",
      title: "Longest Univalue Path",
      slug: "longest-univalue-path",
      description:
        "Given the root of a binary tree, return the length of the longest path, where each node in the path has the same value. This path may or may not pass through the root. The length of the path between two nodes is represented by the number of edges between them. ",
      topics: ["Tree", "Depth-First Search", "Binary Tree"],
      difficulty: "Medium",
      successRate: 39.3,
      submissions: 355853,
      accepteds: 139892,
      likes: 3041,
      dislikes: 607,
      hints: "",
      similarQuestionIds: ["124", "250", "437"],
      similarQuestionsText: ["Binary Tree Maximum Path Sum", "Count Univalue Subtrees", "Path Sum III"],
    },
    {
      questionId: "263",
      title: "Ugly Number",
      slug: "ugly-number",
      description:
        "An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer n, return true if n is an ugly number. ",
      topics: ["Math"],
      difficulty: "Easy",
      successRate: 41.8,
      submissions: 699108,
      accepteds: 292500,
      likes: 1376,
      dislikes: 1018,
      hints: "",
      similarQuestionIds: ["202", "204", "264"],
      similarQuestionsText: ["Happy Number", "Count Primes", "Ugly Number II"],
    },
    {
      questionId: "119",
      title: "Pascal's Triangle II",
      slug: "pascals-triangle-ii",
      description:
        "Given an integer rowIndex, return the rowIndexth (0-indexed) row of the Pascal's triangle. In Pascal's triangle, each number is the sum of the two numbers directly above it as shown: ",
      topics: ["Array", "Dynamic Programming"],
      difficulty: "Easy",
      successRate: 57.3,
      submissions: 888446,
      accepteds: 509354,
      likes: 2474,
      dislikes: 263,
      hints: "",
      similarQuestionIds: ["118", "2324"],
      similarQuestionsText: ["Pascal's Triangle", "Find Triangular Sum of an Array"],
    },
  ];
}
