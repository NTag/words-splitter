const readline = require('readline');
const fs = require('fs');
const _ = require('lodash');
const striptags = require('striptags');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const SENTENCES = './frwiki-latest-pages-articles.xml';
const WORDS = {};

const wikipediaPrepare = (line) => {
  // Ignore lines with XML tags
  if (/<.+>/.test(line) || /^( *)!/.test(line) || /^( *)\|/.test(line) || /^{/.test(line)) {
    return '';
  }
  line = line.replace(/ {.*?} /g, ' ');
  line = line.replace(/[^ ]+{.*?} /g, ' ');
  line = line.replace(/ {.*?}[^ ]+/g, ' ');
  line = line.replace(/[^ ]+{.*?}[^ ]+/g, '');
  line = line.replace(/ \[.*?\] /g, ' ');
  line = line.replace(/[^ ]+\[.*?\] /g, ' ');
  line = line.replace(/ \[.*?\][^ ]+/g, ' ');
  line = line.replace(/[^ ]+\[.*?\][^ ]+/g, '');
  line = entities.decode(line);
  line = striptags(line);

  return line;
};

const extractWords = (line) => {
  line = wikipediaPrepare(line);
  line = line.replace(/\./g, '');
  const r = /[^a-zA-Z0-9àâçéèêëœïîôöüûùÀÂÇÉÈÊËÏÎÔÖÛÜÙ '’-]/g;
  line = _.trim(line.replace(r, ' '));
  line = _.trim(line.replace(/ (-+)/g, ' '));
  line = _.trim(line.replace(/(-+) /g, ' '));
  line = _.trim(line.replace(/ ('+)/g, ' '));
  line = _.trim(line.replace(/('+) /g, ' '));
  line = _.trim(line.replace(/^('+)/, ''));
  line = _.trim(line.replace(/('+)$/, ''));
  line = _.trim(line.replace(/^(-+)/, ''));
  line = _.trim(line.replace(/(-+)$/, ''));
  line = line.replace(/ +/g, ' ');
  return line.split(' ').filter((word) => word && word.length >= 1);
};

const rl = readline.createInterface({
  input: fs.createReadStream(SENTENCES),
});

let nbLine = 0;

rl.on('line', (line) => {
  nbLine += 1;
  const words = extractWords(line);
  words.forEach((word) => {
    if (!WORDS[word]) {
      WORDS[word] = 0;
    }
    WORDS[word] += 1;
  });

  if ((nbLine % 10000) === 0) {
    console.log(`Line ${nbLine.toLocaleString()} (${words.join(', ')})`);
  }
  if ((nbLine % 1000000) === 0) {
    analyze();
  }
});

const analyze = () => {
  fs.copyFileSync('./words-fr-new-backup.txt', './words-fr-new.txt');
  const output = fs.createWriteStream('./words-fr-new-backup.txt', {
    encoding: 'utf8',
  });
  for (let word in WORDS) {
    if (WORDS[word] > 1) {
      output.write(`${word} ${WORDS[word]}\n`);
    }
  }
  output.end();
};

rl.on('close', () => {
  analyze();
});
