<script>
const { ipcRenderer } = require('electron');
const cheerio = require('cheerio');

export default {
  name: 'DownloadStatus',

  data() {
    return {
      searching: false,
      downloading: false,
      completed: false,
      error: null,
      progress: 0
    };
  },

  mounted() {
    const onStart = () => {
      this.downloading = true;
    };

    const reportProgress = (event, progress) => {
      this.progress = progress * 100;
    };

    const onComplete = (event, { filename }) => {
      this.progress = 0;
      this.searching = false;
      this.downloading = false;
      this.completed = filename;
    };

    const onError = (event, error) => {
      this.searching = false;
      this.downloading = false;
      this.completed = false;
      this.progress = 0;
      
      if (!error) {
        this.error = 'There was a problem downloading the audio.';
      } else if (error.response) {
        const jishoError = cheerio.load(error.response.data)('h1').text();
        this.error = !jishoError ?
          `${error.response.status}: ${error.response.statusText}` :
          `From Jisho: ${jishoError}`;
      } else {
        this.error = error;
      }
    };

    ipcRenderer.on('download-start', onStart);
    ipcRenderer.on('download-progress', onStart);
    ipcRenderer.on('download-success', onComplete);
    ipcRenderer.on('download-error', onError);

    this.$once('hook:beforeDestroy', function() {
      ipcRenderer.removeListener('download-start', onStart);
      ipcRenderer.removeListener('download-progress', reportProgress);
      ipcRenderer.removeListener('download-success', onComplete);
      ipcRenderer.removeListener('download-error', onError);
    });
  },

  methods: {
    searchStart() {
      this.searching = true;
      this.completed = false;
      this.error = null;
    }
  }
}
</script>

<template>
  <div class="columns is-centered">
    <div v-if="searching" class="column is-narrow">
      <div class="notification is-info">Searching...</div>
    </div>
    <div v-if="downloading" class="column is-half">
      <progress class="progress is-small is-primary" :value="progress" max="100"></progress>
    </div>
    <div v-else-if="completed" class="column is-narrow">
      <div class="notification is-success">
        <div class="content">
          <p>Download complete.</p>
          <p class="filename">{{completed}}</p>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="column is-narrow">
      <div class="notification is-danger">{{error}}</div>
    </div>
  </div>
</template>

<style scoped>
.filename {
  font-family: monospace;
}
</style>
