<template lang="pug">
    div(class="py-3")
        v-row
            v-col(:cols="9")
                div(class="body-1 font-weight-medium") {{ concept.label }}
                div(class="body-2") {{ concept.description }}
                a(class="body-2 concept-link mt-3" :href="concept.uri") 
                    v-icon(small color="teal" class="mr-1") mdi-link
                    | {{ concept.uri }}
            v-col(:cols="3")
                v-btn(class="float-right" color="primary" @click="merge") {{ action }}
        v-alert(v-if="error" v-model="error" dense type="error" class="mx-3" dismissible)
            | Error while merging the concept!
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ConceptMatch } from '@/interfaces/ConceptTypes';

@Component({
	name: 'ConceptActionItem',
})
export default class ConceptActionItem extends Vue {
	@Prop() private concept?: ConceptMatch;
	@Prop() private action?: string;

	private performingAction: boolean = false;
	private error: boolean = false;

	private merge() {
		if (this.concept) {
			this.performingAction = true;
			Vue.$axios.post(`/concept/${this.$route.params.id}/${this.action}?target=${this.concept.uri}`)
				.then(() => this.$router.push(`/concept/${this.$route.params.id}`))
				.catch(() => this.error = true)
				.finally(() => this.performingAction = false);
		}
	}
}
</script>

<style scoped>
.concept-link {
    text-decoration: none;
}
</style>