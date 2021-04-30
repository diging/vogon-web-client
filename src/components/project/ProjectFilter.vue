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
				v-switch(
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

@Component({ name: 'ProjectFilter' })
export default class ProjectFilter extends Vue {
	@Prop() private onApply!: (query: string, field: string, showUserProjects: boolean) => void;

	private query: string = '';
	private field: string = 'name';
	private showUserProjects: boolean = true;
	private fieldChoices: any[] = [
		{ text: 'Title', value: 'name' },
		{ text: 'Owner', value: 'owner' },
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
}
</script>

<style scoped>
.show-project-switch {
	margin-top: 4px;
}
</style>