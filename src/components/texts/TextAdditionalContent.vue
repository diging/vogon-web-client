<template lang="pug">
	v-card(tile outlined)
		div(class="text-details")
			h3(class="headline") Additional Content
			| The following content represent the resource as a whole. This
			| may include complex objects like PDF documents, whole-text 
			| OCR documents, or other files.
			br
		template(v-if="!contents.length")
			EmptyView No contents found!
		v-list(v-else two-line)
			template(v-for="(content, index) in contents")
				v-list-item(:key="content.content_type")
					v-list-item-content
						v-list-item-title(class="font-weight-medium" v-text="content.name")
						v-list-item-subtitle(v-text="content.content_type")
					v-list-item-action
						v-btn(
							depressed color="primary" small
							:href="`/repository/${$route.params.repoId}/text/${$route.params.textId}/content/${content.id}${queryParam}`"
						)
							v-icon(left small) mdi-tag 
							| Annotate
				v-divider(v-if="index + 1 < contents.length" :key="index")
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import { TextContentResource } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'TextAdditionalContent',
	components: { EmptyView },
})
export default class TextAdditionalContent extends Vue {
	@Prop() private readonly contents!: TextContentResource[];
	private queryParam = '';

	public created() {
		const projectId = this.$route.query.project_id;
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`;
		}
	}
}
</script>

<style scoped>
.text-details {
	padding: 20px;
}
</style>