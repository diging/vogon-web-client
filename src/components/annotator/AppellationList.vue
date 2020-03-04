<template lang="pug">
	div
		div(class="text-right")
			v-btn(text tile class="mr-2" @click="$store.commit('toggleAnnotatorHideAppellation')")
				template(v-if="$store.getters.getAnnotatorHideAppellation")
					v-icon(left) mdi-eye-off
					| Show all
				template(v-else)
					v-icon(left) mdi-eye
					| Hide all
		v-list(three-line dense class="appellation-list")
			template(v-for="(appellation, i) in appellations")
				AppellationListItem(:key="appellation.id" :appellation="appellation")
				v-divider(v-if="i + 1 < appellations.length")
</template>

<script lang="ts">
import JwtDecode from 'jwt-decode';
import moment from 'moment';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { TokenDto } from '@/interfaces/GlobalTypes';
import AppellationListItem from './AppellationListItem.vue';

@Component({
	name: 'AppellationList',
	components: {
		AppellationListItem,
	},
})
export default class AppellationList extends Vue {
	@Prop() private appellations!: any;
}
</script>

<style scoped>
.appellation-list {
	max-height: 600px;
	overflow-y: auto;
	margin-top: 16px;
	margin-bottom: 16px;
	padding: 10px;
}
</style>