
<template lang="pug">
	v-container
		div(v-if="!loading")
			SideDrawer(:text="text" :project="project")
			ToolBar(:text="text" )
			v-row
				v-col(cols="6")
					TextDisplay(:content="content" :appellations="appellations")
				v-col(cols="6")
					ListsSideDrawer(:relations='relations' :appellations="appellations")
		div(v-else)
			v-progress-circular(:size="70" :width="7" color="purple" indeterminate)
</template>

<script lang="ts">
import AppellationList from '@/components/annotator/AppellationList.vue';
import ListsSideDrawer from '@/components/annotator/ListsSideDrawer.vue';
import RelationList from '@/components/annotator/RelationList.vue';
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
	RelationList,
	AppellationList,
	ListsSideDrawer,
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
		sidebar: '',
		relations: null,
	};
  },
  methods: {
	getContent() {
		Vue.$axios
		.get('/annotate/' + ids['text'] + '/?project_id=' + ids['project']) // ToDo: Get rid of hard-coded IDs (TextID/?ProjectID)
		.then((result) => {
			this.content = result.data.content;
			this.project = result.data.project;
			this.text = result.data.text;
			this.appellations = result.data.appellations
				.filter((item: any) => item.position)
				.map((item: any) => ({
					...item,
					visible: true,
					position: {
						...item.position,
						startOffset: parseInt(item.position.position_value.split(',')[0], 10),
						endOffset: parseInt(item.position.position_value.split(',')[1], 10),
					},
				}));
			this.$store.commit('setAnnotatorAppellations', this.appellations);
			this.$store.commit('setAnnotatorMeta', {
				project: '1',
				occursIn: '13',
			});

			this.loading = false;
			this.relations = result.data.relations;
		})
		.catch((error) => {
			// TODO: deal with errors
		});
	},
  },
});

function getIds() {
	var url = document.URL;
	var ids = {};
	ids.text = url.match(/(?<=text\/)[\d]+/);
	ids.project = url.match(/(?<=text\/[\d]+\/)[\d]+/);
	console.log("Text id is " + ids['text'] + " and proj. id is " + ids['project']);
	return ids;
}
var ids = getIds();


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