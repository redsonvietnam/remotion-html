import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.vitest.ts"],
    exclude: ["node_modules", "out", "legacy"],
    environment: "node",
    globals: true,
  },
});
