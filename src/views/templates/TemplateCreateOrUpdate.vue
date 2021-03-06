<template lang="pug">
	div(class="main")
		h2(class="display-1" v-if="$route.params.id") Edit relation template
		h2(class="display-1" v-else) Create new relation template
		v-alert(class="mt-2" prominent type="info" icon="mdi-information" outlined)
			p(class="mt-2")
				| The data structures that Vogon produces (known as Quadruples) can
				| be extremely complex, containing many levels of nested
				| relationships. Relation templates make it possible to create complex
				| nested statements with minimal effort during the annotation process.
			p(class="mt-2")
				| Use the form below to build a template. See the helpful details
				| below the form for more information.

		ErrorIndicator(v-if="error") Error while loading data!
		template(v-else)
			Loading(v-if="loading")
			TemplateCreateForm(v-else class="mt-4 pa-4" :template="template")

		v-card(class="mt-5 pa-4" outlined)
			h3(class="mb-3") Node types
			v-list-item
				v-list-item-icon
					v-chip 1
				v-list-item-content
					v-list-item-title(class="mb-2")
						h4 Open Concept
					p
						| Not the floor plan. This is the most common node type for appellations. The 
						| user can select an appellation with any interpretation (concept). You can optionally 
						| select a specific concept type; use this as a suggestion for the user as to the kind of 
						| concepts that should be used in that part of the relation.

			v-list-item
				v-list-item-icon
					v-chip 2
				v-list-item-content
					v-list-item-title(class="mb-2")
						h4 Specific concept
					p
						| In many nested relations it is desireable to specify ahead of time what the a node's 
						| interpretation should be. For example, if I am creating a template for a relation that
						|  expresses the idea of employment, I might include a node that is explicitly linked to 
						| the concept of "employee".
						br
						br
						| When you select this option, start typing in the empty input
						|  that appears; this will trigger a concept search, and options should be displayed within a few moments.

			v-list-item
				v-list-item-icon
					v-chip 3
				v-list-item-content
					v-list-item-title(class="mb-2")
						h4 Relation
					p
						| Use this node type to indicate that the node in this relation part should be another
						| relation. Enter the relation ID of the target relation.

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue, Watch } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import TemplateCreateForm from '@/components/templates/TemplateCreateForm.vue';
import { ConceptType } from '@/interfaces/ConceptTypes';
import { RelationTemplate } from '@/interfaces/RelationTypes';
import { get } from 'lodash';

@Component({
	name: 'TemplateCreateOrUpdate',
	components: {
		ErrorIndicator,
		Loading,
		TemplateCreateForm,
	},
})
export default class TemplateCreateOrUpdate extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private template: RelationTemplate | null = null;

	public created() {
		this.getOpenConceptsData()
			.then(() => {
				if (this.$route.params.id) {
					return this.getTemplateData();
				}
				return Promise.resolve();
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}

	private getOpenConceptsData() {
		return Vue.$axios.get('/relationtemplate/create_form')
			.then((response: AxiosResponse) => {
				const types: ConceptType[] = response.data.open_concepts;
				this.$store.commit('setTemplateOpenConcepts', types);
			});
	}

	private getTemplateData() {
		return Vue.$axios.get(`/relationtemplate/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.template = response.data;
			});
	}
}
</script>

<style scoped>

</style>