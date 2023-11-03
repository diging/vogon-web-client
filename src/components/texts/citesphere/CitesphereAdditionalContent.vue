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
        template(v-for="content in contents")
            v-list-item(:key="content.id")
                v-list-item-content
                    v-list-item-title(class="font-weight-medium" v-text="content.filename")
                    v-list-item-subtitle(v-text="content['content-type']")
                v-list-item-action
                    v-btn(
                        :disabled="!ready || !editable"
                        depressed color="primary" small
                        :to="`/repository/citesphere/${$route.params.repoId}/groups/${$route.params.groupId}/items/${$route.params.itemId}/file/${content.id}${queryParam}&content_type=${content['content-type']}`"
                    )
                        v-icon(left small) mdi-tag 
                        | Annotate
            v-divider(v-if="content.id + 1 < contents.length" :key="content.id")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';

@Component({
	name: 'CitesphereAdditionalContent',
	components: { EmptyView },
})
export default class CitesphereAdditionalContent extends Vue {
	@Prop() private readonly contents!:any
	@Prop() private readonly ready!: boolean
	@Prop() private readonly editable!: boolean
	@Prop() private readonly data!: any
	private queryParam = ''

	public created() {
		const projectId = this.$route.query.project_id
		if (projectId) {
			this.queryParam = `?project_id=${projectId}`
		}
	}
}
</script>

<style scoped>
.text-details {
	padding: 20px;
}
</style>