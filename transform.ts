import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";

const version = Deno.args[0];

if (!version) {
  console.error("Version not provided.");
  Deno.exit(1);
}

const entryPoint = Deno.args[1];

if (!version) {
  console.error("entryPoint not provided.");
  Deno.exit(1);
}

await emptyDir("./dist");

await build({
  entryPoints: [entryPoint],
  outDir: "./dist",
  typeCheck: false,
  test: false,
  shims: {
    custom: [{
      module: "./deno_global.ts",
      globalNames: ["Deno"],
    }],
  },
  compilerOptions: {
    lib: ["esnext", "dom", "dom.iterable"],
  },
  packageManager: "pnpm",
  package: {
    name: "mtkruto",
    version,
    description: "An attempt to write a Deno-native MTProto client",
    author: "Roj <rojserbest@icloud.com>",
    license: "LGPL-3.0-or-later",
    repository: {
      type: "git",
      url: "git+https://github.com/MTKruto/MTKruto.git",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
    Deno.copyFileSync("README.md", "dist/README.md");
  },
});
