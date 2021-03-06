<template lang="pug">
		v-layout(row wrap).mt-4
			br
			h1.page-header About Vogon Web
			p.text-justify
				| In the humanities, making new knowledge involves reading and critically interpreting a wide range
				| of texts: books, archives, articles, images, interviews, and news clippings. Scholars share their
				| insights by arranging evidence and interpretation into books and articles that can in turn be read
				| and critically interpreted by other scholars. Sadly, much of that literature is read by only a small
				| number of people, and can be hard to find. It's even harder to validate research findings: scholars
				| cite each others' work, but practices for citing primary sources like archives vary widely. Dozens of
				| claims about historical actors or events might be covered by a single reference to an enormous archive.
			p.text-justify
				| #[strong What if we could do better?] What if the sum of our research was not just a pile of
				| papers, but a tangible network of historical actors, events, texts, and interpretations? What if we
				| could find out who claimed that Louis Agassiz disagreed with Charles Darwin, and on the basis of what
				| evidence, with the click of a mouse? Scholarly publishing has moved online. Our sources&mdash;even
				| the dusty archives&mdash;are moving online. It's time to rethink the possibilities for making human
				| knowledge in the digital age.
			
			h2 Building the Epistemic Web
			p.text-justify
				| VogonWeb is a web-based platform for encoding your interpretations of texts. The annotation interface
				| allows you to tag words or phrases with the concepts to which you believe they refer, and bring
				| those tags together into relational statements that you believe are supported by the text. These tags
				| and relations comprise the #[a(href="http://www.edition-open-access.de/studies/1/36/index.html") epistemic web]
				| : a network of texts, interpretations, and the people who create those interpretations. As
				| we build the epistemic web we are producing not only a rich knowledge-base for the humanities, but also
				| documenting the scholarly process itself.
			
			h2 Technology
			p.text-justify
				|VogonWeb is one component in a constellation of web applications and services that comprise a distributed
				|research infrastructure for digital and computational humanities.
			p.text-justify
				|VogonWeb is Python WSGI application developed using the #[a(href="https://www.djangoproject.com/") Django web framework]
				|and runs on the #[a(href="http://heroku.com") Heroku] cloud platform.

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: 'MainContent',
	props: {
		msg: String,
	},
});
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
.open-source{
  padding: 1px  20px 15px 20px;
}
</style>