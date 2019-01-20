require('colors');

// const argv = require('minimist')(process.argv.slice(2));
const parseArgs = require('minimist');
const argv = parseArgs(process.argv.slice(2), {
  boolean: 'verbose',
  alias: {
    verbose: 'v',
    folder: ['f', 'd']
  }
});

const inputWords = argv._;
const verbose = createVerboseLogger(argv.verbose);

if (!inputWords || !inputWords.length) {
  // no input received
  console.error('No words received!\n'.underline.red);
  console.info('Include space separated list of words.'.bgWhite.black);
  process.exit(1);
}

const { findAudioUrl } = require('./webScraper');
const request = require('request');
const fs = require('fs');
const path = require('path');

// if downloads folder given then use that
// otherwise determine the OS downloads folder for user
const downloadsPath = !argv.folder
  ? require('downloads-folder')()
  : argv.folder;

verbose.log('Using download path:', downloadsPath.bgBlack.green);

const wordUrls = {};
const wordPromises = inputWords.map(async word => {
  try {
    const url = await findAudioUrl(word);
    verbose.log('Found download URL for', word.bgBlack.cyan);
    verbose.log('-', url.underline);
    wordUrls[word] = url;
  } catch (e) {
    console.error(e.message.underline.red);
  }
});

Promise.all(wordPromises).then(() => {
  Object.entries(wordUrls).forEach(([word, url]) => {
    const savePath = path.join(downloadsPath, word + '.mp3');
    console.log(`Attempting to save file: ${savePath}`.bgBlack.green);
    request(url)
      .on('error', error => {
        console.log(`Error code: ${error.code} -- ${url}`.underline.red);
      })
      .pipe(fs.createWriteStream(savePath));
  });
});

function createVerboseLogger(isVerbose) {
  return {
    log: !isVerbose ? () => undefined : (...args) => console.log(...args)
  };
}
