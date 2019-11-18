<template lang="pug">
	v-list
		template(v-for="(annotation, index) in annotations")
			AnnotationItem(:key="annotation.id" v-bind:annotation="annotation")
			v-divider(v-if="index + 1 < annotations.length" :key="index")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { RelationSet } from '@/interfaces/RelationTypes';
import AnnotationItem from './AnnotationItem.vue';

@Component({
	name: 'AnnotationList',
	components: {
		AnnotationItem,
	},
})
export default class AnnotationList extends Vue {
	@Prop() private readonly annotations!: RelationSet[];
}
</script>