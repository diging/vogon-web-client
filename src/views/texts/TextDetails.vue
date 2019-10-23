<template lang="pug">
	div(class="main")
		br
		ErrorIndicator(v-if="error") Error while loading text details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(tile outlined class="text-details")
					v-row
						v-col(cols="6")
							h3(class="headline") Resource "{{ text.title }}"
							v-list-item-subtitle(class="text--primary" v-text="text.uri")
						v-col(cols="6")
							div(v-if="project" class="float-right")
								v-alert(type="success" text dense) Already part of project "{{ project }}"
							div(v-else-if="$route.query.project_id" class="float-right")
								v-btn(color="primary" @click="addText")
									v-icon(left) mdi-plus
									| Add to project
				p(class="body-1")
					| The following content objects are associated with this resource. 
					| Select a content object to begin annotating that object in VogonWeb. 
				TextSerialContent(v-bind:contents="text.aggregate_content")
				TextAdditionalContent(v-bind:contents="text.content")

		v-snackbar(v-model="snackbar" top)
			| {{ snackbarText }}
			v-btn(color="red" text @click="snackbar = false") Close
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import TextAdditionalContent from '@/components/texts/TextAdditionalContent.vue';
import TextSerialContent from '@/components/texts/TextSerialContent.vue';
import { TextResource } from '@/models';

@Component({
	name: 'TextDetails',
	components: {
		Loading,
		ErrorIndicator,
		TextSerialContent,
		TextAdditionalContent,
	},
})
export default class TextDetails extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private project: string = '';
	private text: TextResource = {id: 1, title: ''};

	private snackbarText: string = '';
	private snackbar: boolean = false;

	public async mounted(): Promise<void> {
		this.getTextDetails();
	}

	private async getTextDetails(): Promise<void> {
		let queryParam = '';
		const projectId = this.$route.query.project_id;
		if (projectId) {
			queryParam = `?project_id=${projectId}`;
		}

		Vue.$axios.get(`/repository/${this.$route.params.repoId}/texts/${this.$route.params.textId}${queryParam}`)
			.then((response: AxiosResponse) => {
				this.text = response.data.result as TextResource;
				this.project = response.data.part_of_project && response.data.part_of_project.name;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}

	private async addText(): Promise<void> {
		Vue.$axios.post(`/project/${this.$route.query.project_id}/add_text`,
				{ text_id: this.text.id, repository_id: this.$route.params.repoId },
			)
			.then((response: AxiosResponse) => {
				this.getTextDetails();
			})
			.catch(() => {
				this.snackbar = true;
				this.snackbarText = 'Error while adding text to the project';
			});
	}
}
</script>

<style scoped>
.text-details {
	padding: 20px;
	margin-bottom: 20px;
}
</style>