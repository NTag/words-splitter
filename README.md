# Words Splitter

Split a French sentence without any spaces nor accents, into words.

Example: `jepenserestersurparisouprendreletgvpourmarseille` → `je pense rester sur Paris ou prendre le TGV pour Marseille`

Useful for domains/URLs, which can't contain spaces. Example: https://github.com/ntag/secho.fr or https://desurlsansespaces.sécho.fr

## Installation
```
npm i words-splitter
```

## Usage

```js
const { addWord, splitSentence, loadDictionary } = require('words-splitter');

const main = async () => {
  await loadDictionary(); // Take a few seconds to load all French words with their probability

  addWord('MonMOTÀmoi'); // If you want, you can add your own words to the dictionary
  // "monmotamoi" will now be recognized as a word: "MonMOTÀmoi"
  // previously, "monmotamoi" was converted to "mon mot à moi"

  console.log(splitSentence('faire10hdetrainaveclasncf'));
  console.log(splitSentence('jemappellemathildeetvous'));
  console.log(splitSentence('monnomestthomas'));
  console.log(splitSentence('oupartezvousenvacances'));
  console.log(splitSentence('jhesiteentrenancyetalenconetvous'));
  console.log(splitSentence('jepenserestersurparisouprendreletgvpourmarseille'));

  console.log(splitSentence('quepensezvousdemonmotamoi'));

  // faire 10h de train avec la SNCF
  // je m'appelle Mathilde et vous
  // mon nom est Thomas
  // ou partez-vous en vacances
  // j'hésite entre Nancy et Alençon et vous
  // je pense rester sur Paris ou prendre le TGV pour Marseille

  // que pensez-vous de MonMOTÀmoi
};

main();
```

## Acknowledgement
Algorithm from https://stackoverflow.com/questions/8870261/how-to-split-text-without-spaces-into-list-of-words.
List of words created from Wikipedia French articles.

## Building the dictionary
Download `frwiki-latest-pages-articles.xml` from https://dumps.wikimedia.org/frwiki/latest/, extract it and move it in the current folder.
Execute `node --max_old_space_size=4096 create-dictionary.js`.
It will output two files, the one to use is `words-fr-new.txt`. The process may also crash at some point because of a too high memory usage 🤷‍♂️.
Then, execute `node minimize-dictionary.js` to slightly reduce the size of the dictionary. It will output a `words-fr-new-min.txt` which is the final dictionary.
