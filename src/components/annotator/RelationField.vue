<template lang="pug">
	div(class="form-group relation-field" v-on:keyup.esc="stopListening()")
		label(class="control-label")
			{{ field.label }} #[span.text-muted {{ field.description }}]
		div.input-group
			input.text(
				v-model="value_label"
				class="form-control input-sm"
				:id="'relation-part-' + field.part_id"
				v-bind:placeholder="inputPlaceholder()")
			span.input-group-btn
				button(`v-if="selection == null"
					v-on:click="listen"
					v-bind:class="{
							btn: true,
							'btn-sm': true,
							'btn-primary': !listening,
							'btn-warning': listening,
							'btn-default': isBlocked
						}"`)
					&nbsp;#[span v-if="field.type == 'TP'" class=" glyphicon glyphicon-edit"]
					#[i v-if="field.type == 'CO'" class="fa fa-i-cursor" aria-hidden="true"]
					#[span v-if="field.type == 'DT'" class=" glyphicon glyphicon-calendar"]
				button(v-else v-on:click="clear" class="btn btn-sm btn-success")
					&nbsp;#[span class="glyphicon glyphicon-ok"]
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'RelationField',
})
export default class RelationField extends Vue {

	@Prop()
	private field!: object;
	@Prop()
	private listner!: object;

	private selecton!: any = null;
	private value_label!: any = null;
	private listening: boolean = false;

	inputPlaceholder() {
		if (this.selection == null && this.listening) {
			if (this.field.type == 'TP') {
				return 'Select text or existing appellation. Press ESC to cancel.';
			} else if (this.field.type == 'DT') {
				return 'Select text or existing date appellation. Press ESC to cancel.';
			} else if (this.field.type == 'CO') {
				return 'Select text. Press ESC to cancel.';
			}
		}
	}

	listen() {
		if (!this.listening && !this.isBlocked()) { // Don't bind more than one listener.
			this.listening = true;
			//TODO: Change emit to use store
			this.$emit('listening', this.field);
			if (this.field.type == 'TP') {
				AppellationBus.$on('selectedappellation', this.handleSelection);
			} else if (this.field.type == 'CO') {
				TextBus.$on('selectedtext', this.handleSelection);
			} else if (this.field.type == 'DT') {
				AppellationBus.$on('selecteddateappellation', this.handleSelection);
			}
		}
	}

	handleSelection(selection) {
		this.stopListening();
		this.selection = selection;
		if (this.field.type == 'TP') { // Assume this is an appellation.
			this.value_label = selection.interpretation.label;
		} else if (this.field.type == 'CO') { // Assume it's a position.
			this.value_label = selection.representation;
		} else if (this.field.type == 'DT') {
			this.value_label = selection.dateRepresentation;
		}
		//TODO: Change emit to use store
		this.$emit('registerdata', this.field, this.selection);
	},
	stopListening() {
		if (this.field.type == 'TP') {
			//TODO: Change buses to use store
			AppellationBus.$off('selectedappellation', this.handleSelection);
		} else if (this.field.type == 'CO') {
			TextBus.$off('selectedtext', this.handleSelection);
		} else if (this.field.type == 'DT') {
			AppellationBus.$off('selecteddateappellation', this.handleSelection);
		}
		this.listening = false;
		//TODO: Change emit to use store
		this.$emit('donelistening', this.field);
	}
	clear() {
		this.selection = null;
		this.value_label = null;
		//TODO: Change emit to use store
		this.$emit('unregisterdata', this.field);
	}
	// We don't want to interfere with other fields, so we respect the
	//  priority of the current listener, if there is one.
	isBlocked() {
		return (this.listener !== undefined && this.listener != null && this.listener != this.field);
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