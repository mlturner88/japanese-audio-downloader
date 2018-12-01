const axios = require('axios');
const cheerio = require('cheerio');

const client = axios.create({
  baseURL: 'https://jisho.org/word/'
});

async function findAudioUrl(word) {
  const encodedWord = encodeURIComponent(word);
  const response = await client.get(encodedWord);
  const $ = cheerio.load(response.data);
  const audioElement = $('audio > source[type="audio/mpeg"]');

  if (audioElement && audioElement.length > 0) {
    const url = audioElement.attr('src');

    if (!url) {
      throw `Cannot find download for 「${word}」`;
    }

    return url.startsWith('//') ? 'https:' + url : url;
  } else {
    return `https://www.japandict.com/voice/read?text=${encodedWord}&outputFormat=mp3`;
  }
}

module.exports = {
  findAudioUrl
};
