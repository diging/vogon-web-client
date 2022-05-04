<template lang="pug">
	div(class="main")
		h2(class="display-1" v-if="$route.params.id") Edit relation template
		h2(class="display-1" v-else) Create new relation template
		v-btn(
			color="primary"
			large
			class="mt-4"
			@click="generateJSON()" 
		) Submit to Quadriga
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
import { getUserId } from '@/utils';
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
	private user: any;

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

	private parseMapping(data: any) {
		let modifiedData:any = {};
		const mapping:any = {"s": "subject", "p": "predicate", "o": "object"};
		const availableStrings = ["o", "p", "s"];
		const matches = data.match(/\{.+?\}/g);
		let parsed = [];
		let abbrevatedVar:any = [];
		console.log("matches",matches);
		for (let match of matches) {
			console.log("match", match);
			let slicedMatch = match.slice(1,-1)
			parsed.push(slicedMatch);
			console.log("inside match", slicedMatch);
			if (slicedMatch.length == 2) {
				abbrevatedVar.push(slicedMatch[1])
			}
		}
		console.log("abbrevated var", abbrevatedVar);
		console.log("parsed complete data",parsed);
		let remainingString = availableStrings.filter( ( el ) => !abbrevatedVar.includes( el ) );
		let convertedData= {}
		console.log("remaining string", remainingString);
		for (let match of parsed) {
			console.log("parsed", match);
			if (match.length !=2 ){
				let splitValue = match.split(':')
				modifiedData[mapping[remainingString[0]]] = {
					"type": "URI",
                    "uri": splitValue[1],
                    "label": splitValue[0]
				}
			}
			else {
				modifiedData[mapping[match[1]]] = {
					"type": "REF",
	                "reference": match[0]
				}
			}
		}
	console.log("modified data", modifiedData);
	return modifiedData
	}
	
	// private createNodes(data: any) {
	// 	data.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1)
	// 	let nodeValues = {}
	// 	for (const template_part of data) {
	// 		var result:any = Object.entries(template_part).reduce((r, [k, v]) => {
	// 		var key:any = k.replace(/_.*$/, '') ;
	// 		(r[key] = r[key] || {})[k] = v;
	// 		return r;
    // }, {});

	// 		console.log("result")
	// 	}
	
	// }

	private generateJSON() {
		var metaData:any = {};
		var Mapping: any = {};
		console.log(this.template);
		if (this.template) {
			Mapping = this.template.default_mappings;
			const context: any = {
                     "creator": "",
                     "creationTime": this.template.created,
                     "creationPlace": "Tempe",
                     "sourceUri": "http://www.digitalhps.org/concepts/CON417cf23b-5260-45b1-9a13-3945f2ed35d5"
                 };
			if (Mapping) {
				metaData['defaultMapping'] = this.parseMapping(Mapping);
				console.log("context data uuuuu", context);
				metaData['context'] = context;
				metaData['template'] = this.template.id;
			}
			// this.createNodes(this.template?.template_parts);
		}
		console.log("metadata", metaData);
		// Vue.$axios.post('/submit-relations/', metaData);
		Vue.$axios.post(`/submit-relations/`, metaData)
			.then((response: AxiosResponse) => {
				this.$router.push(`/concept/${this.$route.params.id}`);
			}
			)
			.catch((error) => {
				if (error.response && error.response.data && error.response.data.error) {
					"pass";
				}
			})
			.finally(() => "this.performingAction = false");
	}
}
</script>

<style scoped>

</style>