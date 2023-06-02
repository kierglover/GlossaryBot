export class VectorStore {
    constructor(embeddings) {
        Object.defineProperty(this, "embeddings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.embeddings = embeddings;
    }
    async similaritySearch(query, k = 4) {
        const results = await this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k);
        return results.map((result) => result[0]);
    }
    async similaritySearchWithScore(query, k = 4) {
        return this.similaritySearchVectorWithScore(await this.embeddings.embedQuery(query), k);
    }
}
export class SaveableVectorStore extends VectorStore {
    static load(_directory, _embeddings) {
        throw new Error("Not implemented");
    }
}
//# sourceMappingURL=base.js.map