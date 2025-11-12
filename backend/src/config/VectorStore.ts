import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { VectorStore } from "@langchain/core/vectorstores";
import { Document } from "@langchain/core/documents";

export class MilvusVectorStore extends VectorStore {
  client: any;
  collectionName: string;

  constructor(embeddings: any, config: { address: string ; collectionName: string }) {
    console.log("Milvus config >>>", config);
    super(embeddings, config);
    const address = config.address ?? process.env.MILVUS_URL;
    const collectionName = config.collectionName ?? "default_collection";
    this.client = new MilvusClient({ address });
    this.collectionName = collectionName;
  }

  _vectorstoreType(): string {
    return "milvus";
  }

  /** ✅ 用于插入原始向量 */
  async addVectors(vectors: number[][], documents: Document[]) {
    const texts = documents.map(d => d.pageContent);

    // 这里假设 collection 已经存在
    const insertResult = await this.client.insert({
      collection_name: this.collectionName,
      fields_data: vectors.map((v, i) => ({
        vector: v,
        text: texts[i],
      })),
    });

    return insertResult;
  }

  /** ✅ 兼容 LangChain 的标准接口：插入文档 */
  async addDocuments(docs: Document[]) {
    const texts = docs.map(d => d.pageContent);
    const vectors = await this.embeddings.embedDocuments(texts);
    return this.addVectors(vectors, docs);
  }

  /** ✅ 用向量做相似度搜索 */
  async similaritySearchVectorWithScore(queryVector: number[], k = 4) {
    const results = await this.client.search({
      collection_name: this.collectionName,
      vectors: [queryVector],
      topk: k,
      output_fields: ["text"],
    });
    if (!results.results) return [];
    return results.results.map((hit: any) => [
      new Document({ pageContent: hit.text }),
      hit.score ?? 0
    ]);
  }

  /** ✅ 用文本做查询（封装一层） */
  async similaritySearch(query: string, k = 4) {
    const vector = await this.embeddings.embedQuery(query);
    const docsWithScore = await this.similaritySearchVectorWithScore(vector, k);
    return docsWithScore.map(([doc]:any) => doc);
  }

   /**
   * 工厂方法：从文本直接构建存储（LangChain 规范要求）
   */
  static async fromTexts(texts:any, metadatas:any, embeddings:any, config:any) {
    const store = new MilvusVectorStore(embeddings, config);
    const docs = texts.map(
      (text:any, i:any) => new Document({ pageContent: text, metadata: metadatas?.[i] })
    );
    await store.addDocuments(docs);
    return store;
  }

  /**
   * 工厂方法：从 Document 对象创建
   */
  static async fromDocuments(docs:any, embeddings:any, config:any) {
    const store = new MilvusVectorStore(embeddings, config);
    await store.addDocuments(docs);
    return store;
  }
}
