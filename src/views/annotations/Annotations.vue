<template lang="pug">
div(class="main")
	h2(class="display-1") Annotations
	br
	v-card(class="card-annotations")
		AnnotationFilter(
			:filter="filters"
			:onApply="() => { page = 1; getAnnotations()}"
			:projects="projects"
			:users="users"
		)
		ErrorIndicator(v-if="error") Error while loading annotations!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				template(v-if="!annotations.length")
					EmptyView No annotations found!
				template(v-else)
					AnnotationList(v-bind:annotations="annotations")
					v-pagination(
						v-model="page"
						:length="Math.ceil(annotationsCount / PAGE_SIZE)"
						v-on:input="getAnnotations"
					)
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import AnnotationFilter from '@/components/relations/AnnotationFilter.vue';
import AnnotationList from '@/components/relations/AnnotationList.vue';
import { PAGE_SIZE } from '@/constants';
import { User } from '@/interfaces/GlobalTypes';
import { Project } from '@/interfaces/ProjectTypes';
import { RelationFilterParams, RelationSet } from '@/interfaces/RelationTypes';

@Component({
	name: 'Annotations',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
		AnnotationList,
		AnnotationFilter,
	},
})
export default class Annotations extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private annotations: RelationSet[] = [];
	private annotationsCount: number = 0;

	private page: number = 1;
	private PAGE_SIZE: number = PAGE_SIZE;

	private filters: RelationFilterParams = {
		meta: true,
		limit: PAGE_SIZE,
		offset: 0,
	};
	private projects: Project[] = [];
	private users: User[] = [];

	public async mounted(): Promise<void> {
		const createdBy = this.$route.query.createdBy;
		const occursIn = this.$route.query.occursIn;
		const terminalNodes = this.$route.query.terminal_nodes;
		if (createdBy) {
			this.filters.createdBy = createdBy.toString();
		}
		if (occursIn) {
			this.filters.occursIn = occursIn.toString();
		}
		if (terminalNodes) {
			this.filters.terminal_nodes = terminalNodes.toString();
		}
		this.getAnnotations();
	}

	private getFilter(page: number): RelationFilterParams {
		// Build filter params
		const params: RelationFilterParams = {};
		params.meta = this.filters.meta;
		params.limit = this.filters.limit;
		params.offset = (page - 1) * PAGE_SIZE;

		params.createdBy = this.filters.createdBy;
		if (this.filters.created_after) {
			params.created_after = moment(this.filters.created_after).format('YYYY-MM-DD HH:mm');
		}
		if (this.filters.created_before) {
			// Add 1 day - if `created_before` = 2019-11-15,
			// it becomes 2019-11-15 00:00, adding 1 day
			// will become 2019-11-16 00:00, includes all documents
			// before 2019-11-15 23:59
			params.created_before = moment(this.filters.created_before)
				.add(1, 'days').format('YYYY-MM-DD HH:mm');
		}
		params.terminal_nodes = this.filters.terminal_nodes;
		params.project = this.filters.project;
		params.occursIn = this.filters.occursIn;

		return params;
	}

	private async getAnnotations(page: number = 1): Promise<void> {
		this.loading = true;
		const params: RelationFilterParams = this.getFilter(page);
		Vue.$axios.get('/relationset', { params })
			.then((response: AxiosResponse) => {
				this.annotations = response.data.results;
				this.annotationsCount = response.data.count;
				this.projects = response.data.projects;
				this.users = response.data.users;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.card-annotations {
	padding: 20px 0;
}
</style>
