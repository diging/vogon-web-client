<template lang="pug">
	div(class="main")
		h2(class="display-1") Collection details
		br
		ErrorIndicator(v-if="error") Error while loading collection details!
		div(v-else)
			Loading(v-if="loading")
			div(v-else)
				Breadcrumbs(:items="navItems" class="mt-2")
				h3(class="title font-weight-regular") Browsing colleciton "{{ collection.name }}"
				br
				v-card(tile outlined class="col-details")
					v-card-title Text resources
					template(v-if="!collection.resources.length")
						EmptyView No text resources found!
					TextResources(v-else v-bind:resources="collection.resources" v-bind:repoId="$route.params.repoId" v-bind:queryParam="queryParam")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import Breadcrumbs from '@/components/global/Breadcrumbs.vue';
import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import TextResources from '@/components/texts/amphora/TextResources.vue';
import { TextCollection } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'CollectionDetails',
	components: {
		Breadcrumbs,
		Loading,
		EmptyView,
		ErrorIndicator,
		TextResources,
	},
})
export default class CollectionDetails extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private collection: TextCollection = {id: 1, name: ''};
	private queryParam: string = '';
	private navItems = [
		{ text: 'Projects', to: '/project', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
		{ text: 'Repositories', to: '/repository', link: true, exact: true },
		{ text: '', to: '', link: true, exact: true },
		{ text: 'Collections', link: false },
		{ text: '', link: false },
	];

	public async mounted(): Promise<void> {
		const projectId = this.$route.query.project_id;
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`;
			this.navItems[2].to = `${this.navItems[2].to}${this.queryParam}`;
		}

		Vue.$axios.get(`/repository/amphora/${this.$route.params.repoId}/collections/${this.$route.params.colId}?project_id=${projectId}`)
			.then((response: AxiosResponse) => {
				console.log(response.data);
				this.collection = response.data as TextCollection;

				const project = response.data.project;
				const repo = response.data.repository;
				this.navItems[1].text = project.name;
				this.navItems[1].to = `/project/${project.id}`;
				this.navItems[3].text = repo.name;
				this.navItems[3].to = `/repository/amphora/${repo.id}${this.queryParam}`;
				this.navItems[5].text = this.collection.name;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.col-details {
	padding: 0;
}
</style>