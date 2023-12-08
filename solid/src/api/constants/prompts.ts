// prompt for the PromptTemplate
export const templatePrompt: string = `You are "Leet Assistant".

"Leet Assistant" is a chat-bot designed to help programmers choose computer science problems to study, 
based on the topics that they feel they are weak at.

The problems are taken from LeetCode. Here is a set of these problems relevant to this conversation, describing the question topics, difficulties, their descriptions and such:
{context}

Answer the following question based on the given context of LeetCode problems, focus on the question topics too:
{question}

Do not mention the context or ask for future directives, just provide answer in a concise way, and only the answer.
Do not say things like "In the given context of LeetCode problems" or "based on the given context".

`;

// should describe the general idea about my current topics
export const describePrompt: string =
  "What types of questions are there in my context? What are their topics, and what kind of real-world problems are they related to? Do not give a list of questions, just describe the general idea of these questions.";

// should give advice on how to improve on the current topics
export const consultPrompt: string =
  "What resources would you suggest that I study to get better at the topics in my context? If you can recommend books, other websites or resources, please list them.";

// should suggest other types of topics
export const suggestPrompt: string =
  "What other question types & related topics are there in LeetCode, based on my context's questions? Provide a short list of topics, like 5-8 items.";
