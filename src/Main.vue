<script>
export default {
  name: 'JapaneseAudioDownloader',
  data() {
    return {
      word: null
    };
  }
};
</script>

<template>
  <section>
    <div class="container">
      <div class="columns">
        <div class="column">
          <input v-model.trim="word" autofocus class="input" type="text" />
        </div>
        <div class="column is-narrow">
          <button type="button">Search</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
@import '~roboto-fontface/css/roboto/roboto-fontface.css';
@import '~bulma/css/bulma.css';

body {
  font-family: 'Roboto', sans-serif;
}
</style>
