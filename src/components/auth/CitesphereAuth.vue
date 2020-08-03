<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="citesphereAuth" v-model="valid")
					v-card-title#title Citesphere Authorization
					v-card-text
						a(href=`https://diging-dev.asu.edu/citesphere-review/api/v1/oauth/authorize?scope=read&client_id=${process.env.VUE_APP_CITESPHERE_CLIENT_ID}&response_type=code&state=vogon`) authorize
					v-card-actions

</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'CitesphereAuth',
})
export default class CitesphereAuth extends Vue {
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
   * get access code from citesphere after getting auth code from citesphere
   * @param {String} code - Citesphere authorization code from querystring.
   */
  public getAccessToken(code: string | Array<string | null>) {
	Vue.$axios.get('citesphere-token/', {
		params: {
		code,
		},
	})
		.then((result) => {
		this.$router.push('/dashboard');
		})
		.catch((error) => {
		this.error = true;
		});
  }
}
</script>
