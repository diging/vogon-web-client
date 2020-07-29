<template lang="pug">
	div(class="pa-2")
		v-expansion-panels
			v-expansion-panel
				v-expansion-panel-header 
					strong What is this?
					v-icon(small class="panel-icon") mdi-information
				v-expansion-panel-content(class="text-left")
					| Create an appellation by attaching a concept from a controlled vocabulary. 
					| An appellation is a statement (by you) that the selected text refers to a 
					| specific concept.

		div(v-if="$store.getters.getAnnotatorHighlightedText" class="text-left pa-2 mt-2")
			strong
				| {{ $store.getters.getAnnotatorHighlightedText.position.startOffset }} – 
				| {{ $store.getters.getAnnotatorHighlightedText.position.endOffset }}: &nbsp;
			span(class="grey--text text--darken-2")
				| {{ $store.getters.getAnnotatorHighlightedText.representation }}

			v-checkbox(
				v-if="!$store.getters.getAnnotatorSelectedConcept"
				v-model="createNewConcept"
				label="I've tried so hard, but I can't find what I'm looking for!"
				dense
				class="mt-2 pt-0"
				color="red"
			)

			div(v-if="$store.getters.getAnnotatorSelectedConcept" class="my-3")
				v-banner(elevation="1" class="selected-concept")
					v-list-item
						v-list-item-content
							v-list-item-title
								| {{ $store.getters.getAnnotatorSelectedConcept.label }}
								span(v-if="$store.getters.getAnnotatorSelectedConcept.authority && $store.getters.getAnnotatorSelectedConcept.authority.name")
									| &nbsp; ({{ $store.getters.getAnnotatorSelectedConcept.authority.name }})
							v-list-item-subtitle
								| {{ $store.getters.getAnnotatorSelectedConcept.description }}
					v-btn(small class="my-2" @click="$store.commit('setAnnotatorSelectedConcept', null)") Choose new concept

				div(class="relation-btn-container")
					v-btn(color="success" class="mt-3 ml-auto" @click="createOrUpdate" :disabled="creating" :loading="creating")
						v-icon(left) mdi-marker
						template(v-if="$store.getters.getAnnotatorEditAppellationMode") Update appellation
						template(v-else) Create appellation

				v-alert(v-if="createError" type="error" dense dismissible class="my-4")
					| Error while creating appellation!

			template(v-else-if="$store.getters.getAnnotatorCreateNewConcept")
				ConceptCreator

			template(v-else)
				ConceptSearch
				ConceptPicker(:concepts="concepts")

			v-btn(
				dense 
				color="error" 
				small 
				@click="cancel"
			) Cancel

