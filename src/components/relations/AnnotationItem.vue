<template lang="pug">
	v-list-item(:key="annotation.id")
		v-list-item-content
			div(v-if="annotation.representation" class="caption") {{ annotation.representation }}
			span(v-else)
				span(class="caption") {{ annotation.template.name }}: &nbsp;
				template(v-for="(concept, index) in annotation.concepts")
					template(v-if="concept.label")
						span(class="caption font-weight-bold green--text text--darken-4" :key="index") {{ concept.label }}; &nbsp;
			span(class="caption gray--text text--darken-2")
				template(v-for="(item, index) in annotation.date_appellations_with_predicate")
					span(:key="index") {{ item.interpretation.label }}: {{ item.appellation.dateRepresentation }} &nbsp;

			div(class="caption")
				v-icon(small) mdi-account
				|&nbsp; Asserted by 
				span(class="font-weight-bold") {{ annotation.createdBy.username }} &nbsp;
				| on {{ moment(annotation.created).format('lll') }}

			div
				v-icon(small color="primary") mdi-book-variant
				| &nbsp;&nbsp;
				a(
					v-bind:href="`/repository/${annotation.occursIn.repository_id}/text/${annotation.occursIn.repository_source_id}`"
					class="annotation-link"
				) {{ annotation.occurs_in_text }}

		v-list-item-action
			v-list-item-action-text
				v-tooltip(bottom)
					template(v-slot:activator="{ on }")
						template(v-if="annotation.ready")
							v-icon(v-on="on") mdi-checkbox-marked-circle
						template(v-else)
							v-icon(v-on="on") mdi-checkbox-marked-circle-outline
					span(v-if="annotation.ready") Ready for submission
					span(v-else) Some concepts are not yet resolved

				v-tooltip(bottom)
					template(v-slot:activator="{ on }")
						template(v-if="annotation.pending")
							v-icon(v-on="on") mdi-checkbox-marked-circle
						template(v-else)
							v-icon(v-on="on") mdi-checkbox-marked-circle-outline
					span(v-if="annotation.pending")  Marked for submission
					span(v-else) Pending review

				v-tooltip(bottom)
					template(v-slot:activator="{ on }")
						template(v-if="annotation.submitted")
							v-icon(v-on="on") mdi-checkbox-marked-circle
						template(v-else)
							v-icon(v-on="on") mdi-checkbox-marked-circle-outline
					span(v-if="annotation.submitted")  Submitted on {{ moment(annotation.submittedOn).format('lll') }}
					span(v-else) Pending submission
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { RelationSet } from '@/interfaces/RelationTypes';

@Component({
	name: 'AnnotationItem',
})
export default class AnnotationItem extends Vue {
	@Prop() private readonly annotation!: RelationSet;
}
</script>

<style scoped>
.annotation-link:link, .annotation-link:visited {
	text-decoration: none;
}
.annotation-link:hover, .annotation-link:active {
	text-decoration: underline;
}
</style>