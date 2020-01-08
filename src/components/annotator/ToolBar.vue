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
				template(v-for="(template, i) in templates" )
					v-list-item(:key="i" @click="showTemplate(template)")
						v-list-item-content(class="template-list")
							v-list-item-title(v-html="template.name")
							v-list-item-subtitle(v-html="template.description")
					v-divider(v-if="i + 1 < templates.length" )
		v-app-bar-nav-icon(@click="showLists")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { VForm } from '@/interfaces/GlobalTypes';
import { RelationTemplate } from '@/interfaces/RelationTypes';

@Component({
	name: 'ToolBar',
})
export default class ToolBar extends Vue {
	private query: string = '';
	private loading: boolean = false;
	private showResults: boolean = false;
	@Prop()
	private text!: object;
	private templates: RelationTemplate[] = [];

	private showSideBar() {
		this.$store.commit('toggleSideBarMutation');
	}

	private showLists() {
		this.$store.commit('toggleLists');
	}

	private searchRelationTemplates(): void {
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
				this.templates = result.data.templates;
			})
			.catch((error) => {
				// TODO: deal with errors
			});
	}

	private showTemplate(template: RelationTemplate): void {
		this.$store.commit('setAnnotatorCurrentTab', 'tab-3');
		this.$store.commit('setAnnotatorTemplate', template);
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
.template-list {
	text-align: left;
}
</style>