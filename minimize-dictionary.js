const fs = require('fs');
const _ = require('lodash');
const readline = require('readline');
const path = require('path');

const FILE_WORDS = path.join(__dirname, 'words-fr-new.txt');
const WORDS = {};

const simplifyWord = (word) => {
  return _.deburr(word.toLocaleLowerCase()).replace(/[^0-9a-z]/g, '');
};

const loadDictionary = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(FILE_WORDS),
    });

    rl.on('line', (line) => {
      const data = line.split(' ');

      const wordLowerCase = data[0].toLocaleLowerCase();
      const n = parseFloat(data[1]);
      if (!WORDS[wordLowerCase] || WORDS[wordLowerCase].n < n) {
        WORDS[wordLowerCase] = {
          n,
          w: data[0],
        };
      }
      const wordSimplified = simplifyWord(data[0]);
      if (!WORDS[wordSimplified] || WORDS[wordSimplified].n < n) {
        WORDS[wordSimplified] = {
          n,
          w: data[0],
        };
      }
    });

    rl.on('close', () => {
      resolve(WORDS);
    });
  });
};

const main = async () => {
  const dict = await loadDictionary();
  const output = fs.createWriteStream('./words-fr-new-min.txt', {
    encoding: 'utf8',
  });
  const written = {};
  for (let word in dict) {
    if (WORDS[word].n > 1 && !written[WORDS[word].w]) {
      written[WORDS[word].w] = true;
      output.write(`${WORDS[word].w} ${WORDS[word].n}\n`);
    }
  }
  output.end();
};

main();
