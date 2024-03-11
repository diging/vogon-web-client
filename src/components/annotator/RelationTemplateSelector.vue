<template lang="pug">
div.relation-template-selector
	div.form-group(v-on:keyup.enter="search")
		div.input-group
			input(type="text"
				class="form-control input-sm"
				v-model="query"
				placeholder="Search for a relation template...")
			div.input-group-btn
				a(v-on:click="search" class="btn btn-sm btn-success")
					| &nbsp; #[span v-if="!searching" class="glyphicon glyphicon-search"]
					| #[span v-if="searching" class="glyphicon glyphicon-hourglass"]
	p.text-muted
		| Relation templates are pre-configured "formulas" for encoding relational information
		| in a text.
	div.list-group(v-if="showingTemplates()" style="max-height: 300px; overflow-y: scroll;")
		a(v-on:click="selectTemplate(template)"
			v-for="template in templates"
			v-bind:template=template
			class="list-group-item relationtemplate-item")
			div
				strong {{ template.name }}
				span.text-muted {{ template.description }}
	div(v-if="showingTemplates()")
		a(v-on:click="clear" class="btn btn-xs btn-danger") Cancel
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	name: 'RelationTemplateSelector',
})
export default class RelationTemplateSelector extends Vue {
	private templates: any[] = [];
	private query: string = '';
	private searching: boolean = false;

	public search() {
		this.searching = true;
		// TODO: Fix axios call
		this.$axios.get('/relationtemplate', {
			params: {
				search: this.query,
				format: 'json',
				all: true,
			},
		}).then((response: any) => {
			this.templates = response.body.templates;
			this.searching = false;
		}).catch((error: any) => {
			this.searching = false;
		});
	}

	public selectTemplate(template: any) {
		// TODO: Change emit to store
		this.$store.commit('selectedtemplate', template);
	}

	public clear() {
		this.templates = [];
	}

	public showingTemplates() {
		return this.templates.length > 0;
	}
}
</script>
