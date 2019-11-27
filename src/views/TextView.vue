
<template lang="pug">
	v-container
		div(v-if="!loading")
			SideDrawer(:text="text" :project="project")
			ToolBar(:text="text" )
			v-row
				TextDisplay(:content="content" :appellations="appellations")
		div(v-else)
			v-progress-circular(:size="70" :width="7" color="purple" indeterminate)
</template>

<script lang="ts">
import SideDrawer from '@/components/annotator/SideDrawer.vue';
import TextDisplay from '@/components/annotator/TextDisplay.vue';
import ToolBar from '@/components/annotator/ToolBar.vue';
import { Component, Vue } from 'vue-property-decorator';
export default Vue.extend({
	name: 'TextView',
	components: {
		TextDisplay,
		ToolBar,
		SideDrawer,
	},
	created() {
		this.getContent();
	},
	data() {
		return {
			content: null,
			project: null,
			text: null,
			loading: true,
			appellations: null,
		};
	  },
	  methods: {
		getContent() {
			Vue.$axios.get('/annotate/37/?project_id=1').then((result) => {
				this.content = result.data.content;
				this.project = result.data.project;
				this.text = result.data.text;
				this.appellations = result.data.appellations;
				this.loading = false;
			})
			.catch((error) => {
				// TODO: deal with errors
			});
		},
	  },
});
</script>

<style scoped lang="scss">
.resize {
	width: 75%;
	height: auto;
}
v-container {
	margin: 0 0 0 0;
}
#vogon-banner {
	padding: 15px;
	background-color: #ddd;
	border-radius: 5px;
}
#vogon-banner h2 {
	margin-top: 10px;
}
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>