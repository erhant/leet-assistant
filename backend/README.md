# Backend

Uses ElysiaJS with Bun. The AI code based on the [RAG tutorial](https://js.langchain.com/docs/expression_language/cookbook/retrieval) by LangChain, and the context for this AI is fed via FirstBatch SDK.

## Usage

To start the development server run:

```bash
bun run dev
```

It might take a bit of time at first due to FirstBatch setting up the database.

## Dataset

The dataset here has been retrieved from <https://www.kaggle.com/datasets/manthansolanki/leetcode-questions/>. Download the dataset and place the CSV file in this directory. We use OpenAI and Pinecone to generate embeddings from the dataset and store them at Pinecone.

- A nice guide: <https://ilikekillnerds.com/2023/05/working-with-ai-using-typescript-and-node-js-without-needing-to-use-vector-databases/>
