<template lang="pug">
	v-card(tile outlined class="col-details")
		v-card-title Item
			template(v-if="!item.gilesUploads.length")
				EmptyView No files found!
			//- TextResources(v-else v-bind:resources="item" v-bind:repoId="$route.params.repoId" v-bind:queryParam="queryParam")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// import { CitesphereGroup } from '@/interfaces/CitesphereTypes';

@Component({
	name: 'TextItem',
})
export default class TextItem extends Vue {
	// @Prop() private readonly groups!: CitesphereItem[];
	// @Prop() private readonly repoId!: string;
	// @Prop() private readonly queryParam!: string;
	// @Prop() private readonly item!: any;
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