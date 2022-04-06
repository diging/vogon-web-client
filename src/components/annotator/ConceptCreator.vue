<template lang="pug">
	v-form(ref="conceptCreateForm" v-model="valid")
		v-checkbox(
			v-model="oath" 
			:rules="[() => !!oath || 'Please take this oath!']"
			label="I swear that I've searched exhaustively for this concept."
			dense
			class="my-2 pt-0"
			color="red"
		)

		v-alert(text dense outlined color="deep-orange" icon="mdi-fire" class="my-4")
			| Duplicate concepts really muck up the system, so this is a very important step. If you're
			| not sure, search again!

		v-text-field(
			v-model="name" 
			class="mt-5"
			label="Name"
			placeholder="This is how other users will find this concept."
			required 
			outlined
			dense
			:rules="[() => !!name || 'Concept name Required.']"
		)
		v-textarea(
			v-model="description"
			class="mt-0"
			label="Description"
			placeholder="Make it easy for other users to identify this concept."
			auto-grow
			required 
			dense
			outlined
			:rules="[() => !!description || 'Concept description Required.',() => description.length > 10 || 'Not enough characters!']"
		)
		v-select(
			v-model="conceptType"
			:items="$store.getters.getAnnotatorConceptTypes"
			item-text="uri"
			item-value="id"
			label="Type"
			outlined
			dense
			clearable
		)
		v-select(
			v-model="pos"
			:items="posChoices"
			label="Part of Speech"
			outlined
			dense
		)

		div(class="concept-btn-container")
			v-btn(color="success" class="mt-2 ml-auto" @click="create" :disabled="creating || !valid" :loading="creating")
				v-icon(left) mdi-grain
				| Create concept

		v-alert(v-if="createError" type="error" dense dismissible class="my-4")
			| Error while creating concept!
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { Concept } from '@/interfaces/ConceptTypes';
import { truncateURI } from '@/utils/annotations';

@Component({
	name: 'ConceptCreator',
})
export default class ConceptCreator extends Vue {
	private valid: boolean = false;
	private oath: boolean = false;
	private name: string = '';
	private description: string = '';
	private conceptType: number = -1;
	private posChoices: any[] = [
		{ text: 'Noun', value: 'noun' },
		{ text: 'Verb', value: 'verb' },
	];
	private pos: string = 'noun';

	private creating: boolean = false;
	private createError: boolean = false;

	private create() {
		this.creating = true;
		this.createError = false;
		const payload = {
			uri: 'generate',
			label: this.name,
			description: this.description,
			pos: this.pos,
			typed: this.conceptType,
		};

		Vue.$axios.post('/concept', payload)
			.then((response: AxiosResponse) => {
				const concept: Concept = response.data;
				this.$store.commit('setAnnotatorSelectedConcept', concept);
				this.$store.commit('setAnnotatorCreateNewConcept', false);
			})
			.catch(() => this.createError = true)
			.finally(() => this.creating = false);
	}
}
</script>

<style scoped>
.concept-btn-container {
	display: flex;
}
</style>