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
			<template v-if="!isAdminUser()">
				v-switch(
					v-model="showUserProjects"
					label="Show only my projects"
					class="show-project-switch"
					inset
					hide-details="auto"
					dense
					flat
				)
			v-else 
				v-btn(text v-on="on" v-if="loggedIn") Project Filter
					v-icon mdi-menu-down

			</template>
		v-btn(depressed color="primary" @click="applyFilter") Apply
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getUserId } from '@/utils';
import { AxiosResponse } from 'axios';

@Component({ name: 'ProjectFilter' })
export default class ProjectFilter extends Vue {
	@Prop() private onApply!: (query: string, field: string, showUserProjects: boolean) => void;

	private query: string = '';
	private field: string = 'name';
	private showUserProjects: boolean = true;
	private isAdmin: boolean = false;
	private fieldChoices: any[] = [
		{ text: 'Title', value: 'name' },
		{ text: 'Owner', value: 'owner' },
	];
	private dataItems: object[] = [
		{ title: 'my projects', value: 'my projects' },
		{ title: 'shared projects', link: 'shared projects' },
		{ title: 'all projects', link: 'all projects' },
	];

	@Watch('field')
	private onFieldChange(val: string, oldVal: string) {
		if (val !== oldVal && val === 'owner') {
			this.showUserProjects = false;
		}
	}

	private applyFilter() {
		this.onApply(this.query, this.field, this.showUserProjects);
	}

	private isAdminUser() {
		const userId = getUserId();
		Vue.$axios.get(`/users/${userId}`)
			.then((response: AxiosResponse) => {
				this.isAdmin = response.data.is_admin;
			});
		return this.isAdmin;
	}
}
</script>

<style scoped>
.show-project-switch {
	margin-top: 4px;
}
</style>