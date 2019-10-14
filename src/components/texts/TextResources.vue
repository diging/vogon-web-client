<template lang="pug">
	v-list(two-line)
		template(v-for="(resource, index) in resources")
			v-list-item(:key="resource.id" v-bind:href="`/repository/${repoId}/text/${resource.id}`")
				v-list-item-content
					v-list-item-title(class="font-weight-medium" v-text="resource.title")
					v-list-item-subtitle(class="text--primary" v-text="resource.uri")
				v-list-item-action
						v-list-item-action-text
							template(v-for="content_type in resource.content_types")
								v-chip(class="ma-2" color="primary" outlined pill :key="content_type") {{ content_type }}
			v-divider(v-if="index + 1 < resources.length" :key="index")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { TextResource } from '@/models';

@Component({
	name: 'TextResources',
})
export default class TextResources extends Vue {
	@Prop() private readonly resources!: TextResource[];
	@Prop() private readonly repoId!: string;
}
</script>