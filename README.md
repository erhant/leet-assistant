# Leet Assistant

A personalized [LeetCode](https://leetcode.com/) assistant, guiding you about problems to solve based on your performance & interests.

- [Backend](./backend/) is a simple RESTful api, using [Bun](https://bun.sh/) + [Elysia](https://elysiajs.com/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).
- [Frontend](./frontend/) is a SolidJS web-app, using [Bun](https://bun.sh/) + [Solid](https://www.solidjs.com/) + [Tailwind](https://tailwindcss.com) + [Daisy](https://daisyui.com/).
- [Data](./data/) has the logic to convert questions to embeddings and store them in Pinecone, using [Bun](https://bun.sh/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).

## Local Setup

- Create Pinecone index
- Train & upload embeddings
- Get FirstBatch API key
- Start backend
- Start frontend

This project uses workspaces, so all you have to do is:

```sh
bun install
```

and the dependencies will be installed for all workspaces described above.

> [!NOTE]
>
> There are two particular type-sharing that is used here:
>
> - [Frontend](./frontend/) workspace imports the ElysiaJS server type from [Backend](./backend/) workspace and creates a type-safe client via Eden Treaty.
> - All workspaces share the `Question` type as exposed from within the [Data](./data/) workspace.
