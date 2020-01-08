<template lang="pug">
	div(class="template-container")
		h3 {{ template.name }}
		p(class="grey--text text--darken-2") {{ template.description }}
		RelationFieldItem(
			v-for="field in template.fields"
			v-bind:field="field"
			v-bind:appellations="appellations"
		)

		v-row
			v-col(:cols="6")
				v-btn(
					outlined
					dense
					@click="$store.commit('setAnnotatorTemplate', null);"
				)
					v-icon(left) mdi-close
					| Cancel
			v-col(:cols="6")
				v-btn(
					dense
					:disabled="disabled"
					color="success"
					class="float-right"
				)
					v-icon(left) mdi-link-plus
					| Create relation
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { RelationTemplate } from '@/interfaces/RelationTypes';
import RelationFieldItem from './RelationField.vue';

@Component({
	name: 'RelationTemplateRender',
	components: {
		RelationFieldItem,
	},
})
export default class RelationTemplateRender extends Vue {
	private listener: any = null;

	@Prop()
	private template!: RelationTemplate;

	@Prop()
	private appellations!: any;

	private disabled: boolean = true;

  // Since we only want one field to listen for an appellation at a time,
  //  we keep track of the first field to announce that they are
  //  listening. All other RelationField instances are expected to respect
  //  that listener, and not start listening until the current field is
  //  done.
  public fieldIsListening(listeningField: any) {
	this.listener = listeningField;
	// TODO: Change emit to store
	if (listeningField.type === 'CO') {
		this.$emit('fieldislisteningfortext');
	}
  }

  public fieldIsDoneListening(listeningField: any) {
	this.listener = null;
	// TODO: Change emit to store
	if (listeningField.type === 'CO') {
		this.$emit('fieldisdonelisteningfortext');
	}
  }
  public registerData(field: any, data: any) {
	// TODO: Change emit to store
	this.$emit('registerdata', field, data);
  }
  public unregisterData(field: any) {
	this.$emit('unregisterdata', field);
  }
}
</script>

<style scoped>
.template-container {
	text-align: left;
	padding: 20px;
}
</style>