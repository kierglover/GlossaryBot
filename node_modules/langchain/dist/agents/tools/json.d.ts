import { Tool } from "./base.js";
export type Json = string | number | boolean | null | {
    [key: string]: Json;
} | Json[];
export type JsonObject = {
    [key: string]: Json;
};
export declare class JsonSpec {
    obj: JsonObject;
    maxValueLength: number;
    constructor(obj: JsonObject, max_value_length?: number);
    getKeys(input: string): string;
    getValue(input: string): string;
}
export declare class JsonListKeysTool extends Tool {
    jsonSpec: JsonSpec;
    name: string;
    constructor(jsonSpec: JsonSpec);
    call(input: string): Promise<string>;
    description: string;
}
export declare class JsonGetValueTool extends Tool {
    jsonSpec: JsonSpec;
    name: string;
    constructor(jsonSpec: JsonSpec);
    call(input: string): Promise<string>;
    description: `Can be used to see value in string format at a given path.
    Before calling this you should be SURE that the path to this exists.
    The input is a text representation of the path to the json as json pointer syntax (e.g. /key1/0/key2).`;
}
