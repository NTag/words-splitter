# Words Splitter

Split a French sentence without any spaces nor accents, into words.

## Installation
```
npm i words-splitter
```

## Usage

```js
const { splitSentence, loadDictionnary } = require('words-splitter');

const main = async () => {
  await loadDictionnary(); // Take a few seconds to load all French words with their probability

  console.log(splitSentence('commentallezvous'));
  console.log(splitSentence('jemappellemathildeetvous'));
  console.log(splitSentence('monnomestthomas'));
  console.log(splitSentence('oupartezvousenvacances'));
  console.log(splitSentence('jhesiteentrenancyetalenconetvous'));
  console.log(splitSentence('jepenserestersurparisouprendreletgvpourmarseille'));

  // Comment allez-vous
  // Je m'appelle Mathilde et vous
  // mon nom est Thomas
  // ou partez-vous en vacances
  // J'hésite entre Nancy et Alençon et vous
  // Je pense rester sur Paris ou prendre le TGV pour Marseille
};

main();
```

## Acknowledg
Algorithm from https://stackoverflow.com/questions/8870261/how-to-split-text-without-spaces-into-list-of-words.
List of words created from OpenSubtitle French 2016 database.
