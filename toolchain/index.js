import glob from "glob";
import path from "path";
import webpack from "webpack";
import { fileURLToPath } from "url";
import { createFeatureJson } from "./feature.js";
import { generateHydrationTemplates } from "./hydration.js";
import config from "./webpack.config.js";
import { getCommandLineArgs } from "./cli.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const REACT_EXTENSIONS = new Set([".tsx", ".jsx"]);

const templates = glob.sync(`./src/templates/**/*.{tsx,jsx,js,ts}`, {
  root: __dirname,
});

const {mode} = getCommandLineArgs();

const reactTemplates = templates.filter((templatePath) =>
  REACT_EXTENSIONS.has(path.parse(templatePath).ext)
);
generateHydrationTemplates(reactTemplates);

/**
 * Run Webpack Config
 */
console.log("Generating bundles...");
try {
  await new Promise((resolve, reject) => {
    const w = webpack(config.map(c => ({ ...c, mode })));
    w.run((err, stats) => {
      if (err) {
        reject(err);
      }
      console.log(`${stats.toString()}`);
      resolve();
    });
  });
} catch (e) {
  throw e
}
console.log("Generation complete...");

const serverBundles = glob
  .sync("./dist/server/**/*.js")
  .map((p) => path.join("..", p));
const featureJsonPath = path.join(__dirname, "../sites-config/features.json");
try {
  await createFeatureJson(serverBundles, featureJsonPath);
  console.log("Successfully wrote sites-config/feature.json");
} catch (e) {
  console.error("Failed to write sites-config/features.json", e);
}
