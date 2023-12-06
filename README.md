<div>
  <h1 align="center">
    Leet Assistant
  </h1>
  <p align="center">
    <i>A personalized LeetCode assistant, guiding you about problems to solve based on your performance & interests.</i>
  </p>
</div>

## Motivation

LeetCode is an online platform where you solve coding challenges, such as coding interview questions and competitive programming questions. It has over 2000 problems, with a wide variety of topics.

Leet Assistant is a proof-of-concept tool that demonstrates effortless plug-and-play personalization of [FirstBatch User Embeddings](https://userembeddings.firstbatch.xyz/). The general idea is as follows:

- User is greeted with a batch of random questions.
- They can look at each question, and they can notify FirstBatch with one of the three options:
  - solve: they have solved this question
  - retry: they have solved it, but would like to retry later
  - fail: TODO:

## Setup

TODO:

- Create Pinecone index
- Train & upload embeddings
- Get FirstBatch API key
- Start backend
- Start frontend

## Code Structure

This project uses workspaces, so all you have to do is:

```sh
bun install
```

and then all dependencies for the workspaces below will be installed & shared:

- [**Backend**](./backend/) is a simple RESTful api, using [Bun](https://bun.sh/) + [Elysia](https://elysiajs.com/) + [FirstBatch](https://www.firstbatch.xyz/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).
- [**Frontend**](./frontend/) is a single-page web-app, using [Bun](https://bun.sh/) + [Solid](https://www.solidjs.com/) + [Tailwind](https://tailwindcss.com) + [Daisy](https://daisyui.com/).
- [**Data**](./data/) has the logic to convert the given set of [LeetCode Questions](https://www.kaggle.com/datasets/manthansolanki/leetcode-questions) to embeddings and store them in a vectorDB, using [Bun](https://bun.sh/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).

> [!TIP]
>
> [Eden Treaty](https://elysiajs.com/plugins/eden/treaty.html) is also used to consume our backend within the frontend, without any hassle or code-rewrite. See [api/backend](./frontend/src/api/backend.ts) for details.

### Backend

Uses ElysiaJS with Bun. The AI code based on the [RAG tutorial](https://js.langchain.com/docs/expression_language/cookbook/retrieval) by LangChain, and the context for this AI is fed via FirstBatch SDK. To start the development server run:

```bash
cd backend
bun dev
```

It might take a bit of time at first due to FirstBatch setting up the database, if you are using a new vectorDB identifier. You can also run tests, albeit at the cost of some API requests:

```sh
bun test --timeout 300000 --bail
```

You can also build the backend and run it with `node`:

```sh
bun run build
node ./dist/server.mjs
```

### Frontend

We use SolidJS with [`solid-start`](https://start.solidjs.com). To run the development build:

```sh
cd frontend
bun dev
```

You can also build the website and run it with `node`:

```sh
bun run build
node ./dist/server.js
```

### Data

The dataset here has been retrieved from <https://www.kaggle.com/datasets/manthansolanki/leetcode-questions/>. Download the dataset and place the CSV file as `./res/leetcode_questions.csv`. We use OpenAI and Pinecone to generate embeddings from the dataset and store them at Pinecone.

We provide some scripts within [package.json](./package.json).

```bash
cd data
bun run pinecone # describe Pinecone index
bun run questions # print random questions to console
bun run train # stores question embeddings at Pinecone
```
