<template>
  <div class="main">
    <ProjectList />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectList from '@/components/project/ProjectList.vue';

export default Vue.extend({
  name: 'project',
  components: {
    ProjectList,
  },
});
</script>

<style scoped>
.main {
  text-align: left;
}
</style>