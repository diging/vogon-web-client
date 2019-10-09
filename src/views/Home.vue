<template>
  <div class="home">
    <Main />
  </div>
</template>

<script lang="ts">
import Main from '@/components/home/Main.vue'; // @ is an alias to /src
import Vue from 'vue';

export default Vue.extend({
  name: 'home',
  components: {
	Main,
  },
});
</script>
