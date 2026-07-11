import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
    entryPoints: ["src/server.js"],

    bundle: true,

    outdir: "dist",

    platform: "node",

    format: "esm",

    target: "node22",

    packages: "external",

    sourcemap: true,

    jsx: "automatic",

    logLevel: "info",
});

if (watch) {
    await ctx.watch();

    console.log("Watching...");
} else {
    await ctx.rebuild();

    await ctx.dispose();
}
