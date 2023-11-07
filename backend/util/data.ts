import fs from "fs";
import csv from "csv-parser";
import type { DataRow, RawDataRow } from "../types";

/** Number of problems. */
const MAX_ID = 2385;

/** Placeholder for a question context, should mention this to GPT. */
const PLACEHOLDER = "none";

/** Loads the CSV data about LeetCode problems. */
export async function loadData(path: string): Promise<DataRow[]> {
  const data: DataRow[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      // @ts-ignore FIXME: ??
      .pipe(csv())
      // @ts-ignore FIXME: ??
      .on("data", (row: RawDataRow) => {
        const parsed: DataRow = {
          id: parseInt(row["Question ID"]),
          title: row["Question Title"],
          slug: row["Question Slug"],
          description: row["Question Text"],
          topics: row["Topic Tagged text"].split(","),
          difficulty: row["Difficulty Level"],
          successRate: parseFloat(row["Success Rate"]),
          submissions: parseInt(row["total submission"]),
          accepteds: parseInt(row["total accepted"]),
          likes: parseInt(row["Likes"]),
          dislikes: parseInt(row["Dislikes"]),
          hints: row["Hints"],
          similarQuestionIds: row["Similar Questions ID"]
            .split(",")
            .map((idStr: string) => parseInt(idStr)),
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
export function dataToSummarizedString(data: DataRow) {
  const similar = data.similarQuestionsText.join(",");
  return `Question: ${data.title}
Description: ${data.description ? PLACEHOLDER : data.description}
Difficulty: ${data.difficulty}
Topics: ${data.topics.join(",")}
Similar Questions: ${similar.length === 0 ? PLACEHOLDER : similar}`;
}

if (import.meta.main) {
  const data = await loadData("./data/leetcode_questions.csv");
  console.log(dataToSummarizedString(data[0]));
}