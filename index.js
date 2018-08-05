const fs = require('fs');
const _ = require('lodash');
const readline = require('readline');

const FILE_WORDS = './words-fr.txt';
const WORDS = {};
let maxLength = 0;

const simplifyWord = (word) => {
  return _.deburr(word).toLocaleLowerCase().replace(/[^a-z]/g, '');
};

const loadDictionnary = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(FILE_WORDS),
    });

    let nbOcc = 0;

    rl.on('line', (line) => {
      const data = line.split(' ');
      if (!WORDS[simplifyWord(data[0])]) {
        WORDS[simplifyWord(data[0])] = {
          c: parseFloat(data[1]),
          w: data[0],
        };
        nbOcc += parseFloat(data[1]);
      }
    });

    rl.on('close', () => {
      Object.keys(WORDS).forEach((word) => {
        WORDS[word].c = - Math.log(WORDS[word].c / nbOcc);
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
    let best = 9e999;
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

module.exports = {
  splitSentence,
  loadDictionnary,
};
