<template lang="pug">
	ul
		appellation-display-item(
			v-on:selectappellation="selectAppellation"
			v-bind:appellation=appellation
			v-for="appellation in current_appellations")

</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'AppellationDisplay',
  components: {
		'appellation-display-item': AppellationDisplayItem,
	},
})
export default class AppellationDisplay extends Vue {

	private content: string = '';
	private project: object | null = null;
	private text: object | null = null;

	public created() {
		console.log('Runs');
		this.getContent();

	}

	get formattedDate() {
		return new Date(this.text.added).toLocaleString();
	}

	private getContent() {
		Vue.$axios.get('/annotate/37/?project_id=1').then((result) => {

			console.log(result.data.content);
			this.content = result.data.content;
			this.project = result.data.project;
			this.text = result.data.text;

		})
		.catch((error) => {
			// TODO: deal with errors
			this.error = true;
		});
	}

}
</script>

<style scoped>
.project-item {
	padding: 0;
	margin: 10px 0;
}
#title {
	background: grey;
}
pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	background-color:#f5f5f5;
	border: 1px solid#ccc;
	border-radius: 4px;
	display: block;
}
#test {
	float: left;
}
#text-content {
	padding: 3%;
}

</style>