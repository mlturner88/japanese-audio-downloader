const argumentsObject = {
  '<word1> <word2> ...':
    'Space separated list of Japanese words to download audio for.',
  '--folder': 'Specify download folder for audio files (aliases: -f -d)',
  '--help': 'Prints out this help. (aliases: -h -?)',
  '--verbose': 'Prints out verbose messages. (alias: -v)'
};

const help = [
  'Japanese Audio Downloader'.underline.bold,
  '',
  'This CLI allows you to download the audio files for Japanese words.',
  '',
  'Arguments'.underline,
  ...prettyPrintArguments(),
  '',
  'Current websites words are searched for:',
  'https://www.jisho.org'.underline,
  'https://www.japandict.com'.underline,
  '',
  'Warning:'.underline.bgYellow.black,
  'Japanese spacing character will treat all words as the same string as it is not the same as the whitespace for an English keyboard.',
  ''
];

function createVerboseLogger(isVerbose) {
  return {
    log: !isVerbose ? () => undefined : (...args) => console.log(...args)
  };
}

module.exports = {
  printHelp() {
    help.forEach(line => {
      console.info(line);
    });
  },
  createVerboseLogger
};

function prettyPrintArguments() {
  const lines = Object.entries(argumentsObject);
  const length = lines[0][0].length;
  return lines.map(([arg, desc]) => `${padRight(arg, length)}   ${desc}`);
}

function padRight(str, length) {
  let pad = '';

  for (let i = 0; i < length; i++) {
    pad += ' ';
  }

  return (str + pad).substring(0, length);
}
