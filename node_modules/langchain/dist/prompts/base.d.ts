import { BaseOutputParser } from "./parser.js";
import type { PromptTemplate, FewShotPromptTemplate } from "./index.js";
export type SerializedBasePromptTemplate = ReturnType<InstanceType<typeof PromptTemplate | typeof FewShotPromptTemplate>["serialize"]>;
export type InputValues = Record<string, any>;
export type PartialValues = Record<string, string | (() => Promise<string>) | (() => string)>;
/**
 * Input common to all prompt templates.
 */
export interface BasePromptTemplateInput {
    /**
     * A list of variable names the prompt template expects
     */
    inputVariables: string[];
    /**
     * How to parse the output of calling an LLM on this formatted prompt
     */
    outputParser?: BaseOutputParser;
    /** Partial variables */
    partialVariables?: PartialValues;
}
/**
 * Base class for prompt templates. Exposes a format method that returns a
 * string prompt given a set of input values.
 * @augments BasePromptTemplateInput
 */
export declare abstract class BasePromptTemplate implements BasePromptTemplateInput {
    inputVariables: string[];
    outputParser?: BaseOutputParser;
    partialVariables?: InputValues;
    constructor(input: BasePromptTemplateInput);
    abstract partial(values: PartialValues): Promise<BasePromptTemplate>;
    mergePartialAndUserVariables(userVariables: InputValues): Promise<InputValues>;
    /**
     * Format the prompt given the input values.
     *
     * @param inputValues - A dictionary of arguments to be passed to the prompt template.
     * @returns A formatted prompt string.
     *
     * @example
     * ```ts
     * prompt.format({ foo: "bar" });
     * ```
     */
    abstract format(values: InputValues): Promise<string>;
    /**
     * Return the string type key uniquely identifying this class of prompt template.
     */
    abstract _getPromptType(): string;
    /**
     * Return a json-like object representing this prompt template.
     */
    abstract serialize(): SerializedBasePromptTemplate;
    /**
     * Load a prompt template from a json-like object describing it.
     *
     * @remarks
     * Deserializing needs to be async because templates (e.g. {@link FewShotPromptTemplate}) can
     * reference remote resources that we read asynchronously with a web
     * request.
     */
    static deserialize(data: SerializedBasePromptTemplate): Promise<BasePromptTemplate>;
}
