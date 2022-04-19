import * as mod from "../src/mod.ts";

const doc = {
    feature: "fastfood-hydration",
    streamOutput: { id: "adsiofjhaodsijfioadsjiofjdasijfiodsajfoidasjio", name: "name", description: "dsiohfsadoifhioashiohfiosahfi dsaifoj dsaiofjsaiodfj iosadjfj dsiaofjasiodfj ioasjfioasdjfioasjd ifjiadsofj iosadjfis djaisdj iofasdijf" },
};

let p = new Promise(res => res(mod.Generate(doc)));
for (const i of [...Array(1000000).values()]) {
    p = p.then(() => mod.Generate(doc));
}
await p;
console.log(JSON.stringify(Deno.memoryUsage(), null, "  "));