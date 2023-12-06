# Leet Assistant - Data Training

The dataset here has been retrieved from <https://www.kaggle.com/datasets/manthansolanki/leetcode-questions/>. Download the dataset and place the CSV file as `./res/leetcode_questions.csv`. We use OpenAI and Pinecone to generate embeddings from the dataset and store them at Pinecone.

## Usage

We provide some scripts within [package.json](./package.json).

```bash
# Print random questions
bun run questions

# Print Pinecone index information
bun run pinecone

# Converts questions to embeddings and stores them at the Pinecone index
bun run train
```
