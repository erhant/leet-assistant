import { connectPinecone } from "../util/pinecone";

if (import.meta.main) {
  console.log("Fetching information about Pinecone index:");
  const pinecone = await connectPinecone();
  const stats = await pinecone.describeIndexStats();
  console.log(stats);

  // also fetch a vector to see the result
  const vec = await pinecone.fetch(["f0f289d1-9b4a-4ebe-a284-0aac8b8ca582"]);
  if (vec.records) {
    for (const key in vec.records) {
      console.log(vec.records[key].metadata);
    }
  }
}
