<template lang="pug">
	div(class="main")
		ErrorIndicator(v-if="error") Error while loading user dashboard!
		template(v-else)
			Loading(v-if="loading")
			template(v-else)
				h2(class="display-1") Welcome back, {{ data.user.full_name }}
				br
				v-row
					v-col(cols=4)
						v-card(outlined class="user-dashboard")
							h3 Recently Annotated
							v-list
								template(v-for="(text, index) in data.recent_texts")
									v-list-item(
										:key="text.id"
										v-bind:href="`/repository/${text.repository_id}/text/${text.repository_source_id}`"
									)
										v-list-item-content
											v-list-item-title(v-text="text.title")
									v-divider(v-if="index + 1 < data.recent_texts.length" :key="index")
					v-col(cols=4)
						v-card(outlined class="user-dashboard")
							h3 Recent Added
							v-list
								template(v-for="(text, index) in data.added_texts")
									v-list-item(
										:key="text.id"
										v-bind:href="`/repository/${text.repository_id}/text/${text.repository_source_id}`"
									)
										v-list-item-content
											v-list-item-title(v-text="text.title")
									v-divider(v-if="index + 1 < data.added_texts.length" :key="index")
					v-col(cols=4)
						v-card(outlined class="user-dashboard")
							h3 My Projects
							v-list
								template(v-for="(project, index) in data.projects")
									v-list-item(:key="project.id" v-bind:href="`/project/${project.id}`")
										v-list-item-content
											v-list-item-title(v-text="project.name")
											v-list-item-subtitle(v-text="project.description")
									v-divider(v-if="index + 1 < data.projects.length" :key="index")
							v-card-actions
								v-spacer
								v-btn(text href="/project") View all
				br
				h2 My recent Annotations
				br
				v-card(outlined class="user-dashboard")
					v-list
						template(v-for="(relation, index) in data.relations")
							AnnotationItem(:key="relation.id" v-bind:annotation="relation")
							v-divider(v-if="index + 1 < data.relations.length" :key="index")
							

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import AnnotationItem from '@/components/relations/AnnotationItem.vue';
import { UserDashboard } from '@/interfaces/DashboardTypes';

@Component({
	name: 'Dashboard',
	components: {
		AnnotationItem,
		ErrorIndicator,
		EmptyView,
		Loading,
	},
})
export default class Dashboard extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private data: UserDashboard = {};

	public async mounted(): Promise<void> {
		Vue.$axios.get('/dashboard')
			.then((response: AxiosResponse) => {
				this.data = response.data;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.user-dashboard {
	padding: 20px;
	height: 100%;
}
</style>