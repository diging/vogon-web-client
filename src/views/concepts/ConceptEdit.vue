<template lang="pug">
	div(class="main")
		h2(class="display-1") Edit Concept
		br
		ErrorIndicator(v-if="error") Error while loading concept details!
		div(v-else)
			Loading(v-if="loading")
			template(v-else)
				v-card(outlined class="py-5 px-3")
					v-text-field(
						v-model="label"
						label="Label"
						outlined
					)

					v-textarea(
						v-model="description"
						label="Description"
						outlined
					)

					v-select(
						v-model="typed"
						label="Type"
						:items="types"
						outlined
						item-text="label"
						item-value="id"
						return-object
						clearable
					)

					v-btn(color="primary" @click="save" :loading="saving") Save
					v-alert(v-if="saveError" dense type="error" class="my-3" dismissible v-model="saveError")
						| Error while updating the concept details!

		v-snackbar(v-model="snackbar" top :timeout="3000") Successfully updated concept details!
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import { ConceptType } from '@/interfaces/ConceptTypes';

@Component({
	name: 'ConceptEdit',
	components: {
		ErrorIndicator,
		Loading,
	},
})
export default class ConceptEdit extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private snackbar: boolean = false;

	private label: string = '';
	private description: string = '';
	private typed: ConceptType | null = null;
	private types: ConceptType[] = [];

	private saving: boolean = false;
	private saveError: boolean = false;

	public created() {
		Vue.$axios.get(`/concept/${this.$route.params.id}`)
			.then((response: AxiosResponse) => {
				this.label = response.data.label;
				this.description = response.data.description;
				this.typed = response.data.typed;
				this.types = response.data.types;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}

	private save() {
		this.saving = true;
		let typedId = null;
		if (this.typed) {
			typedId = this.typed.id;
		}
		Vue.$axios.patch(`/concept/${this.$route.params.id}`, {
			label: this.label,
			description: this.description,
			typed_id: typedId,
		})
			.then(() => this.snackbar = true)
			.catch(() => this.saveError = true)
			.finally(() => this.saving = false);
	}
}
</script>

<style scoped>

</style>