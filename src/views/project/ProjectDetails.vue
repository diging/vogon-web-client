<template>
	<div class="main">
		<ProjectDetails />
	</div>
</template>

<script lang="ts">
import ProjectDetails from '@/components/project/ProjectDetails.vue';
import Vue from 'vue';

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