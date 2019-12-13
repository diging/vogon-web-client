<template lang="pug">
	div(class="appellation-creator" style="max-height: 80vh; overflow-y: scroll;")
		div(class = "h4" v-if="triggered") Select Concept for Text
		div(class="h4" v-else) What is this?
			span(class="glyphicon glyphicon-question-sign" v-tooltip="'Create an appellation by attaching a concept from a controlled vocabulary. An appellation is a statement (by you) that the selected text refers to a specific concept.'")
		p.text-warning
		div(v-if="triggered")
			span(class="appellation-creator-offsets")
				{{ text.title }}
		div(v-else)
			span.appellation-creator-offsets
				{{ position.startOffset }}&ndash;{{ position.endOffset }} :
			span.appellation-creator-representation
				{{ position.representation }}
		div(v-if="concept != null" class="text-warning")
			{{ concept.label }}
			span(v-if="concept.authority != null")
				({{ concept.authority.name }})
		<!-- TODO:Not sure what this does -->
		div(v-if="isSaving()" style="position: absolute; top: 0px;")
			asdf
		div(v-if="ready()" class="form-group clearfix")
			div.btn-group.pull-right
				a(v-on:click="createAppellation" class="btn btn-xs btn-success" v-bind:disabled="isSaving()")
					Create #[span class="glyphicon glyphicon-save"]
		div(v-if="concept == null" class="input-group")
			div.checkbox
				label
					input(type="checkbox" v-model="create") I've tried so hard, but I can't find what I'm looking for!
		concept-search(
			@search="setSearch"
			v-if="concept == null && !create"
			v-on:selectconcept="selectConcept")
		concept-creator(
			v-if="create && concept == null"
			v-on:createdconcept="createdConcept")
		concept-picker(
			v-show="display"
			v-if="concept == null && !create"
			v-bind:appellations=appellations
			v-on:selectconcept="selectConcept")
		div
			a(v-on:click="cancel" class="btn btn-xs btn-danger") Cancel
</template>

<script lang="ts">
import { VForm } from "@/interfaces/GlobalTypes";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
  name: "AppellationCreator",
  components: {
    "concept-search": ConceptSearch,
    "concept-creator": ConceptCreator,
    "concept-picker": ConceptPicker
  }
})
export default class AppellationCreator extends Vue {
  @Prop()
  private position!: object;
  @Prop()
  private user!: object;
  @Prop()
  private text!: object;
  @Prop()
  private project!: object;
  @Prop()
  private appellations!: object;

  private concept: object = {};
  private create: boolean = false;
  private submitted: boolean = false;
  private saving: boolean = false;
  private search: boolean = false;
  private display: boolean = true;

  @Watch("search")
  public watchSearch() {
    if (this.search === true) {
      this.display = false;
    }
  }

  get triggered() {
    return this.$store.getters.showConcepts;
  }

  private reset() {
    this.concept = null;
    this.create = false;
    this.submitted = false;
    this.saving = false;
  }

  private setSearch(search) {
    // removes concept picker if searching concept to keep it from looking messy
    this.search = search;
  }

  private cancel() {
    this.reset();
    // TODO: Change emit to use store
    this.$emit("cancelappellation");
    this.$store.commit("triggerConcepts", false);
  }

  private isSaving() {
    return this.saving;
  }

  private awaitingConcept() {
    return this.concept == null;
  }

  private selectConcept(concept) {
    this.concept = concept;
  }

  private createdConcept(concept) {
    this.concept = concept;
    this.create = false;
  }

  private createAppellation() {
    let stringRep;
    /*
     * may want to change this at somepoint. If this is a concept for a text we set the position values to null
     */
    if (store.getters.showConcepts) {
      this.position.startOffset = null;
      this.position.endOffset = null;
      stringRep = this.text.title;
    } else {
      stringRep = this.position.representation;
    }
    if (!(this.submitted || this.saving)) {
      this.submitted = true; // Prevent multiple submissions.
      this.saving = true;
      Appellation.save({
        position: {
          occursIn: this.text.id,
          position_type: "CO",
          position_value: [
            this.position.startOffset,
            this.position.endOffset
          ].join(",")
        },
        stringRep,
        startPos: this.position.startOffset,
        endPos: this.position.endOffset,
        occursIn: this.text.id,
        createdBy: this.user.id,
        project: this.project.id,
        interpretation: this.concept.uri || this.concept.interpretation.uri
      })
        .then(response => {
          this.reset();
          if (this.$store.getters.showConcepts) {
            this.$store.commit("setTextAppellation", response.body);
            if (this.$store.getters.getValidator === 2) {
              this.$store.commit("setValidator", 0);
            }
          }
          this.$store.commit("triggerConcepts");
          this.$store.commit(
            "conceptLabel",
            response.body.interpretation_label
          );
          // TODO: Change emit for store
          self.$emit("createdappellation", response.body);
        })
        .catch(function(error) {
          this.saving = false;
        });
    }
  }
  private ready() {
    if (this.triggered && this.concept) {
      return true;
    } else {
      return (
        this.position.startOffset >= 0 &&
        this.position.endOffset &&
        this.position.representation.trim().length > 0 &&
        this.text.id &&
        this.user.id &&
        this.concept
      );
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