"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastmcp_1 = require("fastmcp");
const zod_1 = require("zod"); // Or any validation library that supports Standard Schema
const server = new fastmcp_1.FastMCP({
    name: "My Server",
    version: "1.0.0",
});
server.addTool({
    name: "add",
    description: "Add two numbers",
    parameters: zod_1.z.object({
        a: zod_1.z.number(),
        b: zod_1.z.number(),
    }),
    execute: async (args) => {
        return String(args.a + args.b);
    },
});
server.start({
    transportType: "stdio",
});
