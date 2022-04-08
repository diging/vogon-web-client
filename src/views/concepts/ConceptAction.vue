<template lang="pug">
	div(class="main")
		h2(class="display-1 text-capitalize") {{ action }} Concept
		br
		ErrorIndicator(v-if="error") Error while loading concept details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(class="pb-2")
					v-card-title Are you sure?
					v-card-text
						div(class="body-2 lime--text text--darken-4 font-weight-medium mb-4") 
							| This will ultimately create a permanent record in the 
							strong Conceptpower 
							| name authority. Creating a new record that duplicates an existing record can lead 
							| to all kinds of nasty things in the future.
						v-row(class="body-1 secondary--text")
							v-col(:cols="6" class="px-3 py-0")
								strong Label:
								| &nbsp;{{ concept.label }}
							v-col(:cols="6" class="px-3 py-0")
								strong Description:
								| &nbsp;{{ concept.description }}
							v-col(:cols="6" class="px-3 py-0")
								strong URI:
								| &nbsp;{{ concept.uri }}
							v-col(:cols="6" class="px-3 py-0")
								strong Type:
								| &nbsp;{{ concept.typed_label }}
					
					v-card-actions
						v-spacer
							template(v-if="is_admin") 
								v-btn(outlined dense @click="enableConceptPicker()") Choose New Concept!
								v-card(v-if="clickNewConcept" outlined class="mx-2")
									div(v-if="clickNewConcept") 
										ConceptSearch
										v-btn(v-if="this.concept" outlined dense @click="deleteConcept()") Update Concept
										v-btn(
											dense 
											color="error" 
											small 
											@click="cancel"
										) Cancel
						v-btn(outlined dense :to="`/concept/${$route.params.id}`") Take me back!
						v-btn(color="error" dense @click="performAction()" :loading="performingAction" :disabled="performingAction")
							v-icon(left) mdi-check-circle-outline
							template(v-if="matches.length || candidates.length") I accept the risks: {{ action }} anyway!
							template(v-else) {{ action }}

					v-alert(v-if="actionError" dense type="error" class="mx-3" dismissible v-model="actionError")
						| Error while performing action "{{ action }}" {{ actionErrorMsg }}

				v-alert(prominent type="error" dark class="my-4" outlined v-if="matches.length > 0")
					div(class="title font-weight-regular") This concept matches an existing entry!
					div(class="body-1")
						| Another user (maybe you) has previously indicated that a concept
						| with the same URI is equivalent to the Conceptpower record(s) below.
						| Unless you have some reason to disagree with that equivalence, it is
						| highly recommended that you merge the concept above with (one of)
						| the Conceptpower record(s) below.

				v-card(outlined class="pa-3" v-if="matches.length > 0")
					v-list(v-for="(concept, index) in matches" :key="index" class="concept-list")
						ConceptActionItem(v-bind:concept="concept" action="merge")
						v-divider(v-if="index + 1 < candidates.length")

				v-card(outlined class="pa-3 mt-4" v-if="candidates.length > 0")
					div(class="title") This concept looks a lot like...
					v-list(v-for="(concept, index) in candidates" :key="index" class="concept-list")
						ConceptActionItem(v-bind:concept="concept" action="merge")
						v-divider(v-if="index + 1 < candidates.length")

</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ConceptActionItem from '@/components/concepts/ConceptActionItem.vue';
import ConceptSearch from '@/components/annotator/ConceptSearch.vue';
import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { Concept, ConceptMatch } from '@/interfaces/ConceptTypes';
import { getCurrentUser } from '@/utils';

@Component({
	name: 'ConceptAction',
	components: {
		ErrorIndicator,
		EmptyView,
		Loading,
		ConceptActionItem,
		ConceptSearch,
	},
})
export default class ConceptAction extends Vue {
	private action: string = '';
	private loading: boolean = true;
	private error: boolean = false;
	private user: any = {};
	private is_admin: any = '';

	private concept: Concept = { id: 1, uri: '', url: '', relations: [], conceptpower_namespaced: false };
	private matches: ConceptMatch[] = [];
	private candidates: ConceptMatch[] = [];
	private actionError: boolean = false;
	private actionErrorMsg: string = '';
	private performingAction: boolean = false;
	private chooseNewConcept: boolean = false;
	private clickNewConcept: boolean = false;
	private routeParamscurrent: string = '';

	public created() {
		this.action = this.$route.params.action;
		console.log("action value", this.action);
		this.routeParamscurrent = this.$route.params.id;
		this.is_admin = localStorage.getItem('is_admin');
		this.checkMatches();
	}

	private checkMatches() {
		Vue.$axios.get(`/concept/${this.routeParamscurrent}/matches`)
			.then((response: AxiosResponse) => {
				this.concept = response.data.concept;
				this.matches = response.data.matches;
				this.candidates = response.data.candidates;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
	
	private performAction() {
		this.performingAction = true;
		Vue.$axios.post(`/concept/${this.$route.params.id}/${this.$route.params.action}`)
			.then((response: AxiosResponse) => {
				this.$router.push(`/concept/${this.$route.params.id}`);
			})
			.catch((error: AxiosError) => {
				this.actionError = true;
				if (error.response && error.response.data && error.response.data.error) {
					this.actionErrorMsg = `: ${error.response.data.error}`;
				}
			})
			.finally(() => this.performingAction = false);
	}

	private deleteConcept() {
		this.concept = this.$store.getters.getAnnotatorSelectedConcept;
		let payload = {
			'old_concept': this.$route.params.id,
			'new_concept': this.concept
		}
		Vue.$axios.post('/appellation/update_concept', payload)
			.then((response: AxiosResponse) => {
				this.clickNewConcept = false;
				const concept = response.data['concept'];
				this.routeParamscurrent = concept;
				this.$router.replace(`/concept/${concept}/approve`);
				this.checkMatches();
			})
			.catch((error: AxiosError) => {
		})
		.finally(() => {
		});
	}

	private enableConceptPicker() {
		this.clickNewConcept = true;
	}

	private cancel() {
		this.$store.commit('setAnnotatorSelectedConcept', null);
		this.clickNewConcept = false;
	}
}
</script>

<style scoped>
.concept-list {
	padding: 0;
	font-size: .875rem;
}
</style>