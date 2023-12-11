<div>
  <h1 align="center">
    Leet Assistant
  </h1>
  <p align="center">
    <i>A personalized LeetCode assistant, guiding you about problems to solve based on your performance & interests.</i>
  </p>
</div>

## Motivation

[LeetCode](https://leetcode.com/) is an online platform where you solve coding challenges, such as coding interview questions and competitive programming questions. It has over 2000 problems, with a wide variety of topics.

[Leet Assistant](https://leet-assistant.vercel.app/) is a proof-of-concept tool that demonstrates effortless plug-and-play personalization of [FirstBatch User Embeddings](https://userembeddings.firstbatch.xyz/).

The general idea is as follows:

- You are greeted with a batch of random questions.
- You can look at these questions, and you can notify FirstBatch with one of the following:
  - **solve**: you have solved this question
  - **retry**: you have solved it, but would like to try it again later
  - **fail**: you have not been able to solve it
- When you are done with the current batch of questions, you can request a new batch; this new batch will be more tailored towards your session! For example, if you were unable to solve `array` topics, you will see more `array` questions in the new batch.

A chat-bot is also provided that is connected to ChatGPT. It uses the batch of questions retrieved by FirstBatch to create a context, and using LangChain we make Retrival-Augmented Generation (RAG) to answer certain questions about the given batch of questions.

## Local Setup

You can

You can locally setup this project by following these steps:

- Create a new [Pinecone](https://www.pinecone.io/) index, and get your API KEY.
- You will also need an [OpenAI](https://chat.openai.com/) API KEY to compute embeddings.
- Convert the questions to embeddings, and upload them to your Pinecone index; see [below](#data) for instructions.
- Get a [FirstBatch User Embeddings](https://userembeddings.firstbatch.xyz/) API key.
- TODO: describe server launch

### Code Structure

- [**App**](./app/) is a simple RESTful api, using [Solid](https://www.solidjs.com/) for the webapp and API endpoits, with [Tailwind](https://tailwindcss.com) + [Daisy](https://daisyui.com/) for the frontend and [FirstBatch](https://www.firstbatch.xyz/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/) for the backend.
- [**Data**](./data/) has the logic to convert the given set of [LeetCode Questions](https://www.kaggle.com/datasets/manthansolanki/leetcode-questions) to embeddings and store them in a vectorDB, using [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).

### Backend

Uses ElysiaJS with Bun. The AI code based on the [RAG tutorial](https://js.langchain.com/docs/expression_language/cookbook/retrieval) by LangChain, and the context for this AI is fed via FirstBatch SDK. To start the server:

### Frontend

We use SolidJS with [`solid-start`](https://start.solidjs.com). To run the server:

```sh
cd frontend
bun dev  # development
bun prod # production
```

You can also build the website and run it with `node`:

```sh
bun run build
node ./dist/server.js
```

### Data

The dataset here has been retrieved from <https://www.kaggle.com/datasets/manthansolanki/leetcode-questions/>. Download the dataset and place the CSV file as `./res/leetcode_questions.csv`. We use OpenAI and Pinecone to generate embeddings from the dataset and store them at Pinecone.

We provide some helper scripts within [package.json](./package.json).

```bash
cd data
bun run pinecone # describe Pinecone index
bun run questions # print random questions to console
bun run train # compute question embeddings & upload them to Pinecone
```
