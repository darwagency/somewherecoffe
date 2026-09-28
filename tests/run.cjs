/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  const resolved = request.startsWith("@/") ? path.join(__dirname, "..", "src", request.slice(2)) : request;
  return originalResolve.call(this, resolved, parent, isMain, options);
};
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "@phosphor-icons/react") {
    return new Proxy({}, { get: () => (props) => React.createElement("svg", { "aria-hidden": true, ...props }) });
  }
  if (request === "next/image") {
    return { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) };
  }
  return originalLoad.call(this, request, parent, isMain);
};

for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = function (module, filename) {
    const source = fs.readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    module._compile(output, filename);
  };
}

require("./order.test.ts");
require("./flow.test.ts");
