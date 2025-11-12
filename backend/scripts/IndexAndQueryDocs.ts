import { MilvusVectorStore} from "../src/config/VectorStore.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";
import "dotenv/config";




// // 如果集合不存在则创建
// const collectionName = "test";
// const has = await client.hasCollection({ collection_name: collectionName });
// if (!has.value) {
//   console.log(`🆕 Creating collection: ${collectionName}`);

//   await client.createCollection({
//     collection_name: collectionName,
//     fields: [
//       {
//         name: "id",
//         data_type: DataType.Int64,
//         is_primary_key: true,
//         autoID: true,
//       },
//       {
//         name: "vector",
//         data_type: DataType.FloatVector,
//         dim: 1536, // 对应 embedding 维度
//       },
//       {
//         name: "text",
//         data_type: DataType.VarChar,
//         max_length: 65535,
//       },
//     ],
//   });

//   // ✅ 建索引
//   await client.createIndex({
//     collection_name: collectionName,
//     field_name: "vector",
//     index_name: "vector_index",
//     index_type: "HNSW",
//     metric_type: "COSINE",
//     params: { efConstruction: 64, M: 16 },
//   });

//   // ✅ 加载集合到内存
//   await client.loadCollectionSync({ collection_name: collectionName });
//   console.log("✅ Collection created and loaded successfully!");
// } else {
//   console.log(`✅ Collection ${collectionName} already exists.`);
// }

// text sample from Godel, Escher, Bach
const vectorStore = await MilvusVectorStore.fromTexts(
  [
    "Tortoise: Labyrinth? Labyrinth? Could it Are we in the notorious Little\
            Harmonic Labyrinth of the dreaded Majotaur?",
    "Achilles: Yiikes! What is that?",
    "Tortoise: They say-although I person never believed it myself-that an I\
            Majotaur has created a tiny labyrinth sits in a pit in the middle of\
            it, waiting innocent victims to get lost in its fears complexity.\
            Then, when they wander and dazed into the center, he laughs and\
            laughs at them-so hard, that he laughs them to death!",
    "Achilles: Oh, no!",
    "Tortoise: But it's only a myth. Courage, Achilles.",
  ],
  [{ id: 2 }, { id: 1 }, { id: 3 }, { id: 4 }, { id: 5 }],
  new OpenAIEmbeddings(
    {
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
    },
    }
  ),
  {
    address: process.env.MILVUS_URL || "http://localhost:19530",
    collectionName: "test",
  }
);

// or alternatively from docs
// const vectorStore = await MilvusVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//   collectionName: "goldel_escher_bach",
// });

const response = await vectorStore.similaritySearch("scared", 2);
console.log("Similarity Search Results:", response);

// const result = await client.query({
//   collection_name: "test",
//   expr: "",  // 空表示不筛选
//   output_fields: ["id", "vector", "text"],  // 你想查看的字段
//   limit: 100
// });

// console.log(result);