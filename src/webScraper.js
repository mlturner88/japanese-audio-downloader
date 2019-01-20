const request = require('request-promise-native');
const cheerio = require('cheerio');

const baseUrl = 'https://jisho.org/word/';

async function findAudioUrl(word) {
  const encodedWord = encodeURIComponent(word);

  try {
    const $ = await request({
      url: baseUrl + encodedWord,
      transform: body => cheerio.load(body)
    });

    const audioElement = $('audio > source[type="audio/mpeg"]');

    if (audioElement && audioElement.length > 0) {
      const url = audioElement.attr('src');

      if (!url) {
        throw `Cannot find download for 「${word}」`;
      }

      return url.startsWith('//') ? 'https:' + url : url;
    }
  } catch (e) {
    // word was not found on Jisho
  }

  return `https://www.japandict.com/voice/read?text=${encodedWord}&outputFormat=mp3`;
}

module.exports = {
  findAudioUrl
};
