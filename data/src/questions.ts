import fs from "fs";
import csv from "csv-parser";
import type { Question, QuestionRaw } from "./types";

/** Placeholder for a question context, should mention this to GPT. */
const PLACEHOLDER = "none";

/** Loads the CSV data about LeetCode problems, it has 2385 problems stored. */
export async function loadQuestions(path: string): Promise<Question[]> {
  const data: Question[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      // @ts-ignore interesting type error although this works fine
      .pipe(csv())
      // @ts-ignore interesting type error although this works fine
      .on("data", (row: QuestionRaw) => {
        const parsed: Question = {
          questionId: row["Question ID"],
          title: row["Question Title"],
          slug: row["Question Slug"],
          description: row["Question Text"],
          topics: row["Topic Tagged text"].split(","),
          difficulty: row["Difficulty Level"] as Question["difficulty"],
          successRate: parseFloat(row["Success Rate"]),
          submissions: parseInt(row["total submission"]),
          accepteds: parseInt(row["total accepted"]),
          likes: parseInt(row["Likes"]),
          dislikes: parseInt(row["Dislikes"]),
          hints: row["Hints"],
          similarQuestionIds: row["Similar Questions ID"].split(","),
          similarQuestionsText: row["Similar Questions Text"].split(","),
        };

        data.push(parsed);
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (error: Error) => {
        reject(error);
      });
  });
}

/** Converts a data row to a single string. */
export function questionToString(data: Question): string {
  const similar = data.similarQuestionsText.join(",");
  return [
    `Question: ${data.title}`,
    `Description: ${data.description || PLACEHOLDER}`,
    `Difficulty: ${data.difficulty}`,
    `Topics: ${data.topics.length === 0 ? PLACEHOLDER : data.topics.join(",")}`,
    `Similar Questions: ${similar.length === 0 ? PLACEHOLDER : similar}`,
  ].join("\n");
}

if (import.meta.main) {
  console.log("Printing random questions.");
  const COUNT = 8;
  const questions: Question[] = await loadQuestions("./res/leetcode_questions.csv");

  const randomQuestions = Array.from({ length: COUNT }, () => {
    const question = questions[Math.floor(Math.random() * questions.length)];
    return {
      ...question,
      // text: questionToString(question),
    };
  });
  console.log(randomQuestions);
}
