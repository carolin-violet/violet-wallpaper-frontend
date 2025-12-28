#!/usr/bin/env bun
/**
 * OpenAPI 代码生成脚本
 * 支持从本地文件或远程 URL 生成 TypeScript API 客户端
 */

import { spawn } from "bun";
import { existsSync } from "fs";
import { join } from "path";

const args = process.argv.slice(2);
const input = args.find((arg) => arg.startsWith("--input="))?.split("=")[1];
const output =
  args.find((arg) => arg.startsWith("--output="))?.split("=")[1] ||
  "./app/api/generated";
const client =
  args.find((arg) => arg.startsWith("--client="))?.split("=")[1] || "axios";

if (!input) {
  console.error("❌ 错误: 请提供 --input 参数（OpenAPI 文档路径或 URL）");
  console.log("\n使用方法:");
  console.log("  bun run scripts/generate-api.ts --input=./openapi.json");
  console.log(
    "  bun run scripts/generate-api.ts --input=http://127.0.0.1:8203/openapi.json"
  );
  process.exit(1);
}

// 检查输入是文件还是 URL
const isUrl = input.startsWith("http://") || input.startsWith("https://");
const isFile = !isUrl && existsSync(input);

if (!isUrl && !isFile) {
  console.error(`❌ 错误: 输入文件不存在: ${input}`);
  process.exit(1);
}

console.log(`📦 开始生成 API 客户端...`);
console.log(`   输入: ${input}`);
console.log(`   输出: ${output}`);
console.log(`   客户端: ${client}\n`);

try {
  // 使用 openapi-typescript-codegen 生成代码
  const result = spawn(
    [
      "bunx",
      "openapi-typescript-codegen",
      "--input",
      input,
      "--output",
      output,
      "--client",
      client,
      "--useOptions",
      "true",
      "--useUnionTypes",
      "true",
    ],
    {
      stdout: "inherit",
      stderr: "inherit",
    }
  );

  await result.exited;

  if (result.exitCode === 0) {
    console.log(`\n✅ API 客户端生成成功！`);
    console.log(`   输出目录: ${output}`);
  } else {
    console.error(`\n❌ 生成失败，退出码: ${result.exitCode}`);
    process.exit(1);
  }
} catch (error) {
  console.error("❌ 生成过程中出现错误:", error);
  process.exit(1);
}
