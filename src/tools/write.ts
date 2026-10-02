import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Tool } from "../types.ts";

export const writeTool: Tool = {
  name: "write",
  description: "Write content to a file, creating or overwriting it.",
  parameters: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Path to the file, relative to the current folder",
      },
      content: {
        type: "string",
        description: "The full text content to write into the file",
      },
    },
    required: ["path", "content"],
  },
  async execute(args) {
    const filePath = resolve(process.cwd(), String(args.path));
    await writeFile(filePath, String(args.content ?? ""), "utf8");
    return `Successfully wrote ${Buffer.byteLength(String(args.content ?? ""))} bytes to ${args.path}`;
  },
};
