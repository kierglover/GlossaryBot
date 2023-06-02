import sqlite3 from "sqlite3";
import { Tool } from "./base.js";
import { LLMChain } from "../../chains/index.js";
export declare class SqlDatabase {
    private db;
    constructor(db: sqlite3.Database);
    getTables(): Promise<string[]>;
    getCreateTableStatement(tableName: string): Promise<string>;
    getSampleData(tableName: string, limit?: number): Promise<string[]>;
    executeQuery(query: string): Promise<string[]>;
}
interface SqlTool {
    db: SqlDatabase;
}
export declare class QuerySqlTool extends Tool implements SqlTool {
    name: string;
    db: SqlDatabase;
    constructor(db: SqlDatabase);
    call(input: string): Promise<string>;
    description: string;
}
export declare class InfoSqlTool extends Tool implements SqlTool {
    name: string;
    db: SqlDatabase;
    constructor(db: SqlDatabase);
    call(input: string): Promise<string>;
    description: string;
}
export declare class ListTablesSqlTool extends Tool implements SqlTool {
    name: string;
    db: SqlDatabase;
    constructor(db: SqlDatabase);
    call(_: string): Promise<string>;
    description: string;
}
export declare class QueryCheckerTool extends Tool {
    name: string;
    template: string;
    llmChain: LLMChain;
    constructor(llmChain?: LLMChain);
    call(input: string): Promise<string>;
    description: string;
}
export {};
