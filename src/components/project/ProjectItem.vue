<template lang="pug">
	v-list-item(:to="`/project/${project.id}`" class="project-card")
		v-list-item-content
			div(class="title font-weight-regular") {{project.name}}
			
			div(class="text--primary") {{project.description}}
			span
				| Created by 
				strong "{{project.ownedBy.username}}"
				| &nbsp;on {{moment(project.created).format('lll')}}
			div(class="teal--text") 
				strong {{project.num_texts}} texts, {{project.num_relations}} relations
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Project } from '@/interfaces/ProjectTypes';

@Component({
	name: 'ProjectItem',
})
export default class ProjectItem extends Vue {
	@Prop() private readonly project!: Project;
}
</script>

<style scoped>
.project-card {
	padding: 0 20px;
}
</style>