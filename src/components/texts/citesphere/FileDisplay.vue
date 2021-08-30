<template lang="pug">
	v-list(two-line)
		template(v-for="(resource, index) in files")
			//- /repository/amphora/${repoId}/text/${resource.id}${queryParam}
			//- /repository/citesphere/${repoId}/groups/${groupId}/items/${item}/giles/${filesId}
			v-list-item(:key="resource.id" v-bind:to="`/repository/amphora/${repoId}/text/${resource.id}${queryParam}`")
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

// import { FileDisplay } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'FileDisplay',
})
export default class FileDisplay extends Vue {
	@Prop() private readonly files!: any;
	@Prop() private readonly repoId!: string;
	@Prop() private readonly queryParam!: string;
	// @Prop() private readonly groupId!: string;
	// @Prop() private readonly itemId!: string;
}
</script>