<template lang="pug">
	div.form.relation-form
		h5 {{ name }}
		p.text-warning {{ description }}
		relation-field(
			v-on:listening="fieldIsListening"
			v-on:donelistening="fieldIsDoneListening"
			v-on:registerdata="registerData"
			v-on:unregisterdata="unregisterData"
			v-for="field in fields"
			v-bind:field="field"
			v-bind:listener="listener")
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

import RelationField from './RelationField.vue';

@Component({
  name: 'RelationTemplate',
  components: {
	'relation-field': RelationField,
  },
})
export default class RelationTemplate extends Vue {
  @Prop()
  private fields!: object;
  @Prop()
  private name!: string;
  @Prop()
  private description!: string;

  private listener: any = null;

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
.project-item {
  padding: 0;
  margin: 10px 0;
}
#title {
  background: grey;
}
</style>