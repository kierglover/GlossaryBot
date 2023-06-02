import { BaseMemory, } from "./base.js";
const getInputValue = (inputValues) => {
    const keys = Object.keys(inputValues);
    if (keys.length === 1) {
        return inputValues[keys[0]];
    }
    throw new Error("input values have multiple keys, memory only supported when one key currently");
};
export class BufferWindowMemory extends BaseMemory {
    constructor(fields) {
        super();
        Object.defineProperty(this, "humanPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Human"
        });
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AI"
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        Object.defineProperty(this, "buffer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "k", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
        });
        this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
        this.memoryKey = fields?.memoryKey ?? this.memoryKey;
        this.k = fields?.k ?? this.k;
    }
    async loadMemoryVariables(_values) {
        const result = {
            [this.memoryKey]: this.buffer.slice(-this.k).join("\n\n"),
        };
        return result;
    }
    async saveContext(inputValues, outputValues) {
        const values = await outputValues;
        const human = `${this.humanPrefix}: ${getInputValue(inputValues)}`;
        const ai = `${this.aiPrefix}: ${getInputValue(values)}`;
        const newlines = [human, ai];
        this.buffer.push(`\n${newlines.join("\n")}`);
    }
}
//# sourceMappingURL=buffer_window_memory.js.map