import path from "path";
import glob from "glob";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hydrationOut = "../.internal/hydration";
const hydrationOutputPath = path.resolve(__dirname, hydrationOut);

try {
  console.log(`Cleaning build artifacts...`);
  fs.rmSync(path.resolve(__dirname, "../dist"), { recursive: true });
  fs.rmSync(path.resolve(__dirname, hydrationOutputPath), { recursive: true });
  console.log(`Finished cleaning.`);
} catch (e) {
  console.log(`Nothing to clean.`);
}

const activeTemplates = new Set();
const templateEntries = glob
  .sync(`./src/templates/**/*.{tsx,jsx,js,ts}`)
  .reduce((obj, el) => {
    activeTemplates.add(path.parse(el).name);
    obj[path.parse(el).name] = el;
    return obj;
  }, {});

// Config for bundling templates to be generated server-side.
const serverConfig = {
  entry: {
    ...templateEntries,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      handlebars: "handlebars/dist/handlebars.amd.min.js",
    },
  },
  output: {
    filename: "server/[name].js",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};

const clientConfig = {
  entry: () => {
    return glob
      .sync(`./.internal/hydration/**/*.tsx`)
      .filter((entry) => activeTemplates.has(path.parse(entry).name))
      .reduce((obj, el) => {
        obj[path.parse(el).name] = el;
        return obj;
      }, {});
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "hydrate/[name].js",
  },
};

export default [serverConfig, clientConfig];
