const xml2js = require("xml2js");
const fs = require("node:fs");
const readline = require("node:readline");
const console = require("node:console");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question(`Enter a semantic dictionary xml file to parse: `, (path) => {
  rl.question(`Enter the language code for this file: `, (code) => {
    fs.readFile(path, (err, data) => {
      if (err) throw err;
      console.log("Parsing (this may take some time)...");
      xml2js.parseString(data, (err, result) => {
        if (err) throw err;
        console.log("Making directory ....");
        fs.mkdirSync(`../data/${code}`);
        console.log("Splitting into files...");
        const xmlBuilder = new xml2js.Builder({ rootName: "Lexicon_Entry" });
        for (const lexiconEntry of result["Lexicon"]["Lexicon_Entry"]) {
          fs.writeFileSync(
            `../data/${code}/${lexiconEntry["$"]["Id"]}.xml`,
            xmlBuilder.buildObject(lexiconEntry),
            { flag: "w+" }
          );
        }
      });
    });
  });
});
