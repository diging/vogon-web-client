<template lang="pug">
  div(
    style="height: 400px; padding: 5px"
  )
    div(ref="graph" style="height: 100%;")
</template>

<script lang="ts">
import cytoscape from 'cytoscape';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'NetworkGraph',
})
export default class NetworkGraph extends Vue {
  @Prop() public network!: any;
  private ct: any = null;

  private config: any = {
	elements: [
		{
		data: { id: 'a' },
		position: { x: 589, y: 182 },
		group: 'nodes',
		},
		{
		data: { id: 'b' },
		position: { x: 689, y: 282 },
		group: 'nodes',
		},
		{
		data: { id: 'c' },
		position: { x: 489, y: 282 },
		group: 'nodes',
		},
		{
		data: { id: 'ab', source: 'a', target: 'b' },
		group: 'edges',
		},
	],
	style: [
		{
		selector: 'node',
		style: { 'background-color': '#666', 'label': 'data(id)' },
		},
		{
		selector: 'edge',
		style: {
			'width': 3,
			'line-color': '#ccc',
			'target-arrow-color': '#ccc',
			'target-arrow-shape': 'triangle',
		},
		},
	],
	layout: { name: 'grid', rows: 1 },
  };

  public async mounted() {
	console.log('Ref', this.$refs);
	this.normalizeNetwork();
  }

  private normalizeNetwork(): void {
	let minEdgeWeight: Number = 1.0;
	let maxEdgeWeight: Number = 0.0;
	let minNodeWeight: Number = 1.0;
	let maxNodeWeight: Number = 0.0;

	this.network.forEach((element: any) => {
		let weight = Number(element.data.weight);
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

	this.ct = cytoscape({
		container: this.$refs.graph as HTMLElement,
		elements: this.network,
		layout: {
		name: 'cose',
		boundingBox: {
			x1: 0,
			y1: 0,
			w: 900,
			h: 250,
		},
		},
	});
	this.ct.fit();

	// this.ct = cytoscape({
	//   container: this.$refs.graph as HTMLElement,
	//   elements: this.network,
	//   zoom: 1,
	//   minZoom: 0.1,
	//   maxZoom: 3,
	//   panningEnabled: true,
	//   style: [    // The stylesheet for the graph.
	//     {   // Node size is a function of topic prevalence.
	//       selector: 'node',
	//       style: {
	//         'background-color': '#B74934',
	//         'label': 'data(label)',
	//         'width': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 15, 45)',
	//         'height': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 15, 45)',
	//         'font-size': 'mapData(weight, ' + minNodeWeight + ', ' + maxNodeWeight + ', 8, 36)'
	//       }
	//     },
	//     {
	//       selector: 'node.connectedNodes',
	//       style: {
	//         'opacity': 1.0,
	//         'border-color': '#AA9A66',
	//         'border-width': 2,
	//         'width': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 25, 55)',
	//         'height': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 25, 55)',
	//         'font-size': 'mapData(weight, ' + minNodeWeight + ', ' + maxNodeWeight + ', 8, 20)'
	//       }
	//     },
	//     {
	//       selector: 'node.nonConnectedNodes',
	//       style: {
	//         'opacity': 0.5,
	//       }
	//     },
	//     { // When a node is selected, it should be slightly larger and have a colored border.
	//       selector: 'node:selected',
	//       style: {
	//         'border-color': '#AA9A66',
	//         'border-width': 4,
	//         'font-size': 'mapData(weight, ' + minNodeWeight + ', ' + maxNodeWeight + ', 10, 35)',
	//         'width': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 60, 90)',
	//         'height': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 60, 90)',
	//       }
	//     },
	//     { // Active nodes should be slightly larger.
	//       selector: 'node:active',
	//       style: {
	//         'width': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 30, 60)',
	//         'height': 'mapData(weight, ' + minNodeWeight  + ', ' + maxNodeWeight + ', 30, 60)',
	//       }
	//     },
	//     { // Edge weight is a function of nPMI.
	//       selector: 'edge',
	//       style: {
	//         'width': 'mapData(weight, ' + minEdgeWeight  + ', ' + maxEdgeWeight + ', 0.5, 6)',
	//         'opacity': 1,
	//         'line-color': '#67655D',
	//         'target-arrow-color': '#ccc',
	//       },
	//     },
	//     {
	//       selector: 'edge.connectedEdge',
	//       style: {
	//         'opacity': 1,
	//         'line-color': '#AA9A66',
	//         'z-index': 500,
	//         'width': 'mapData(weight, ' + minEdgeWeight  + ', ' + maxEdgeWeight + ', 1, 12)',
	//       }
	//     },
	//     {
	//       // A selected edge should be slightly thicker, and be colored a brighter color.
	//       selector: 'edge:selected',
	//       style: {
	//         'width': 'mapData(weight, ' + minEdgeWeight  + ', ' + maxEdgeWeight + ', 2, 8)',
	//         'opacity': 1,
	//         'line-color': '#AA9A66',
	//       }
	//     }
	//   ],
	// })
  }
}
</script>

<style scoped lang="scss">

</style>
