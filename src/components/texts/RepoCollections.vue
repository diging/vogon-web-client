<template lang="pug">
	v-list(two-line)
		template(v-for="(collection, index) in collections" )
			v-list-item(:key="collection.id" v-bind:href="`collections/${collection.id}`")
				v-list-item-content
					v-list-item-title(v-text="collection.name")
					v-list-item-subtitle(class="text--primary" v-text="collection.description")
				v-list-item-action
					v-list-item-action-text
						v-badge
							template(v-slot:badge) {{collection.size}}
			v-divider(v-if="index + 1 < collections.length" :key="index")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { TextCollection } from '@/models';

@Component({
	name: 'RepoCollections',
})
export default class RepoCollections extends Vue {
	@Prop() private readonly collections!: TextCollection[];
}
</script>