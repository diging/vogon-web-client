<template lang="pug">
	v-footer(padless dark)
		v-card(class="flex" flat tile)
			v-card-title(class="teal")
				h4 VogonWeb #[strong Beta]
				
				a.links(href="https://github.com/diging/vogon-web/releases/tag") Version 0.4
				a(href="https://github.com/diging/vogon-web" class="btn btn-xs") 
					i(class="fab fa-github" )
				a(href="https://diging.atlassian.net/projects/VGNWB/summary" class="btn btn-xs")
					i(class="fab fa-jira")
				v-spacer
				a(href="http://devo-evo.lab.asu.edu" target="_blank")
					img(src="../../assets/images/logos/devoevolab.png")
			v-card-actions.grey.darken-3.justify-center #{ new Date().getFullYear() } — #[strong Laubichler Lab]
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: 'Footer',
	props: {},
});
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
