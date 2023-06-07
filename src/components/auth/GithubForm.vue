<template lang="pug">
v-row(align="center" justify="center")
	v-col(cols="6")
		v-card
			v-form(ref="loginForm" v-model="valid")
				v-card-title#title Github Authorization
				v-card-text
					a(href=`https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}`) authorize
				v-card-actions

</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'GithubForm',
})
export default class GithubForm extends Vue {
  private password: string = '';
  private username: string = '';
  private error: boolean = false;
  private valid: boolean = false;

	public created() {
		if (this.$route.query.code) {
			this.getAccessToken(this.$route.query.code);
		}
  }

  /**
   * get access code from github after getting auth code from github
   * @param {String} code - Github authorization code from querystring.
   */
  public getAccessToken(code: string | Array<string | null>) {
	Vue.$axios
		.get('github-token/', {
		params: {
			code,
		},
		})
		.then((result) => {
			this.$router.push('dashboard');
		})
		.catch((error) => {
		// TODO: deal with errors
		this.error = true;
		});
  }
}
</script>

<style scoped>
.project-item {
  padding: 0;
  margin: 10px 0;
}
#title {
  background: grey;
}
</style>