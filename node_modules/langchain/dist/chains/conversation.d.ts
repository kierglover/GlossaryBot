import { LLMChain } from "./llm_chain.js";
import { BaseLLM } from "../llms/index.js";
import { BasePromptTemplate } from "../prompts/index.js";
import { BaseMemory } from "../memory/index.js";
export declare class ConversationChain extends LLMChain {
    constructor(fields: {
        llm: BaseLLM;
        prompt?: BasePromptTemplate;
        outputKey?: string;
        memory?: BaseMemory;
    });
}
