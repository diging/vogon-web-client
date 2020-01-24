<template lang="pug">
	v-card(tile outlined class="container")
		div(class="text-details")
			h3(class="headline") Serial Content
			| The following content are serialized parts of this resource, such as individuated pages. Multiple content types may be available.
		template(v-if="!contents.length")
			EmptyView No contents found!
		v-list(v-else two-line)
			template(v-for="(content, index) in contents")
				v-list-item(:key="content.content_type")
					v-list-item-content
						v-list-item-title(class="font-weight-medium" v-text="content.content_type")
						div
							template(v-for="(resource, i) in content.resources")
								v-btn(
									class="ma-2" color="primary" fab :key="resource.id" x-small elevation=0 
									:href="`/repository/${$route.params.repoId}/text/${$route.params.textId}/content/${resource.id}${queryParam}?part_of=${$route.params.textId}`"
								) {{ i+1 }}
				v-divider(v-if="index + 1 < contents.length" :key="index")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import { TextAggregatedContent } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'TextSerialContent',
	components: { EmptyView },
})
export default class TextSerialContent extends Vue {
	@Prop() private readonly contents!: TextAggregatedContent[];
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
.container {
	margin-bottom: 20px;
}
.text-details {
	padding: 10px;
	margin-bottom: 0;
}
</style>