import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

export const createUBMLComponentsCollection = async (
  client?: MilvusClient
) => {
  const milvus =
    client ??
    new MilvusClient({ address: process.env.MILVUS_URL ?? "http://localhost:19530" });

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