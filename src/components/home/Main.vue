<template lang="pug">
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
					router-link(to="about") What can I annotate

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
import Vue from 'vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Main',
})
export default class Main extends Vue {
  private password: string = '';
  private username: string = '';
  private error: boolean = false;

  private valid: boolean = false;
  private gits: null;

public mounted() {
	if (this.$route.query.code) {
		this.getAccessToken();
	}
}

public getAccessToken() {
	axios.get('https://github.com/login/oauth/access_token',
	{
		params: {
			client_id: 'ba7c54943f8cbf9f3ab4&',
			client_secret: '7776b85b22f03982843b40458e05366487eb1ee4',
			code: this.$route.query.code,
		},
	})
	.then((result) => {
		this.gits = results.data.git;
	})
	.catch((error) => {
		// TODO: deal with errors
		this.error = true;
	});
}
}
</script>

<style scoped lang="scss">
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
</style>
