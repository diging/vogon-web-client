<template lang="pug">
	v-card(tile outlined class="col-details")
		v-card-title Item
			template(v-if="!item")
				EmptyView No files found!
			FileDisplay(v-else v-bind:files="item.gilesUploads" v-bind:repoId="repoId" v-bind:queryParam="queryParam")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileDisplay from "./FileDisplay.vue"

// import { CitesphereGroup } from '@/interfaces/CitesphereTypes';

@Component({
	name: 'TextItem',
	components: {
		FileDisplay,
	},
})
export default class TextItem extends Vue {
	@Prop() private readonly repoId!: string;
	@Prop() private readonly queryParam!: string;
	@Prop() private readonly item!: any;

	public created() {
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