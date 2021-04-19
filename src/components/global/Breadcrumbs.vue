<template lang="pug">
	v-breadcrumbs(:items="items" class="breadcrumbs")
		template(v-slot:divider)
			v-icon mdi-chevron-right
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ name: 'Breadcrumbs' })
export default class Breadcrumbs extends Vue {
	@Prop() private items?: any[];
}
</script>

<style scoped>
.breadcrumbs {
	padding: 0px 0px 12px 0px !important;
}
</style>