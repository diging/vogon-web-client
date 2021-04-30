<template lang="pug">
	div(class="main")
		h2(class="display-1") Concept Details
		br
		ErrorIndicator(v-if="error") Error while loading concept details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(tile outlined class="concept-details")
					h3(class="headline") {{ concept.label }}
					div
						strong
							span(class="lime--text text--darken-4") {{ concept.authority }}: 
						a(v-bind:href="concept.uri" class="concept-uri blue--text text--darken-1") {{ concept.uri }}
					br
					h4(class="subtitle-1") {{ concept.description }}

				br
				v-card(class="card-concept-annotations")
					v-card-title
						v-row
							v-col(md="6") Recent Annotations
							v-col(md="6")
								div(class="float-right")
									v-btn(
										v-bind:to="`/relations?terminal_nodes=${concept.uri}`" 
										dense outlined
									) View all
					template(v-if="!concept.relations.length")
						EmptyView No annotations found!
					template(v-else)
						AnnotationList(v-bind:annotations="concept.relations")

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import AnnotationList from '@/components/relations/AnnotationList.vue';
import { Concept } from '@/interfaces/ConceptTypes';

@Component({
	name: 'ConceptDetails',
	components: {
		AnnotationList,
		ErrorIndicator,
		EmptyView,
		Loading,
	},
})
export default class ConceptDetails extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private concept: Concept = { id: 1, uri: '', url: '', relations: [], conceptpower_namespaced: false };

	public async mounted(): Promise<void> {
		Vue.$axios.get(`/concept/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.concept = response.data;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>
.concept-details {
	padding: 20px;
}
.concept-uri:link, .concept-uri:visited {
	text-decoration: none;
}
.card-concept-annotations {
	padding: 20px 0;
}
</style>