<template lang="pug">
div(class="my-3 text-left")
	v-snackbar(v-model="snackbar" top :color="snackColor") {{ snackbarMsg }}
	v-select(
		:items="posChoices"
		outlined
		dense
		label="Part of Speech (PoS)"
		v-model="pos"
	)
	v-text-field(
		outlined
		dense
		placeholder="Search concept..."
		label="Concept"
		v-model="query"
		@keyup.enter.native="search"
	)
	v-checkbox(v-model="force" label="Force fresh search" dense class="mt-0 pt-0" color="red")
	v-btn(dense outlined color="primary" @click="search" :loading="searching" :disabled="searching")
		v-icon(left) mdi-magnify
		| Search

	ConceptPicker(:concepts="concepts")
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios'
import { Component, Prop, Vue } from 'vue-property-decorator'

import ConceptPicker from '@/components/annotator/ConceptPicker.vue'
import { Concept } from '@/interfaces/ConceptTypes'

@Component({
  name: 'ConceptSearch',
  components: {
	ConceptPicker,
  },
})
export default class ConceptSearch extends Vue {
	private posChoices: any[] = [
	{ text: 'Any', value: '' },
	{ text: 'Noun', value: 'noun' },
	{ text: 'Verb', value: 'verb' },
	]
	private pos: string = ''
	private query: string = ''
	private force: boolean = false
	private concepts: Concept[] = []

	private searching: boolean = false
	private error: boolean = false
	private snackbar: boolean = false
	private snackbarMsg: string = ''
	private snackColor: string = 'success'

	public created() {
		this.watchStore()
	}

	private watchStore() {
		this.$store.watch(
			(state, getters) => getters.getAnnotatorSelectedConcept,
			(newValue, oldValue) => {
			if (newValue) {
				this.concepts = []
			}
			},
		)
	}

	private search() {
		console.log('HELLO 1')
		this.searching = true
		this.$store.commit('setAnnotatorSearchingConcept', true)
		const params: any = {
			q: this.query,
		}
		if (this.pos !== '') {
			params.pos = this.pos
		}
		if (this.force) {
			params.force = 'force'
		}
		Vue.$axios.get(`/concept/search`, {
			params,
		})
		.then((response: AxiosResponse) => {
			this.concepts = response.data.results
		})
		.catch((error: AxiosError) => {
			console.log('HELLO 2')
			this.error = true
			this.snackbarMsg = error.message
			this.snackColor = 'error'
			this.snackbar = true
		})
		.finally(() => (this.searching = false))
	}
}
</script>
