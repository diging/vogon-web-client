<template>
  <div class="main">
    <ProjectDetails />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectDetails from '@/components/project/ProjectDetails.vue';

export default Vue.extend({
  name: 'project',
  components: {
    ProjectDetails,
  },
});
</script>

<style scoped>
.main {
  text-align: left;
}
</style>