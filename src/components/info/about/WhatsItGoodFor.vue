<template lang="pug">
	div
		div
			h1 How does it work?
			br
			div(style="margin-left: 10px;")
				img(src="../../../assets/images/images/annotated.png" class="img img-rounded img-thumbnail img-responsive")
			p
				|One of the core ideas of the epistemic web is the ability to point to a specific piece of evidence for
				|each interpretation that a user encodes. We tend to think about this in terms of printed or digital texts.
				|For example:
				ol
					li A user reads a passage, e.g. "Einstein was a theoretical physicist"
					li
						|The user form some interpretations, e.g. the user interprets the phrase "Einstein" as referring to
						|the person #[span.text-warning Albert Einstein], the German-born  man who lived from
						|1879 to 1955, and interprets the phrase "theoretical physicist" to refer to a general concept of a
						p|erson who works in the field of theoretical physics.
					li
						|The user creates annotations for each of the phrases that she interprets, and links them together in
						|a relation, e.g. that #[span.text-warning Albert Einstein] was a
						|#[span.text-warning theoretical physicist]
					li
						|A second user who views the annotations can subsequently find the specific place
						|where the passage interpreted by the first user as #[span.text-warning Albert Einstein]
						|is located.
		div
			h1 What can I annotate?
			div.pull-right.pa-2
				img(src="../../../assets/images/images/text.png" class="img img-rounded img-thumbnail img-responsive")
			p
				|In the first iteration of VogonWeb (up through version 0.4), we focused on annotating #[strong plain text documents].
				|That is, texts without any kind of formatting or markup. For example, PDFs that have been processed using Optical Character
				|Recognition, and HTML documents that have been scraped for their content. This was a logical starting-place, because
				|#[strong it's easy to describe a location in a string of plain text], and many of our core users were
				|already working with plain text that they had prepared for other workflows (e.g. topic modeling, Named Entity Recognition,
				|relation extraction).
			p
				|In the next minor version of VogonWeb (version 0.5), we will incorporate annotation of raw images (e.g. photos of archival
				|documents) and markup (e.g. webpages). &nbsp;
				strong If you're interested in using these features, please &nbsp;
					a(href="mailto:diging@asu.edu") get in touch
			p
				|In the future, we also hope to incorporate direct annotation of PDF documents. We've also been dreaming about audio and
				|video annotation, but that's much further down the road.
		v-layout(wrap)
			h1 What's all this good for, anyway?
			p
				|Here are a few use-cases from real projects that have used or are currently using the Vogon/Quadriga
				|annotation platform. VogonWeb is under constant development, and we need your input to make it even
				|more wonderful. Please contact &nbsp;
				a(href="mailto:diging@asu.edu") diging@asu.edu
				|&nbsp; to get involved.
				
			div
				h3 Documenting Archival Research
				p
					|"I am an historian of science studying plant science at agricultural research stations. In the
					|archives I #[strong photograph] a large number of #[strong hand-written and type-script letters]
					|and other documents. I want to keep track of who is mentioned in these documents and how they
					|are related, so that I can develop a better understanding of how networks of people, institutions,
					|organisms and other historical actors developed over time. I also want to be able to #[strong retrace my]
					|#[strong steps to find the specific places in documents] that substantiate relationships between actors,
					|and be able to quickly #[strong share my data] with colleagues.”
			div
				h3 Analyzing Functional Relationships in Texts
				p
						|"As a philosopher of science, I am interested in how scientific terms (like ‘gene’, ‘organism’, or ‘mechanism’)
						|are used by investigators in different fields and disciplines. Analyzing how terms are co-located in various
						|texts (i.e. co-occurrence networks) gets me part of the way, but I want to go further and examine #[strong functional]
						|#[strong relationships] among terms when they are used in different contexts. I need a way to encode those relationships
						|that allows me to make #[strong quantitative comparisons] of term-usage, #[strong without committing to a rigid]
						|#[strong ontology] ahead of time. By looking at differences in term usage in the way, I hope to gain better insights into how
						|concepts differ between research communities and change over time.
			div
				h3 Collaborative Network Modeling Collaboratively, with Evidence
				p
					|"I am studying #[strong collaboration networks] in fields where multi-author publications are rare. I can’t use co-authorship
					|to model those networks, so I want to #[strong annotate the acknowledgement sections] of academic research papers to encode
					|information about collaborations among scientists. Since I am working with thousands of documents, I want to enlist
					|the help of students and colleagues to annotate these texts. That means that we need a #[strong controlled vocabulary] of
					|personal names so that we are all annotating the texts in the same way, and so that we can discriminate among people
					|with similar names. We need to be able to #[strong see the specific passages of text] that were used to encode relationships,
					|so that we can #[strong validate] our data.
			div
				h3 Structuring Existing Knowledge for Discovery and Meta-analysis
				p
					|"My colleagues and I have written a wide range of papers that have some #[strong overlap in the people, places, concepts, and events]
					|that  we describe. We want a #[strong structured framework] for looking at our work in aggregate, so that we can see precisely
					|where our work overlaps. This will make it easier for our students to #[strong comprehend the landscape of existing scholarship] in this
					|field, and identify areas where further research may be fruitful.”
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class WhatsItGoodFor extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#footer {
	border-top: 1px solid lightgrey;
}
.links {
	padding-right: 2%;
	padding-left: 1%;
}
img {
	float: right;
	padding-top: 2%;
}
</style>
