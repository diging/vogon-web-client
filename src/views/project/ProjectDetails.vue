<template lang="pug">
	div(class="main")
		h2(class="display-1") Project Details
		br
		ErrorIndicator(v-if="error") Error while loading project details!
		div(v-else)
			Loading(v-if="loading")
			v-card(v-else tile outlined class="project-details")
				v-row
					v-col(md="6")
						h3(class="headline") {{ project.name }}
						h4(class="subtitle-1") {{ project.description }}
						span(class="overline") Created by "user" on {{moment(project.created).format('lll')}}
					v-col(md="6")
						div(class="float-right")
							CreateUpdateProject(update :project="Object.assign({}, project)" v-bind:getProjectDetails="getProjectDetails")
							v-btn(tile depressed color="teal" large class="ma-2" dark)
								v-icon(left) mdi-plus
								span Add text
			br
			v-card(class="card-project-text")
				v-card-title Texts
				template(v-if="!project.texts.length")
					EmptyView No texts found! Perhaps, add one?
				template(v-else)
					v-data-table(:headers="textHeaders" :items="project.texts")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import CreateUpdateProject from '@/components/project/CreateUpdateProject.vue';
import { Project } from '@/interfaces/ProjectTypes';

@Component({
	name: 'ProjectDetails',
	components: {
		CreateUpdateProject,
		EmptyView,
		ErrorIndicator,
		Loading,
	},
})
export default class ProjectDetails extends Vue {
	private project: Project = { name: ''};
	private loading: boolean = true;
	private error: boolean = false;
	private textHeaders = [{text: 'Title', value: 'title'}, {text: 'Added', value: 'added'}];

	public async mounted(): Promise<void> {
		this.getProjectDetails();
	}

	private getProjectDetails() {
		Vue.$axios.get(`/project/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.project = response.data as Project;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.project-details {
	padding: 20px;
}
.card-project-text {
	padding: 20px 0;
}
</style>