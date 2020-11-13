<template lang="pug">
	div(class="home")
		v-container(fluid grid-list-md)
			v-layout(row wrap)
				div#vogon-banner
					h2 Vogon(Web): #[small knowledge is more than the printed word]
					p
						| The bedrock of our collective knowledge is the intepretation of texts. The epistemic web moves
						| knowledge-making #[strong out of the cloisters and into the light of day]
						| by extending the semantic web to support the subjectivity of the interpretive process. Encode
						| your interpretations of texts&mdash;from scholarly works to websites&mdash;and
						| help build the epistemic web.

			template(v-if="this.$store.getters.loggedIn")
				br
				v-card(class="card-annotations")
					v-row(class="annotation-title")
						v-col(md="6")
							h2(class="headline") Recent Annotations
						v-col(md="6")
							div(class="float-right")
								v-btn(class="view-annotations" :to="`/relations`" dense outlined) View all
					ErrorIndicator(v-if="error") Error while loading annotations!
					template(v-else)
						Loading(v-if="loading")
						template(v-else)
							template(v-if="!annotations.length")
								EmptyView No annotations found!
							template(v-else)
								AnnotationList(v-bind:annotations="annotations")
				br

			v-layout(row wrap)
				v-flex(xs12 d-flex)
					h1 Let's build the epistemic web, together.
				v-flex(xs12 d-flex)
					p 
						| The concept of the epistemic web was first introduced by 
						| #[a(href="http://www.edition-open-access.de/studies/1/36/index.html") Malcolm Hyman and Jürgen Renn] as a new
						| chapter in the history of knowledge representation. While the semantic web represents knowledge as a static graph of
						| concepts and propositions, the epistemic web encodes the multi-dimensional contexts in which those concepts and
						| propositions emerge: the texts that embed them, the times, places, and contexts of interpretation that constitute
						| local forms and moments of knowledge and knowledge-making.

			v-layout
				v-flex(xs8)
					h2 1. Digital Texts
					v-flex
						img(class="resize" style="border: 2px solid gray; padding: 0px;" src="../../assets/images/images/text.png")
					v-flex
						p.responsive-p.col-xs-10.col-xs-offset-1
							| Everything begins with texts: digitized archival materials, images, webpages,
							| even your own publications. Upload texts to our secure server, or select texts
							| from an online repository.

					p
						router-link(to="about") What can I annotate?

				v-flex(xs8)
					h2 2. Annotate
					v-flex
						img(class="resize" style="border: 2px solid gray; padding: 0px;" src="../../assets/images/images/annotated.png")
					v-flex
						p.responsive-p.col-xs-10.col-xs-offset-1
							| Tag phrases or passages with concepts and relationships that matter to
							| #[span.heavy your research] . You don't need a rigid ontology.
							| Use concepts from existing authorities, or create your own.
					p
						router-link( to="about#how") How does it work?
				v-flex(xs8)
					h2 3. Share, Search, Explore
					v-flex
						img(class="resize" style="border: 2px solid gray; padding: 0px;" src="../../assets/images/images/graph.png")
					v-flex
						p.responsive-p.col-xs-10.col-xs-offset-1
							| Your annotations join a rapidly-growing searchable database of interpretations.
							| See how the concepts in your project connect to a broader landscape of
							| actors, events, and ideas.
					p
						router-link( to="about#goodfer") What use is that, anyway?
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
	width: 75%;
	height: auto;
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