<template lang="pug">
	v-list(two-line)
		v-div
			template(v-for="(collection, index) in collections")
				v-div(v-if="(index >= perPage*(page - 1)) && (index <= (perPage*page) - 1)")
					v-list-item(:key="collection.id" v-bind:href="`/repository/${repoId}/collections/${collection.id}${queryParam}`")
						v-list-item-content
							v-list-item-title(v-text="collection.name")
							v-list-item-subtitle(class="text--primary" v-text="collection.description")
						v-list-item-action
							v-list-item-action-text
								v-badge
									template(v-slot:badge) {{collection.size}}
					v-divider(v-if="index + 1 < collections.length" :key="index")
			v-row
				v-spacer(cols="1")
				v-col(class="pagination" cols="1" offset="4" offset-xl="3")
					v-pagination(v-model="page" :length="Math.max(this.collections.length/this.perPage, 1)")
				v-spacer(cols="1")
				v-col(cols="2")
					p(class='rows-per-page')
						| Rows per page:
				v-col(cols="2" xl="1" class="row-select")
					v-select(:items="items" solo label="Rows" v-model="perPage" )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { TextCollection } from '@/interfaces/RepositoryTypes';

@Component({
	name: 'RepoCollections',
})
export default class RepoCollections extends Vue {
	@Prop() private readonly collections!: TextCollection[];
	@Prop() private readonly repoId!: string;
	@Prop() private readonly queryParam!: string;
	private page: number = 1;
	private items: number[] = [5, 10, 15];
	private perPage: number = 5;
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