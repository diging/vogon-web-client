<template>
  <div class="main">
    <Main />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Main from '@/components/project/Main.vue';

export default Vue.extend({
  name: 'project',
  components: {
    Main,
  },
});
</script>

<style scoped>
.main {
  text-align: left;
}
</style>