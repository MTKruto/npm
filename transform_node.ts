import { build, emptyDir } from "jsr:@deno/dnt@0.41.1";

const version = Deno.args[0];
if (!version) {
  console.error("Version not provided.");
  Deno.exit(1);
}

await emptyDir("./dist");

await build({
  entryPoints: [
    "mod.ts",
    {
      name: "./1_utilities",
      path: "1_utilities.ts",
    },
  ],
  outDir: "./dist",
  typeCheck: false,
  test: true,
  shims: {
    deno: true,
    crypto: true,
    webSocket: true,
  },
  compilerOptions: {
    lib: ["ESNext", "DOM", "ESNext.AsyncIterable"],
  },
  mappings: {
    "./storage/2_storage_local_storage.ts":
      "./storage/2_storage_local_storage.node.ts",
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
    dependencies: {
      "node-localstorage": "^3.0.5",
    },
    devDependencies: {
      "@types/node-localstorage": "^1.3.3",
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
