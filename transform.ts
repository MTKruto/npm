import { build, emptyDir } from "jsr:@deno/dnt@0.41.3";
import COMPRESSIONSTREAM_PATCH from "./compressionstream_patch.ts";

const version = Deno.args[0];
if (!version) {
  console.error("Version not provided.");
  Deno.exit(1);
}

await emptyDir("./dist");

const mod = Deno.readTextFileSync("mod.ts");

Deno.writeTextFileSync("mod.ts", mod.trim() + "\n" + COMPRESSIONSTREAM_PATCH);

try {
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
      custom: [{
        package: {
          name: "@deno/shim-deno",
          version: "~0.19.2",
        },
        globalNames: ["Deno"],
      }],
      crypto: true,
      webSocket: true,
      prompts: true,
    },
    compilerOptions: {
      lib: ["ESNext", "DOM", "ESNext.AsyncIterable"],
    },
    mappings: {
      "./storage/2_storage_local_storage.ts":
        "./storage/2_storage_local_storage.node.ts",
      "./connection/1_connection_tcp.ts":
        "./connection/1_connection_tcp.node.ts",
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
} finally {
  Deno.writeTextFileSync("mod.ts", mod);
}
