<template lang="pug">
	v-card(tile outlined class="col-details")
		v-card-title Item
			template(v-if="!item")
				EmptyView No files found!
			v-list(v-else two-line)
				template(v-for="(resource, index) in item.gilesUploads")
					//- /repository/amphora/${repoId}/text/${resource.id}${queryParam}
					//- /repository/citesphere/${repoId}/groups/${groupId}/items/${item}/giles/${filesId}
					v-list-item(:key="resource.uploadedFile.id" v-bind:to="`/repository/citesphere/${repoId}/groups/${groupId}/items/${item.key}/giles/${resource.uploadedFile.id}${queryParam}`")
						v-list-item-content
							v-list-item-title(class="font-weight-medium" v-text="resource.uploadedFile.filename")
							v-list-item-subtitle(class="text--primary" v-text="resource.uploadedFile.url")
						v-list-item-action
								v-list-item-action-text
									template(v-for="content_type in [resource.uploadedFile.content_type]")
										v-chip(class="ma-2" color="primary" outlined pill :key="content_type") {{ content_type }}
					v-divider(v-if="index + 1 < item.gilesUploads.length" :key="index")
			//- FileDisplay(v-else v-bind:files="item.gilesUploads"  v-bind:groupId="groupId" v-bind:item="item.key" v-bind:repoId="repoId" v-bind:queryParam="queryParam")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import FileDisplay from "./FileDisplay.vue"

// import { CitesphereGroup } from '@/interfaces/CitesphereTypes';

@Component({
	name: 'TextItem',
	components: {
		// FileDisplay,
	},
})
export default class TextItem extends Vue {
	@Prop() private readonly repoId!: string;
	@Prop() private readonly queryParam!: string;
	@Prop() private readonly item!: any;
	@Prop() private readonly groupId!: string;
	public mounted() {
		console.log("entereed inside Textitem", this.item.gilesUploads);
	}
}
</script>

<style scoped>
.row-select {
	padding-right: 31px;
}
.rows-per-page {
	font-size: 19px;
	padding-top: 8px;
}
</style>