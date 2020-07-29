<template lang="pug">
	v-container(fluid grid-list-md)
		v-layout(row wrap)
			v-flex(xs12 sm12 md6 lg6)
				h2 Let's build the epistemic web, together.
				p This annotation interface allows you to tag words or phrases with the concepts to which you believe they refer, and bring those tags together into relational statements that you believe are supported by the text.
				v-btn.primary(depressed small) Get started
					v-icon chevron_right

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