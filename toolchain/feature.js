import glob from "glob";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Run feature.json Generation
 */
export const createFeatureJson = async (serverBundlePaths, featurePath) => {
  const features = [];
  const streams = [];
  for (const p of serverBundlePaths) {
    let mod = {};
    try {
      mod = await import(p);
    } catch (e) {
      console.error(e);
      console.error("could not import " + p);
    }

    if (!mod.config) {
      console.log("no mod config")
      continue;
    }
    features.push({
      name: mod.config.name,
      streamId: mod.config.stream["$id"],
      entityPageSet: {
        plugin: {}
      },
      templateType: "JS"
    });

    streams.push({ ...mod.config.stream });
  }
  fs.writeFileSync(
    featurePath,
    JSON.stringify({ features, streams }, "", "  ")
  );
};
