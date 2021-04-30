<template lang="pug">
	Main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Main from '@/components/home/Main.vue';

@Component({
	name: 'Home',
	components: {
		Main,
	},
})
export default class Home extends Vue {}
</script>
