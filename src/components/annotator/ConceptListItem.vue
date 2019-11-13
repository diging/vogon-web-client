<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			

</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'ConceptListItem',
})
export default class ConceptListItem extends Vue {

	public mounted() {
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