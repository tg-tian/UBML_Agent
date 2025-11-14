import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";
import { loadJsonComponents } from "../rag/loader.js";
import { embeddings } from "../config/modelConfig.js";

export const milvus = new MilvusClient({ address: process.env.MILVUS_URL ?? "http://localhost:19530" });

const createUBMLComponentsCollection = async () => {
  return milvus.createCollection({
    collection_name: "UBML_Components",
    fields: [
      { name: "id", data_type: DataType.Int64, is_primary_key: true, autoID: true },
      { name: "vector", data_type: DataType.FloatVector, dim: 1536 },
      { name: "component_name", data_type: DataType.VarChar, max_length: 256 },
      { name: "description", data_type: DataType.VarChar, max_length: 1024 },
      { name: "path", data_type: DataType.VarChar, max_length: 1024 },
    ],
  });
};

const createIndex = async () => {
  return milvus.createIndex({
    collection_name: "UBML_Components",
    field_name: "vector",
    index_name: "vector_index",
    index_type: "HNSW",
    metric_type: "COSINE",
    params: { efConstruction: 64, M: 16 },
  })
};


// const docs = await loadJsonComponents("./UBML");

// const vectors = await embeddings.embedDocuments(
//   docs.map((d) => d.pageContent)
// );

// const insertData = vectors.map((v, i) => ({
//   vector: v,
//   component_name: docs[i].metadata.component,
//   description: docs[i].pageContent.slice(0, 1000), // 简短描述
//   path: docs[i].metadata.path,
// }));

// const insertResult = await milvus.insert({
//   collection_name: "UBML_Components",
//   fields_data: insertData,
// });

//await milvus.loadCollectionSync({ collection_name: "UBML_Components" });

// const results = await milvus.query({
//     collection_name: "UBML_Components",
//     output_fields: ["id", "component_name", "path", "description"],
//     expr: "", // 可写过滤条件，如 "component == 'combo-list'"
//     limit: 100, // 最多返回多少条
//   });

//   console.log("✅ 查询结果:");
//   console.dir(results, { depth: null });

export const similaritySearch = async (query: string, k = 5) => {
  // 1️⃣ 将 query 转为向量
  const queryVector = await embeddings.embedQuery(query);

  const searchResult = await milvus.search({
    collection_name: "UBML_Components",
    data: [queryVector],
    anns_field: "vector",
    output_fields: ["component_name", "path", "description"],
    topk: k,
    metric_type: "COSINE",
  });

  const results = searchResult.results ?? [];
  return results;
};

//await similaritySearch("需要一个多选下拉框组件", 5);

