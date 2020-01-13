<template lang="pug">
	div(class="main")
		h2(class="display-1") Create new relation template
		v-banner(class="mt-2" two-line)
			v-avatar(slot="icon" size="40" color="blue lighten-1")
				v-icon(icon="mdi-information" color="white") mdi-information-outline
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
			TemplateCreateForm(v-else class="mt-4 pa-4")

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue, Watch } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import TemplateCreateForm from '@/components/templates/TemplateCreateForm.vue';
import { ConceptType } from '@/interfaces/ConceptTypes';

@Component({
	name: 'TemplateCreate',
	components: {
		ErrorIndicator,
		Loading,
		TemplateCreateForm,
	},
})
export default class TemplateCreate extends Vue {
	private loading: boolean = true;
	private error: boolean = false;

	public created() {
		Vue.$axios.get('/relationtemplate/create_form')
			.then((response: AxiosResponse) => {
				const types: ConceptType[] = response.data.open_concepts;
				this.$store.commit('setTemplateOpenConcepts', types);
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}
</script>

<style scoped>

</style>