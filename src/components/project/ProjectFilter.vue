<template lang="pug">
	div(class="container")
		h4(class="subtitle-1") Filters
		v-row
			v-col(md="6")
				v-text-field(v-model="filters.ownedBy__username" label="Owned by (username)" outlined dense clearable)
		v-btn(depressed color="primary" @click="onApply") Apply
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ProjectFilterParams } from '@/interfaces/ProjectTypes';

@Component({ name: 'ProjectFilter' })
export default class ProjectFilter extends Vue {
	@Prop() private filters!: ProjectFilterParams;
	@Prop() private onApply!: () => void;
}
</script>

<style scoped>

</style>