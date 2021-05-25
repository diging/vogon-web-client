<template lang="pug">
	v-footer(app bottom fixed padless)
		v-card.background(class="flex" flat tile)
			v-card-title.pa-0.px-5
				h6.white--text VogonWeb #[strong Beta]
				
				a.caption.links(href="https://github.com/diging/vogon-web/releases/tag") Version {{version}}
				a(href="https://github.com/diging/vogon-web" class="btn btn-xs") 
					i(class="fab fa-github" )
				a(href="https://diging.atlassian.net/projects/VGNWB/summary" class="btn btn-xs")
					i(class="fab fa-jira color spacing")
				v-spacer
				a(href="http://devo-evo.lab.asu.edu" target="_blank")
					img(src="../../assets/images/logos/Laubichler lab logo-13.png" height="50px")
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
