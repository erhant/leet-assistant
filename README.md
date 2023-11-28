# Leet Assistant

> A personalized leet-code assistant, guiding you about problems to solve based on your performance & interests.

- [Backend](./backend/): Bun + ElysiaJS + LangChain + Pinecone.
- [Frontend](./frontend/): Bun + SolidJS.

Based on the [RAG tutorial](https://js.langchain.com/docs/expression_language/cookbook/retrieval) by LangChain. You can find the example codes there here as well, under the [examples](./backend/examples/) folder.

## Usage

When you connect to `URL_HERE`, you will be greeted with a conversation screen where you talk about algorithm topics with a bot.

1. Speak about the topics that you would like to try yourself on, or that you feel weak about.
2. When you are done, click `BEGIN` button, which will initiate a problem-solving session with the information gained so far.
3. The AI will select a problem from the dataset, and you will be given the link to the LeetCode for that problem. With respect to this question, you can do one of the following:

- `SOLVED`: You've succesfully solved this problem, and you are no more interested in it.
- `REPEAT`: You've solved it, albeit with difficulty; so you would like to try it again.
- `FAILED`: You've failed to solve it, and would like to see more related questions about it.

4. At any time, you can go back to the conversation and ask about your current state from the perspective of the AI.
