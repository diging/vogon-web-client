<template>
  <div class="home">
    <Main />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Main from '@/components/home/Main.vue'; // @ is an alias to /src

export default Vue.extend({
  name: 'home',
  components: {
    Main,
  },
});
</script>
