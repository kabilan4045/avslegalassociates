// Prisma v7 config — connection URLs live here, not in schema.prisma
// Docs: https://pris.ly/d/config-datasource
import "dotenv/config";
import path from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig } from "prisma/config";

// Load .env manually so special characters in passwords are handled correctly
const envPath = path.resolve(process.cwd(), ".env");
const envContent = readFileSync(envPath, "utf-8");
const envMap: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/);
  if (match) envMap[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
}

const DATABASE_URL = envMap["DATABASE_URL"] ?? process.env["DATABASE_URL"] ?? "";
const DIRECT_URL   = envMap["DIRECT_URL"]   ?? process.env["DIRECT_URL"]   ?? DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DIRECT_URL, // Use session pooler for migrations (port 5432)
  },
});
