#!/bin/bash

# load existing .env if there are any
source .env

docker run \
  -p 127.0.0.1:8080:8080/tcp \
  -e PINECONE_API_KEY=$PINECONE_API_KEY \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e FIRSTBATCH_API_KEY=$FIRSTBATCH_API_KEY \
  -e FIRSTBATCH_ALGORITHM_ID=$FIRSTBATCH_ALGORITHM_ID \
  leet-assistant-backend
