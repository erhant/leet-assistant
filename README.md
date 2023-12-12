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

## Personalization

So how does personalizaton work with FirstBatch? The docs describe it perfectly (see [here](https://firstbatch.gitbook.io/firstbatch-sdk/get-started/introduction)), but we will also provide a short description here as well.

The algorithm designed for this use-case can be found under the [img folder](./img/algorithm.png).

### Creating a Session

First, the user create a session through a POST request at `/session`, which corresponds to the following call:

```ts
const session = await personalized.session(
  constants.FIRSTBATCH.ALGORITHM_NAME,
  constants.FIRSTBATCH.VECTORDB_ID,
  {
    customId: constants.FIRSTBATCH.ALGORITHM_ID,
  }
);
```

The user stores the returned session object (which is just an ID and a bool related to persistence) for future calls.

### Requesting a Batch

At any point in time, we can request a set of random data points from our embedding space. We do this via a POST request to `/batch` with our sessionId, which corresponds to the following call:

```ts
const batch = await personalized.batch(session);
```

### Making a Signal

For any of the returned questions, we have a id as it appears within the Pinecone index, we refer to this as `contentId`. To make a signal w.r.t to a question, we make a POST request to `/signal` endpoint, which corresponds to the following calls:

```ts
await personalized.addSignal(session, constants.ACTIONS[signal], contentId);
```

Here, `constants.ACTIONS` is just an object of prepared `UserAction` objects, see more [here](https://firstbatch.gitbook.io/firstbatch-sdk/learn/signals).

## Setup

You can locally setup this project by following either of the following steps:

- Simply set `VITE_BASE_URL` to be `https://leet-assistant.vercel.app/api` in `.env` and use the existing backend.

Or, use your own backend APIs as follows:

- Create a new [Pinecone](https://www.pinecone.io/) index, and get your API KEY.
- You will also need an [OpenAI](https://chat.openai.com/) API KEY to compute embeddings.
- Convert the questions to embeddings, and upload them to your Pinecone index; see [below](#data) for instructions.
- Get a [FirstBatch User Embeddings](https://userembeddings.firstbatch.xyz/) API key.

### Structure

- [**App**](./app/) is a simple RESTful api, using [Solid](https://www.solidjs.com/) for the webapp and API endpoits that correspond to serverless edge functions at Vercel, with [Tailwind](https://tailwindcss.com) + [Daisy](https://daisyui.com/) for the frontend and [FirstBatch](https://www.firstbatch.xyz/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/) for the backend (via serverless functions under [api routes](./app/src/routes/api/)).
- [**Data**](./data/) has the logic to convert the given set of [LeetCode Questions](https://www.kaggle.com/datasets/manthansolanki/leetcode-questions) to embeddings and store them in a vectorDB, using [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).

To run the app, simply navigate to the [app](./app/) folder, install packages and run the development server:

```sh
cd app
pnpm install
pnpm dev
```

If you try to build the server, it will fail due to the Vercel adapter; however, you can comment that out within the [Vite config](./app/vite.config.ts).

### Dataset

The dataset here has been retrieved from <https://www.kaggle.com/datasets/manthansolanki/leetcode-questions/>. Download the dataset and place the CSV file as `./res/leetcode_questions.csv`. We use OpenAI and Pinecone to generate embeddings from the dataset and store them at Pinecone.

We have used Bun for this, but any other runtime should work as well.

```sh
bun install
```

We provide some helper scripts within [package.json](./package.json).

```bash
cd data
bun run pinecone  # describe Pinecone index
bun run questions # print random questions to console
bun run train     # compute question embeddings & upload them to Pinecone
```

## Remarks

- I had initially written everything with Bun, with Elysia as backend and Solid as frontend. However, deploying a Bun backend within a free-tier plan was a total nightmare, so I changed the backend to reside within the api routes of the Solid app. See this version of the code at the [`bun`](https://github.com/erhant/leet-assistant/tree/bun) branch in this repo.

- Everything is deployed at Vercel in a free-tier plan, so api endpoints may sometimes timeout (especially ChatGPT ones) because Vercel imposes some limits on the runtime duration of serverless functions.

- There is a lot of fine-tuning to do, both for the ChatGPT prompts and for the personalization through FirstBatch user embeddings.
