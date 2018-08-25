const fs = require('fs');
const _ = require('lodash');
const readline = require('readline');
const path = require('path');

const FILE_WORDS = path.join(__dirname, 'words-fr.txt');
const WORDS = {};
let maxLength = 0;
let maxCost = 9e999;

const simplifyWord = (word) => {
  return _.deburr(word.toLocaleLowerCase()).replace(/[^0-9a-z]/g, '');
};

const loadDictionary = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(FILE_WORDS),
    });

    let nbOcc = 0;

    rl.on('line', (line) => {
      const data = line.split(' ');

      const wordLowerCase = data[0].toLocaleLowerCase();
      const c = parseFloat(data[1]);
      if (!WORDS[wordLowerCase] || WORDS[wordLowerCase].c < c) {
        WORDS[wordLowerCase] = {
          c,
          w: data[0],
        };
      }
      const wordSimplified = simplifyWord(data[0]);
      if (!WORDS[wordSimplified] || WORDS[wordSimplified].c < c) {
        WORDS[wordSimplified] = {
          c,
          w: data[0],
        };
        nbOcc += c;
      }
    });

    rl.on('close', () => {
      Object.keys(WORDS).forEach((word) => {
        const c = - Math.log(WORDS[word].c / nbOcc)
        WORDS[word].c = c;
        if (c < maxCost) {
          maxCost = c;
        }
        if (word.length > maxLength) {
          maxLength = word.length;
        }
      });
      resolve(WORDS);
    });
  });
};

const splitSentence = (s) => {
  const cost = [0];

  const bestMatch = (i) => {
    let best = 9e9999;
    let k = 0;
    for (let j = 0; j < i; j += 1) {
      if (WORDS[s.slice(j, i)]) {
        let currentCost = cost[j] + (WORDS[s.slice(j, i)].c);
        if (currentCost < best) {
          best = currentCost;
          k = j;
        }
      }
    }
    return [best, k];
  };

  for (let i = 1; i <= s.length; i += 1) {
    let [c, k] = bestMatch(i);
    cost.push(c);
  }

  const out = [];
  let i = s.length;
  while (i > 0) {
    let [c, k] = bestMatch(i);
    out.push(WORDS[s.slice(k, i)].w);
    i -= i - k;
  }

  return out.reverse().join(' ');
};

const addWord = (word) => {
  WORDS[word.toLocaleLowerCase()] = {
    c: maxCost,
    w: word,
  };
  WORDS[simplifyWord(word)] = {
    c: maxCost,
    w: word,
  };
};

module.exports = {
  addWord,
  loadDictionary,
  splitSentence,
};
