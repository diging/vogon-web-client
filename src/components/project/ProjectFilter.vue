<template lang="pug">
	div(class="container")
		h4(class="subtitle-1") Search Projects
		v-row(class="mt-1")
			v-col(md="6")
				v-text-field(
					v-model="query" 
					label="Search..." 
					@keyup.enter.native="applyFilter"
					outlined dense clearable
				)
			v-col(md="3")
				v-select(
					label="Field"
					v-model="field"
					:items="fieldChoices"
					outlined
					dense
				)
			v-col(md="3")
			
				v-select(
					v-if ="isAdminUser()"
					label="Projects"
					v-model="projects"
					:items="dataItems"
					outlined
					dense
				)
				v-switch(
					v-else 
					v-model="showUserProjects"
					label="Show only my projects"
					class="show-project-switch"
					inset
					hide-details="auto"
					dense
					flat
				)
		v-btn(depressed color="primary" @click="applyFilter") Apply
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getUserId } from '@/utils';
import { AxiosResponse } from 'axios';

@Component({ name: 'ProjectFilter' })
export default class ProjectFilter extends Vue {
	@Prop() private onApply!: (query: string, field: string, showUserProjects?: boolean, projects?: string, projectQuery?: string) => void;
	private query: string = '';
	private field: string = 'name';
	private showUserProjects: boolean = true;
	private isAdmin: boolean = false;
	private projects: string = 'name';
	private projectQuery = '';
	private fieldChoices: any[] = [
		{ text: 'Title', value: 'name' },
		{ text: 'Owner', value: 'owner' },
	];
	private dataItems: any[] = [
		{ text: 'Title', value: 'name' },
		{ text: 'My projects', value: 'my projects' },
		{ text: 'Shared projects', value: 'shared projects' },
		{ text: 'All projects', value: 'all projects' },
	];

	@Watch('field')
	private onFieldChange(val: string, oldVal: string) {
		if (val !== oldVal && val === 'owner') {
			this.showUserProjects = false;
		}
	}

	@Watch('projects')
	private onChooseProjectsChange(val: string, oldVal: string) {
		if (val !== oldVal && val == 'my projects') {
			this.projectQuery = "my projects";
		}
		else if (val !== oldVal && val == 'shared projects') {
			this.projectQuery = "shared projects";
		}
		else if (val !== oldVal && val == 'all projects'){
			this.projectQuery = "all projects";
		}
	}

	private applyFilter() {
		if (this.isAdmin) {
			this.onApply(this.query, this.field, this.showUserProjects, this.projects, this.projectQuery);
		}
		else {
			this.onApply(this.query, this.field, this.showUserProjects);
		}
	}

	private isAdminUser() {
		console.log("entered in admin user")
		const userId = getUserId();
		Vue.$axios.get(`/users/${userId}`)
			.then((response: AxiosResponse) => {
				this.isAdmin = response.data.is_admin;
			});
		console.log("check admin", this.isAdmin);
		return this.isAdmin;
	}
}
</script>

<style scoped>
.show-project-switch {
	margin-top: 4px;
}
</style>