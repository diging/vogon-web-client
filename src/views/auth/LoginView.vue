
<template lang="pug">
	LoginForm
</template>

<script lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
import { Component, Vue } from 'vue-property-decorator';
export default Vue.extend({
  name: 'login',
  components: {
	LoginForm,
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
</style>