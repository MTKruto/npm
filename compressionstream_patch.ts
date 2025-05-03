export default `import {
  createDeflate,
  createDeflateRaw,
  createGunzip,
  createGzip,
  createInflate,
  createInflateRaw,
} from "node:zlib";

// From https://github.com/ungap/compression-stream/blob/main/index.js with slight modifications.

if (!("CompressionStream" in globalThis)) {
  // original idea: MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource>
  // @see https://github.com/oven-sh/bun/issues/1723#issuecomment-1774174194

  class Stream {
    readable: ReadableStream;
    writable: WritableStream;

    constructor(compress: boolean, format: string) {
      let handler;
      if (format === "gzip") {
        handler = compress ? createGzip() : createGunzip();
      } else if (format === "deflate") {
        handler = compress ? createDeflate() : createInflate();
      } else if (format === "deflate-raw") {
        handler = compress ? createDeflateRaw() : createInflateRaw();
      } else {
        throw new TypeError([
          \`Failed to construct '\${this.constructor.name}'\`,
          \`Unsupported compression format: '\${format}'\`,
        ].join(": "));
      }

      this.readable = new ReadableStream({
        // @ts-ignore: why?
        type: "bytes",
        start: (controller) => {
          handler.on("data", (chunk) => controller.enqueue(chunk));
          handler.once("end", () => controller.close());
        },
      });

      this.writable = new WritableStream({
        write: (chunk) => void handler.write(chunk),
        close: () => void handler.end(),
      });
    }
  }

  globalThis.CompressionStream = class CompressionStream extends Stream {
    constructor(format: string) {
      super(true, format);
    }
  };

  globalThis.DecompressionStream = class DecompressionStream extends Stream {
    constructor(format: string) {
      super(false, format);
    }
  };
}
`