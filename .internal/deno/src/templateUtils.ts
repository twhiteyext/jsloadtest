import bundlePathsJson from "./bundlePaths.json" assert {type: "json"}

type BundlePaths = {
  bundlePaths: {
    [key: string]: string[];
  }
}

const pathToModule = new Map();

/**
 * @returns an array of template modules matching the document's feature.
 */
export const readTemplateModules = async (feature: string): Promise<TemplateModule[]> => {
  const modules = [] as TemplateModule[];
  const templateModulePaths  = (bundlePathsJson as BundlePaths).bundlePaths[feature];
  if (!templateModulePaths) {
    throw new Error(`Could not find paths for feature ${feature}`);
  }
  for (const path of templateModulePaths) {
    let importedModule = pathToModule.get(path);
    if (!importedModule) {
      importedModule = await import(path);
      const { config, getPath, render } = importedModule;
      if (!config || !getPath || !render) {
        console.error(path, importedModule);
        continue
      }
      pathToModule.set(path, importedModule);
    }
    modules.push(importedModule as TemplateModule);
  }

  return modules;
};

// Represents a page produced by the generation procees.
export type GeneratedPage = {
  path: string;
  content: string;
  redirects: string[];
};

export type Document = {
  feature: string;
  streamOutput: any;
}

type TemplateModule = {
  config: {
    name: string;
    streamId: string;
  };
  getPath: (data: any) => string;
  render: (data: any) => string;
};

/**
 * Takes an array of template modules info and stream documents, processes them, and
 * writes them to disk.
 * @param moduleEntry an array of Deno.DirEntries corresponding to js modules.
 * @param entities an array of stream documents
 */
export const generateResponses = async (
  modules: TemplateModule[],
  doc: Document,
): Promise<GeneratedPage> => {
  const featureToValidTemplateModule = new Map<string, TemplateModule>();
  for (const mod of modules) {
    const { config, getPath, render } = mod;
    if (!config || !getPath || !render) {
      console.error("Issue with the imported module ", mod);
      continue;
    }
    featureToValidTemplateModule.set(config.name, mod);
  }



  const feature = doc.feature
  const validModule = featureToValidTemplateModule.get(feature);
  if (!validModule) {
    throw new Error(`could not find module for feature ${feature}`);

  }

  return {
    content: validModule.render(doc.streamOutput),
    path: validModule.getPath(doc.streamOutput),
    redirects: [],
  };
};
