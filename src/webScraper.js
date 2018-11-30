const axios = require('axios');
const cheerio = require('cheerio');

const client = axios.create({
  baseURL: 'https://jisho.org/word/'
});

async function findAudioUrl(word) {
  const response = await client.get(encodeURIComponent(word));
  const $ = cheerio.load(response.data);
  const audioElement = $('audio > source[type="audio/mpeg"]');

  if (audioElement && audioElement.length > 0) {
    const url = audioElement.attr('src');

    if (!url) {
      throw `Cannot find download for 「${word}」.`;
    }

    return url.startsWith('//') ? 'https:' + url : url;
  } else {
    throw `「${word}」 could not be found`;
  }
}

module.exports = {
  findAudioUrl
};
