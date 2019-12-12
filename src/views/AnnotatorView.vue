<template lang="pug">
	div(class="container")
		v-row
			v-col(cols="6")
				div(class="text-container")
					pre(id="text-content" ref="textContent") {{ this.content }}
					appellation-display(:appellations="appellations")

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppellationDisplay from '@/components/annotator/AppellationDisplay.vue';
import store from '@/store';
import { getAnnotationRectPositions, getPointPosition, getStyle, getTextPosition } from '@/utils/annotations';

@Component({
	name: 'Test',
	components: {
		'appellation-display': AppellationDisplay,
	},
})
export default class Test extends Vue {
	// ToDo: replace `content` and `appellations` by REST calls
	private editor: object|null|any = null;
	private content: string = `7 October 1885 – 18 November 1962) was a Danish physicist who made foundational contributions to understanding atomic structure and quantum theory, for which he received the Nobel Prize in Physics in 1922. Bohr was also a philosopher and a promoter of scientific research.

Bohr developed the Bohr model of the atom, in which he proposed that energy levels of electrons are discrete and that the electrons revolve in stable orbits around the atomic nucleus but can jump from one energy level (or orbit) to another. Although the Bohr model has been supplanted by other models, its underlying principles remain valid. He conceived the principle of complementarity: that items could be separately analysed in terms of contradictory properties, like behaving as a wave or a stream of particles. The notion of complementarity dominated Bohr's thinking in both science and philosophy.

Bohr founded the Institute of Theoretical Physics at the University of Copenhagen, now known as the Niels Bohr Institute, which opened in 1920. Bohr mentored and collaborated with physicists including Hans Kramers, Oskar Klein, George de Hevesy, and Werner Heisenberg. He predicted the existence of a new zirconium-like element, which was named hafnium, after the Latin name for Copenhagen, where it was discovered. Later, the element bohrium was named after him.

During the 1930s, Bohr helped refugees from Nazism. After Denmark was occupied by the Germans, he had a famous meeting with Heisenberg, who had become the head of the German nuclear weapon project. In September 1943, word reached Bohr that he was about to be arrested by the Germans, and he fled to Sweden. From there, he was flown to Britain, where he joined the British Tube Alloys nuclear weapons project, and was part of the British mission to the Manhattan Project. After the war, Bohr called for international cooperation on nuclear energy. He was involved with the establishment of CERN and the Research Establishment Risø of the Danish Atomic Energy Commission and became the first chairman of the Nordic Institute for Theoretical Physics in 1957.`;
	private appellations: any[] = [
		{
			visible: true,
			interpretation: { label: 'energy' },
			position: {
				startOffset: 343,
				endOffset: 549,
			},
		},
		{
			visible: true,
			interpretation: { label: 'df' },
			position: {
				startOffset: 100,
				endOffset: 120,
			},
		},
	];

	public async mounted() {
		this.calculatePositions();
		window.addEventListener('resize', this.calculatePositions);
	}

	private calculatePositions() {
		const container = this.$refs.textContent as Element;
		const positions = this.appellations.map((appellation, i) => getAnnotationRectPositions(appellation, container));

		store.commit('setTextContentStyle', { positions } );
	}
}
</script>

<style scoped>
.container {
	text-align: left;
}
pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	font-size: 10pt;
}
.text-container {
	position: relative;
}

#text-content {
	border: 1px solid #ccc;
	padding: 10px;
}
</style>