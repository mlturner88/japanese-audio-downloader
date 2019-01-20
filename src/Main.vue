<script>
const { ipcRenderer } = require('electron');
const DownloadStatus = require('./DownloadStatus.vue');

export default {
  name: 'JapaneseAudioDownloader',
  components: { DownloadStatus },
  data() {
    return {
      word: null
    };
  },
  methods: {
    search() {
      if (this.word) {
        if (this.$refs.status) {
          this.$refs.status.searchStart();
        }

        ipcRenderer.send('download-audio', this.word);
        this.word = null;
      }
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="columns is-mobile">
      <div class="column">
        <div class="control">
          <input
            v-model.trim="word"
            class="input"
            type="text"
            placeholder="word (e.g. 了解)"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="column is-narrow">
        <div class="control">
          <a class="button is-primary" :disabled="!word" @click="search"
            >Search</a
          >
        </div>
      </div>
    </div>
    <download-status ref="status" />
  </div>
</template>

<style>
@import '~roboto-fontface/css/roboto/roboto-fontface.css';

body {
  font-family: 'Roboto', sans-serif;
}
</style>
