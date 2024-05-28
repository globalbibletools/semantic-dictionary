#!/usr/bin/env node

// Usage: ./extract-ubs-dictionary-entries.js translation-language original-language  dictionaryFile
import xml2js from "xml2js";
import fs from "node:fs";
import console from "node:console";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// See https://nodejs.org/docs/latest/api/process.html#processargv
const translationLanguage = process.argv[2];
const originalLanguage = process.argv[3];
const ubsDictionaryFilePath = process.argv[4];

const scriptDir = dirname(fileURLToPath(import.meta.url));

if (!translationLanguage || !originalLanguage || !ubsDictionaryFilePath) {
  console.error(
    "Error: please provide the following arguments (in order):\n",
    "\t(1) The translation language of the dictionary (eng, spa, etc).\n",
    "\t(2) The original language being translated from (hebrew or greek).\n",
    "\t(3) The path to the dictionary XML file\n",
    `Only ${
      process.argv.slice(2, 4).filter((value) => !!value).length
    } argument(s) were passed of the 3 required`
  );
} else {
  try {
    console.log(`Opening dictionary file '${ubsDictionaryFilePath}'...`);
    const ubsDictionary = fs.readFileSync(ubsDictionaryFilePath, {
      flag: "r",
    });

    console.log("Parsing (this may take some time)...");
    const parsedDictionary = await xml2js.parseStringPromise(ubsDictionary);

    console.log("Making directory for data...");
    const dataDir = `${scriptDir}/../data/${translationLanguage}/${originalLanguage}`;
    fs.mkdirSync(dataDir, { recursive: true });

    console.log("Extracting lexicon entries into individual files...");
    const xmlBuilder = new xml2js.Builder({ rootName: "Lexicon_Entry" });

    for (const lexiconEntry of parsedDictionary["Lexicon"]["Lexicon_Entry"]) {
      fs.writeFileSync(
        `${dataDir}/${lexiconEntry["$"]["Id"].slice(0, 6)}.xml`,
        xmlBuilder.buildObject(lexiconEntry)
      );
    }
    console.log(`Finished! Entry files stored in the data directory.`);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}
