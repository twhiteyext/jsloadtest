import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Run Hydration Template Generation
 */

const hydrationOut = "../.internal/hydration";
const absoluteHydrationOutPath = path.resolve(__dirname, hydrationOut);

const hydrationTemplate = `import * as React from "react";
import * as ReactDOM from "react-dom";
import { Page } from "{{importPath}}";

const data = (window as any).__INITIAL__DATA__;
ReactDOM.hydrate(<Page data={data} />, document.getElementById("reactele"));`;

const genHydrationTemplates = (importPath) =>
  handlebars.compile(hydrationTemplate)({ importPath });

export const generateHydrationTemplates = (reactTemplates) => {
  reactTemplates.map(generateTemplate);
};

const generateTemplate = (templatePath) => {
  const basename = path.basename(templatePath);
  const extension = path.extname(templatePath);
  const absoluteTemplatePath = path.resolve(templatePath);
  const relPath = path.relative(absoluteHydrationOutPath, absoluteTemplatePath);

  const templateBytes = genHydrationTemplates(
    relPath.substring(0, relPath.length - extension.length)
  );
  const outPath = `${absoluteHydrationOutPath}/${basename}`;
  if (!fs.existsSync(absoluteHydrationOutPath)) {
    console.log(absoluteHydrationOutPath);
    fs.mkdirSync(absoluteHydrationOutPath, { recursive: true });
  }
  console.log(`Writing file to ${outPath}`);
  fs.writeFileSync(outPath, templateBytes, {});
};
