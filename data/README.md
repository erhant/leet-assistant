# Dataset

The dataset here has been retrieved from <https://www.kaggle.com/datasets/manthansolanki/leetcode-questions/>. Download the dataset and place the CSV file in this directory.

## Usage

We use OpenAI and Pinecone to generate embeddings from the dataset and store them at Pinecone. First, install the required packages:

```sh
bun install
```

What this code does is the following:

1. Read CSV data from file, assuming you have downloaded it from Kaggle.
2. Using OpenAI embeddings, convert each problem to a vector. Note that the problem is first converted to a descriptive string in natural language, and then fed into the LLM for embeddings.
3. Upload embeddings to Pinecone.

## See Also

- A nice guide: <https://ilikekillnerds.com/2023/05/working-with-ai-using-typescript-and-node-js-without-needing-to-use-vector-databases/>
