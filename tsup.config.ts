import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs", "iife"],
    dts: true,
    minify: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    terserOptions: {
        format: {
            comments: "all",
        }
    }
});