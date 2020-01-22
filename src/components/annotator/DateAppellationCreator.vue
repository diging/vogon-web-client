<template lang="pug">
	div.appellation-creator
		div.h4
			When is this?
		p.text-warning
			| Create a date appellation by entering the specific date
			| to which the selected text refers. Specify only the
			| precision warranted by the evidence: for example, you
			| need not enter a month and day if only the year is
			| known.
		div
			span.appellation-creator-offsets 
				{{ position.startOffset }}&ndash;{{ position.endOffset }} :
			span.appellation-creator-representation
				{{ position.representation }}
		div.date-selector.form-inline
			input(v-model="year" type="number" class="form-control input-sm" placeholder="YYYY" min="-9999" max="9999")
			input(v-model="month" type="number" class="form-control input-sm" placeholder="MM" min="-100" max="12")
			input(v-model="day" type="number" class="form-control input-sm" placeholder="DD" min="-100" max="31")
			a(v-if="ready()" v-on:click="createAppellation" class="btn btn-sm btn-success")
				Create
		div
			a(v-on:click="cancel" class="btn btn-xs btn-danger")
				Cancel
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'DateAppellationCreator',
})
export default class DateAppellationCreator extends Vue {
  // TODO: Interface for concept
  @Prop()
  private position!: any;
  @Prop()
  private user!: any;
  @Prop()
  private text!: any;
  @Prop()
  private project!: any;

  private year: object = {};
  private month: object = {};
  private day: object = {};
  private submitted: boolean = false;
  private saving: boolean = false;
  private create: boolean = false;
  private concept: object | null = null;

  private ready() {
	return this.year && !(this.day && !this.month);
  }
  private reset() {
	this.concept = null;
	this.create = false;
	this.submitted = false;
	this.saving = false;
  }
  private cancel() {
	this.reset();
	// TODO: Get rid of this emit
	this.$emit('cancelappellation');
  }
  private createAppellation() {
	if (!(this.submitted || this.saving)) {
		// this.submitted = true;      // Prevent multiple submissions.
		// this.saving = true;
		// TODO: switch to axios
		DateAppellation.save({
		position: {
			occursIn: this.text.id,
			position_type: 'CO',
			position_value: [
			this.position.startOffset,
			this.position.endOffset,
			].join(','),
		},
		stringRep: this.position.representation,
		occursIn: this.text.id,
		createdBy: this.user.id,
		project: this.project.id,
		year: this.year,
		month: this.month,
		day: this.day,
		})
		.then((response: any) => {
			this.reset();
			// TODO: Get rid of emit
			this.$emit('createddateappellation', response.body);
		})
		.catch((error: any) => {
			this.saving = false;
		});
	}
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