<template lang="pug">
	div(class="main")
		br
		ErrorIndicator(v-if="error") {{ errorMsg }}
		div(v-else)
			Loading(v-if="loading")
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';

@Component({
	name: 'TextContent',
	components: {
		ErrorIndicator,
		Loading,
	},
})
export default class TextContent extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private errorMsg: string = '';

	public created() {
		const repoId = this.$route.params.repoId;
		const textId = this.$route.params.textId;
		const contentId = this.$route.params.contentId;

		const projectId = this.$route.query.project_id;
		const partOf = this.$route.query.part_of;
		let queryParam = '?';
		if (projectId) {
			queryParam += `project_id=${projectId}&`;
		}
		if (partOf) {
			queryParam += `part_of=${partOf}`;
		}

		Vue.$axios.get(`/repository/${repoId}/texts/${textId}/content/${contentId}${queryParam}`)
			.then((response: AxiosResponse) => {
				if (response.data.success) {
					let queryParamRedirect = '';
					if (response.data.project_id) {
						queryParamRedirect = `?project_id=${response.data.project_id}`;
					}
					this.$router.push(`/annotate/${response.data.text_id}${queryParamRedirect}`);
				} else {
					this.error = true;
					this.errorMsg = `${response.data.error}: "${response.data.content_type}",
					Resource: "${response.data.resource.title}" in repository "${response.data.repository.name}"`;
				}
			})
			.catch((error: AxiosError) => {
				this.error = true;
				if (error.response && error.response.data && error.response.data.error) {
					this.errorMsg = error.response.data.error;
				} else {
					this.errorMsg = error.message;
				}
			})
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>

</style>