<template lang="pug">
	v-app-bar
		v-app-bar-nav-icon(@click="showSideBar")
		v-spacer
		v-toolbar-title.text-capitalize {{ text.title }}
		v-spacer
		v-menu(bottom left offset-y)
			template(v-slot:activator="{ on }")
				v-text-field(hide-details v-model="query" filled rounded single-line label="Search for Relation Templates" dense)
					template(v-slot:append)
						v-fade-transition(leave-absolute)
							v-icon(v-on="on" @click="searchRelationTemplates()") search
			v-list(two-line)
				template(v-for="(result, i) in searchResults" )
					v-list-item(:key="i" @click="")
						v-list-item-content
							v-list-item-title(v-html="result.name")
							v-list-item-subtitle(v-html="result.description")
					v-divider(v-if="i + 1 < searchResults.length" )
		v-app-bar-nav-icon(@click="showLists")
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'ToolBar',
})
export default class ToolBar extends Vue {
  private query: string = '';
  private loading: boolean = false;
  private showResults: boolean = false;
  @Prop()
  private text!: object;
  private searchResults: object[] = [];

  private showSideBar() {
	this.$store.commit('toggleSideBarMutation');
  }
  private showLists() {
	this.$store.commit('toggleLists');
  }

  private searchRelationTemplates() {
	this.loading = true;
	let all = true;
	if (this.query !== '') {
		all = false;
	}
	Vue.$axios
		.get('/relationtemplate/', {
		params: {
			format: 'json',
			all,
			search: this.query,
		},
		})
		.then((result) => {
		this.loading = false;
		this.showResults = true;
		this.searchResults = result.data.templates;
		})
		.catch((error) => {
		// TODO: deal with errors
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
  background-color: #f5f5f5;
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