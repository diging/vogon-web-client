<template lang="pug">
	div(class="home")
		v-container(fluid grid-list-md)
			v-layout.mt-7(row wrap)
				v-flex.text-left(xs12 sm12 md6 lg6)
					h2.mb-2.mt-5 Let's build the epistemic web, together.
					p This annotation interface allows you to tag words or phrases with the concepts to which you believe they refer, and bring those tags together into relational statements that you believe are supported by the text.
					v-btn.primary(depressed) Get started
						v-icon arrow_forward

			template(v-if="this.$store.getters.loggedIn")
				br
				v-card(class="card-annotations")
					v-row(class="annotation-title")
						v-col(md="6")
							h2(class="headline") Recent Annotations
						v-col(md="6")
							div(class="float-right")
								v-btn(class="view-annotations" v-bind:to="`/relations`" dense outlined) View all
					ErrorIndicator(v-if="error") Error while loading annotations!
					template(v-else)
						Loading(v-if="loading")
						template(v-else)
							template(v-if="!annotations.length")
								EmptyView No annotations found!
							template(v-else)
								AnnotationList(v-bind:annotations="annotations")
				br

		v-container.pa-5(class="grey lighten-4" style="border-radius: 10px; text-align: center")
			v-row
				v-col
					h2.text-center Our Process
			v-row
				v-col
					v-flex
						img.mb-2(class="resize" style="border-radius: 10px;" src="../../assets/images/upload.png")
					h4 1. Upload files
					v-flex
						p.responsive-p.col-xs-10.col-xs-offset-1.text-left
							| Everything begins with texts: digitized archival materials, images, webpages,
							| even your own publications. Upload texts to our secure server, or select texts
							| from an online repository.

					p
						router-link(to="about") What can I annotate?

				v-col
					v-flex
						img.mb2(class="resize" style="border-radius: 10px;" src="../../assets/images/images/annotated.png")
					h4 2. Annotate
					v-flex
						p.responsive-p.col-xs-10.col-xs-offset-1.text-left
							| Tag phrases or passages with concepts and relationships that matter to
							| #[span.heavy your research] . You don't need a rigid ontology.
							| Use concepts from existing authorities, or create your own.
					p
						router-link( to="about#how") How does it work?

				v-col
					v-flex
						img.mb-2(class="resize" style="border-radius: 10px;" src="../../assets/images/images/graph.png")
					h4 3. Share, Search, Explore
					v-flex
						p.responsive-p.col-xs-10.col-xs-offset-1.text-left
							| Your annotations join a rapidly-growing searchable database of interpretations.
							| See how the concepts in your project connect to a broader landscape of
							| actors, events, and ideas.
					p
						router-link( to="about#goodfer") What use is that, anyway?

		v-container.mt-5
			h2.text-center What's it all good for?
			v-carousel.background.mt-5.pt-3.pb-12.heightchange(height="auto")
				v-carousel-item.white--text.pa-5(v-for="item in testimonials" :key="item.heading")
					h3.mt-5.text-center {{ item.heading }}
					p.mt-5.text-left(style="width: 80%; margin: auto") "{{ item.body }}"
				
</template>


<script lang="ts">
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';

import EmptyView from '@/components/global/EmptyView.vue';
import ErrorIndicator from '@/components/global/ErrorIndicator.vue';
import Loading from '@/components/global/Loading.vue';
import AnnotationList from '@/components/relations/AnnotationList.vue';
import { RelationFilterParams, RelationSet } from '@/interfaces/RelationTypes';

@Component({
	name: 'Main',
	components: {
		EmptyView,
		ErrorIndicator,
		Loading,
		AnnotationList,
	},
})
export default class Main extends Vue {
	private loading: boolean = true;
	private error: boolean = false;
	private annotations: RelationSet[] = [];

	public data() {
		return {
			testimonials: [
				{ heading: 'Documenting Archival Research', body: 'I am an historian of science studying plant science at agricultural research stations. In the archives I photograph a large number of hand-written and type-script letters and other documents. I want to keep track of who is mentioned in these documents and how they are related, so that I can develop a better understanding of how networks of people, institutions, organisms and other historical actors developed over time. I also want to be able to retrace my steps to find the specific places in documents that substantiate relationships between actors, and be able to quickly share my data with colleagues.'},
				{ heading: 'Analyzing Functional Relationships in Texts', body: 'As a philosopher of science, I am interested in how scientific terms (like ‘gene’, ‘organism’, or ‘mechanism’) are used by investigators in different fields and disciplines. Analyzing how terms are co-located in various texts (i.e. co-occurrence networks) gets me part of the way, but I want to go further and examine functionalrelationships among terms when they are used in different contexts. I need a way to encode those relationships that allows me to make quantitative comparisons of term-usage, without committing to a rigidontology ahead of time. By looking at differences in term usage in the way, I hope to gain better insights into how concepts differ between research communities and change over time.'},
				{ heading: 'Collaborative Network Modeling Collaboratively, with Evidence', body: 'I am studying collaboration networks in fields where multi-author publications are rare. I can’t use co-authorship to model those networks, so I want to annotate the acknowledgement sections of academic research papers to encode information about collaborations among scientists. Since I am working with thousands of documents, I want to enlist the help of students and colleagues to annotate these texts. That means that we need a controlled vocabulary of personal names so that we are all annotating the texts in the same way, and so that we can discriminate among people with similar names. We need to be able to see the specific passages of text that were used to encode relationships, so that we can validate our data.'},
				{ heading: 'Structuring Existing Knowledge for Discovery and Meta-analysis', body: 'My colleagues and I have written a wide range of papers that have some overlap in the people, places, concepts, and events that we describe. We want a structured framework for looking at our work in aggregate, so that we can see precisely where our work overlaps. This will make it easier for our students to comprehend the landscape of existing scholarship in this field, and identify areas where further research may be fruitful.'},
			],
		};
	}

	public async mounted(): Promise<void> {
		this.getAnnotations();
	}

	private async getAnnotations(): Promise<void> {
		this.loading = true;
		const params: RelationFilterParams = {
			meta: false,
			limit: 10,
		};
		Vue.$axios.get('/relationset', { params })
			.then((response: AxiosResponse) => {
				this.annotations = response.data.results;
			})
			.catch(() => this.error = true)
			.finally(() => this.loading = false);
	}
}

</script>

<style scoped>
.resize {
	width: auto;
	height: 200px;
}
v-container {
	margin: 0 0 0 0;
}
#vogon-banner {
	padding: 15px;
	background-color: #ddd;
	border-radius: 5px;
}
#vogon-banner h2 {
	margin-top: 10px;
}
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
.card-annotations {
	padding: 20px 0;
	text-align: left;
}
.annotation-title {
	padding: 16px 16px 8px;
}
.view-annotations {
	align-self: center;
}
</style>