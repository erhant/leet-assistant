# Leet Assistant

A personalized [LeetCode](https://leetcode.com/) assistant, guiding you about problems to solve based on your performance & interests.

- [Backend](./backend/) is a simple RESTful api, using [Bun](https://bun.sh/) + [Elysia](https://elysiajs.com/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).
- [Frontend](./frontend/) is a SolidJS web-app, using [Bun](https://bun.sh/) + [Solid](https://www.solidjs.com/) + [Tailwind](https://tailwindcss.com) + [Daisy](https://daisyui.com/).
- [Data](./data/) has the logic to convert questions to embeddings and store them in Pinecone, using [Bun](https://bun.sh/) + [LangChain](https://www.langchain.com/) + [Pinecone](https://www.pinecone.io/).

This project uses workspaces, so all you have to do is:

```sh
bun install
```

and the dependencies will be installed for all workspaces described above.