</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ConceptCreator from './ConceptCreator.vue';
import ConceptPicker from './ConceptPicker.vue';
import ConceptSearch from './ConceptSearch.vue';
@Component({
	name: 'AppellationCreator',
	components: {
		ConceptSearch,
		ConceptCreator,
		ConceptPicker,
	},
})
export default class AppellationCreator extends Vue {
	@Prop() private text!: any;
	@Prop() private appellations!: any;
	private conceptsFinal: any[] = [];
	private createNewConcept: boolean = false;
	private creating: boolean = false;
	private createError: boolean = false;
	public created() {
		this.merge(this.appellations);
		this.watchStore();
	}
	@Watch('createNewConcept')
	public onCreateNewConceptChange(val: boolean) {
		this.$store.commit('setAnnotatorCreateNewConcept', val);
	}
	private watchStore() {
		this.$store.watch(
			(state, getters) => getters.getAnnotatorSearchingConcept,
			(newValue, oldValue) => {
				if (newValue) {
					this.concepts = [];
				} else {
					this.merge(this.appellations);
				}
			},
		);
	}
	get concepts() {
		return this.conceptsFinal.map((item) => ({
			...item.interpretation,
			authority: {
				name: item.interpretation.authority,
			},
		}));
	}
	set concepts(newValue) {
		this.conceptsFinal = newValue;
	}
	private merge(appellations: any) {
		this.conceptsFinal = [];
		// Sort by date
		const appellationsSorted: any[] = _.sortBy(
			this.appellations,
			(o) => -moment(o.created).unix(),
		);
		const appellationMap = new Map();
		// set map items from appellations array
		appellationsSorted.forEach((item: any) => {
			if (appellationMap.has(item.interpretation.uri)) {
				appellationMap.get(item.interpretation.uri).push(item);
			} else {
				appellationMap.set(item.interpretation.uri, [item]);
			}
		});
		const appellationMapEntires = appellationMap.entries();
		// add non-duplicate objects to `concepts` sorted by most recent
		this.addConcepts(appellationMapEntires);
		// sort appellationMap by length
		const sortedMap = new Map(
			[...appellationMap.entries()].sort(
				(a, b) => b[1].length - a[1].length,
			),
		);
		const sortedMapItems = sortedMap.entries();
		// add non-duplicate objects to `concepts` sorted by most occuring
		this.addConcepts(sortedMapItems);
	}
	private addConcepts(appellationMapEntires: any) {
		let count = 0;
		while (count <= 3) {
			const appellation: any = appellationMapEntires.next().value;
			if (!appellation) {
				break;
			}
			if (!this.conceptsFinal.includes(appellation[1][0])) {
				this.conceptsFinal.push(appellation[1][0]);
				count++;
			}
		}
	}
	private cancel() {
		this.$store.commit('setAnnotatorHighlightedText', null);
		this.$store.commit('setAnnotatorSelectedConcept', null);
		this.$store.commit('setAnnotatorEditAppellationMode', null);
	}

	private createOrUpdate() {
		this.creating = true;
		this.createError = false;
		const highlighted = this.$store.getters.getAnnotatorHighlightedText;
		const payload = {
			position: {
				occursIn: this.text.id,
				position_type: 'CO',
				position_value: `${highlighted.position.startOffset},${highlighted.position.endOffset}`,
			},
			stringRep: highlighted.representation,
			startPos: highlighted.position.startOffset,
			endPos: highlighted.position.endOffset,
			occursIn: this.text.id,
			project: this.$store.getters.getAnnotatorMeta.project,
			interpretation: this.$store.getters.getAnnotatorSelectedConcept.uri
				|| this.$store.getters.getAnnotatorSelectedConcept.interpretation.uri,
		};
		if (this.$store.getters.getAnnotatorEditAppellationMode) {
			this.update(payload, this.$store.getters.getAnnotatorEditAppellationMode.id);
			this.$store.commit('setAnnotatorEditAppellationMode', null);
		} else {
			this.create(payload);
		}
	}
	private create(payload: any) {
		Vue.$axios.post('/appellation', payload)
			.then((response: AxiosResponse) => {
				const appellation: any = response.data;
				this.$store.commit('addAnnotatorNewAppellation', appellation);
				this.$store.commit('setAnnotatorHighlightedText', null);
				this.$store.commit('setAnnotatorSelectedConcept', null);
				this.$store.commit('setAnnotatorCreatedAppellation', true);
			})
			.catch(() => this.createError = true)
			.finally(() => this.creating = false);
	}
	private update(payload: any, appellationId: number) {
		Vue.$axios.patch(`/appellation/${appellationId}`, payload)
			.then((response: AxiosResponse) => {
				this.$store.commit('setAnnotatorEditAppellationMode', null);
				this.$store.commit('setAnnotatorSelectedConcept', null);
				this.$store.commit('setAnnotatorHighlightedText', null);
				this.$store.commit('setAnnotatorCreatedAppellation', true);
				this.$store.commit('setAnnotatorUpdatedAppellation', appellationId);
			})
			.catch(() => this.createError = true)
			.finally(() => this.creating = false);
	}
}
</script>

<style scoped>
.panel-icon {
	flex: inherit !important;
}
.relation-btn-container {
	display: flex;
}
.selected-concept {
	width: 100%;
}
</style>