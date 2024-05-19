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
  test: false,
  shims: {
    custom: [{
      package: {
        name: "@deno/shim-deno",
        version: "~0.18.0",
      },
      globalNames: [{ name: "Deno", typeOnly: true }],
    }],
  },
  compilerOptions: {
    lib: ["ESNext", "DOM", "ESNext.AsyncIterable"],
  },
  packageManager: "pnpm",
  package: {
    name: "@mtkruto/browser",
    version,
    description: "MTKruto for browsers",
    author: "Roj <rojvv@icloud.com>",
    license: "LGPL-3.0-or-later",
    repository: {
      type: "git",
      url: "git+https://github.com/MTKruto/MTKruto.git",
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
