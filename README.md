# Words Splitter

Split a French sentence without any spaces nor accents, into words.

Example: `jepenserestersurparisouprendreletgvpourmarseille` → `je pense rester sur Paris ou prendre le TGV pour Marseille`

## Installation
```
npm i words-splitter
```

## Usage

```js
const { splitSentence, loadDictionnary } = require('words-splitter');

const main = async () => {
  await loadDictionnary(); // Take a few seconds to load all French words with their probability

  console.log(splitSentence('faire10hdetrainaveclasncf'));
  console.log(splitSentence('jemappellemathildeetvous'));
  console.log(splitSentence('monnomestthomas'));
  console.log(splitSentence('oupartezvousenvacances'));
  console.log(splitSentence('jhesiteentrenancyetalenconetvous'));
  console.log(splitSentence('jepenserestersurparisouprendreletgvpourmarseille'));

  // faire 10h de train avec la SNCF
  // je m'appelle Mathilde et vous
  // mon nom est Thomas
  // ou partez-vous en vacances
  // j'hésite entre Nancy et Alençon et vous
  // je pense rester sur Paris ou prendre le TGV pour Marseille
};

main();
```

## Acknowledgement
Algorithm from https://stackoverflow.com/questions/8870261/how-to-split-text-without-spaces-into-list-of-words.
List of words created from Wikipedia French articles.
