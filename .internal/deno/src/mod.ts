import { generateResponses, readTemplateModules, GeneratedPage, Document } from "./templateUtils.ts";

/**
 * The functionality below will need to be transformed into an exported function to adhere
 * to the Yext Plugin interface. Similarly, any relative paths will need to be updated depending
 * on the final decision on where Plugin files will live.
 */

export const Generate = async (data: Document): Promise<GeneratedPage> => {
  const start = Date.now();
  console.log("Loading templates...");
  const templates = await readTemplateModules(data.feature);
  console.log(`Found ${templates.length} templates`);
  let millis = Date.now() - start;
  console.log(`Milliseconds to pull template modules: ${millis}`)

  console.log("Generating Pages...");
  const responses = await generateResponses(templates, data);
  millis = Date.now() - start;
  console.log(`Total Generate plugin time (in milliseconds): ${millis}`)

  return responses;
}