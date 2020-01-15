<template lang="pug">
	div(class="container")
		h4(class="subtitle-1") Filters
		v-row
			v-col(md="6")
				v-select(
					v-model="filter.createdBy"
					label="Created by"
					:items="users"
					outlined dense
					item-text="username"
					item-value="username"
					clearable
				)
			v-col(md="6")
				v-text-field(v-model="filter.occursIn" label="Text (URI)" outlined dense clearable)
			v-col(md="6")
				v-menu(
					ref="menuCreatedAfter"
					v-model="menuCreatedAfter"
					:close-on-content-click="false"
					:return-value.sync="filter.created_after"
					transition="scale-transition"
					offset-y
					min-width="290px"
				)
					template(v-slot:activator="{ on }")
						v-text-field(
							v-model="filter.created_after"
							label="Created after"
							prepend-inner-icon="event"
							readonly
							v-on="on"
							outlined
							dense
							clearable
						)
					v-date-picker(v-model="filter.created_after" no-title scrollable)
						v-spacer
						v-btn(text color="primary" @click="menuCreatedAfter = false") Cancel
						v-btn(text color="primary" @click="$refs.menuCreatedAfter.save(filter.created_after)") OK
			v-col(md="6")
				v-menu(
					ref="menuCreatedBefore"
					v-model="menuCreatedBefore"
					:close-on-content-click="false"
					:return-value.sync="filter.created_before"
					transition="scale-transition"
					offset-y
					min-width="290px"
				)
					template(v-slot:activator="{ on }")
						v-text-field(
							v-model="filter.created_before"
							label="Created before"
							prepend-inner-icon="event"
							readonly
							v-on="on"
							outlined
							dense
							clearable
						)
					v-date-picker(v-model="filter.created_before" no-title scrollable)
						v-spacer
						v-btn(text color="primary" @click="menuCreatedBefore = false") Cancel
						v-btn(text color="primary" @click="$refs.menuCreatedBefore.save(filter.created_before)") OK

			v-col(md="6")
				v-text-field(v-model="filter.terminal_nodes" label="Concept (URI)" outlined dense clearable)
			v-col(md="6")
				v-select(
					v-model="filter.project"
					label="Project"
					:items="projects"
					outlined dense
					item-text="name"
					item-value="id"
					clearable
				)
			
			v-col(md="6")
				v-btn(depressed color="primary" @click="onApply") Apply
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { User } from '@/interfaces/GlobalTypes';
import { Project } from '@/interfaces/ProjectTypes';
import { RelationFilterParams } from '@/interfaces/RelationTypes';

@Component({ name: 'AnnotationFilter' })
export default class AnnotationFilter extends Vue {
	@Prop() private filter!: RelationFilterParams;
	@Prop() private onApply!: () => void;
	@Prop() private projects!: Project[];
	@Prop() private users!: User[];

	private menuCreatedAfter: boolean = false;
	private menuCreatedBefore: boolean = false;
}
</script>

<style scoped>

</style>