import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

const version = Deno.args[0];
if (!version) {
  console.error("Version not provided.");
  Deno.exit(1);
}

const entryPoint = Deno.args[1];
if (!entryPoint) {
  console.error("Entry point not provided.");
  Deno.exit(1);
}

await emptyDir("./dist");

await build({
  entryPoints: [entryPoint],
  outDir: "./dist",
  typeCheck: "both",
  test: true,
  shims: {
    deno: true,
    crypto: true,
    webSocket: true,
  },
  compilerOptions: {
    lib: ["ESNext", "DOM", "ESNext.AsyncIterable"],
  },
  packageManager: "pnpm",
  package: {
    name: "@mtkruto/node",
    version,
    description: "MTKruto for Node.js",
    author: "Roj <rojvv@icloud.com>",
    license: "LGPL-3.0-or-later",
    repository: {
      type: "git",
      url: "git+https://github.com/MTKruto/MTKruto.git",
    },
    devDependencies: {
      "@types/object-inspect": "^1.8.1",
    },
  },
  postBuild() {
    Deno.copyFileSync("COPYING", "dist/COPYING");
    Deno.copyFileSync("COPYING.LESSER", "dist/COPYING.LESSER");
    Deno.copyFileSync("README.md", "dist/README.md");
  },
  filterDiagnostic(diagnostic) {
    if (
      diagnostic.file?.fileName.endsWith("fmt/colors.ts")
    ) {
      return false;
    }
    return true;
  },
});
