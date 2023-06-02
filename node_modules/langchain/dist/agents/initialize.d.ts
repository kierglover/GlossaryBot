import { Tool } from "./tools/index.js";
import { BaseLLM } from "../llms/index.js";
import { AgentExecutor } from "./executor.js";
export declare const initializeAgentExecutor: (tools: Tool[], llm: BaseLLM, agentType?: string) => Promise<AgentExecutor>;
