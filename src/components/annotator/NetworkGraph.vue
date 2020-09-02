<template lang="pug">
  div(
    style="height: 400px; padding: 5px"
  )
    div(ref="graph" class="graph-container")
</template>

<script lang="ts">
import cytoscape from 'cytoscape';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'NetworkGraph',
})
export default class NetworkGraph extends Vue {
  @Prop() public network!: any;

  public async mounted() {
		this.initializeNetwork();
  }

  private initializeNetwork(): void {
		let minEdgeWeight: number = 1.0;
		let maxEdgeWeight: number = 0.0;
		let minNodeWeight: number = 1.0;
		let maxNodeWeight: number = 0.0;

		this.network.forEach((element: any) => {
			const weight = Number(element.data.weight);
			if (element.data.source) {  // Edge.
				if (weight > maxEdgeWeight) { maxEdgeWeight = weight; }
				if (weight < minEdgeWeight) { minEdgeWeight = weight; }
			} else {
				if (weight > maxNodeWeight) { maxNodeWeight = weight; }
				if (weight < minNodeWeight) { minNodeWeight = weight; }
			}
		});

		// If min and max are the same, cytoscape will throw a TypeError,
		//  so we decrement the min values just to be safe.
		minNodeWeight = Number(minNodeWeight.toPrecision(4)) - 1;
		maxNodeWeight = Number(maxNodeWeight.toPrecision(4));
		minEdgeWeight = Number(minEdgeWeight.toPrecision(4)) - 1;
		maxEdgeWeight = Number(maxEdgeWeight.toPrecision(4));

		const container = this.$refs.graph as HTMLElement;
		const currentWidth = container.clientWidth || 950;
		const currentHeight = container.clientHeight || 300;

		const cy = cytoscape({
			container,
			elements: this.network,
			layout: {
				name: 'cose',
				boundingBox: {
					x1: 0,
					y1: 0,
					w: currentWidth,
					h: currentHeight,
				},
			},
			style: [    // The stylesheet for the graph.
				{   // Node size is a function of topic prevalence.
					selector: 'node',
					style: {
						'background-color': '#B74934',
						'label': 'data(label)',
						'width': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 15, 45)',
						'height': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 15, 45)',
						'font-size': 'mapData(weight, ' + minNodeWeight + ', ' + maxNodeWeight + ', 8, 36)',
					},
				},
				{
					selector: 'node.connectedNodes',
					style: {
						'opacity': 1.0,
						'border-color': '#AA9A66',
						'border-width': 2,
						'width': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 25, 55)',
						'height': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 25, 55)',
						'font-size': 'mapData(weight, ' + minNodeWeight + ', ' + maxNodeWeight + ', 8, 20)',
					},
				},
				{
					selector: 'node.nonConnectedNodes',
					style: {
						opacity: 0.5,
					},
				},
				{ // When a node is selected, it should be slightly larger and have a colored border.
					selector: 'node:selected',
					style: {
						'border-color': '#AA9A66',
						'border-width': 4,
						'font-size': 'mapData(weight, ' + minNodeWeight + ', ' + maxNodeWeight + ', 10, 35)',
						'width': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 60, 90)',
						'height': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 60, 90)',
					},
				},
				{ // Active nodes should be slightly larger.
					selector: 'node:active',
					style: {
						width: 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 30, 60)',
						height: 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 30, 60)',
					},
				},
				{ // Edge weight is a function of nPMI.
					selector: 'edge',
					style: {
						'width': 'mapData(weight, ' + minEdgeWeight  + ', ' + maxEdgeWeight + ', 0.5, 6)',
						'opacity': 1,
						'line-color': '#67655D',
						'target-arrow-color': '#ccc',
					},
				},
				{
					selector: 'edge.connectedEdge',
					style: {
						'opacity': 1,
						'line-color': '#AA9A66',
						'z-index': 500,
						'width': 'mapData(weight, ' + minEdgeWeight  + ', ' + maxEdgeWeight + ', 1, 12)',
					},
				},
				{
					// A selected edge should be slightly thicker, and be colored a brighter color.
					selector: 'edge:selected',
					style: {
						'width': 'mapData(weight, ' + minEdgeWeight  + ', ' + maxEdgeWeight + ', 2, 8)',
						'opacity': 1,
						'line-color': '#AA9A66',
					},
				},
			],
		});
		cy.fit();

		cy.on('select', 'node', (event: any) => {
			const node: any = event.target;
			const appellationId = node._private.data.appellations[0];
			this.$store.commit('setAnnotatorFocusedAppellation', appellationId);
		});

		cy.on('unselect', 'node', (event: any) => {
			this.$store.commit('setAnnotatorFocusedAppellation', 0);
		});
	}

	private resize(cy: any) {
		cy.resize();
		cy.fit();
	}
}
</script>

<style scoped lang="scss">
.graph-container {
	height: 100%;
	width: 100%;
	text-align: left;

	canvas {
		left: 0 !important;
	}
}
</style>
