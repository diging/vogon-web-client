<template lang="pug">
	div(class="main")
		v-row
			v-col(md="6")
				h2(class="display-1") Relation Templates
			v-col(md="6")
				div(class="float-right")
					v-btn(outlined @click="all = !all")
						template(v-if="all") My templates
						template(v-else) View all
						v-icon(right) mdi-filter-variant
					v-btn(class="ms-3" color="primary" href="/relationtemplate/add") Create

		p Relation templates provide a mechanism for mapping annotations onto complex nested relations (quadruples).

		v-data-table(
			class="elevation-1"
			:headers="headers"
			:items="templates"
			:loading="loading"
		)
			template(v-slot:loading)
				br
				div Loading templates ...
				br

			template(v-slot:no-data)
				ErrorIndicator(v-if="error")
					| Error while loading templates!
					br
				EmptyView(v-else) No templates found!

			template(v-slot:item.name="{ item }")
				a(v-bind:href="`/relationtemplate/${item.id}`" class="template-link")
					span(class="subtitle-1 font-weight-medium") {{ item.name }}

			template(v-slot:item.actions="{ item }")
				v-btn(small color="error")
					v-icon(left small) mdi-delete
					|  Delete

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue, Watch } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import { RelationTemplate } from '@/interfaces/RelationTypes';

@Component({
	name: 'TemplateList',
	components: {
		ErrorIndicator,
		EmptyView,
	},
})
export default class TemplateList extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private all: boolean = false;
	private templates: RelationTemplate[] = [];

	private headers = [
		{ text: 'Name', value: 'name' },
		{ text: 'Description', value: 'description' },
		{ text: 'Actions', value: 'actions' },
	];

	public created() {
		this.getTemplates();
	}

	@Watch('all')
	public onAllChange(val: boolean, old: boolean) {
		this.getTemplates();
	}

	private getTemplates(): void {
		this.loading = true;
		let all = '';
		if (this.all) {
			all = '?all=true';
		}
		Vue.$axios.get(`/relationtemplate${all}`)
			.then((response: AxiosResponse) => {
				this.templates = response.data;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.template-link:link, .template-link:visited {
	text-decoration: none;
	margin-right: 8px;
	align-self: center;
	line-height: 3;
}
.template-uri:link, .template-uri:visited {
	text-decoration: none;
}
.template-uri:hover, .concept-uri:active {
	color: #0D47A1 !important;
}
</style>
