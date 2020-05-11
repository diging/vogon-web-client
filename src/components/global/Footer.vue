<template lang="pug">
	v-footer(padless dark)
		v-card(class="flex" flat tile)
			v-card-title(class="teal")
				h4 VogonWeb #[strong Beta]&nbsp;
				
				p
					| #[a(href="https://github.com/diging/vogon-web/releases/tag" class="version color") {{version}}]&nbsp;
				a(href="https://github.com/diging/vogon-web" class="btn btn-xs")
					i(class="fab fa-github color" )
				a(href="https://diging.atlassian.net/projects/VGNWB/summary" class="btn btn-xs")
					i(class="fab fa-jira color spacing")
				v-spacer
				a(href="http://devo-evo.lab.asu.edu" target="_blank")
					img(src="../../assets/images/logos/devoevolab.png")
			v-card-actions.grey.darken-3.justify-center #{ new Date().getFullYear() } — #[strong Laubichler Lab]
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component({
	name: 'Footer',
	components: {},
})
export default class Footer extends Vue {
	private version: string = '';

	private async created(): Promise<void> {
	axios.get('https://api.github.com/repos/diging/vogon-web/releases/latest')
		.then((data) => {
		this.version = data.data.tag_name;
		});
	}
}
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
.version {
	position: relative;
	top: 0.22cm;
  text-decoration: none;
}
.color {
  color: white;
}
.spacing{
  position: relative;
  left: 0.2cm;
}
</style>
