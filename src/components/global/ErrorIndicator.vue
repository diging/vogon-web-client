<template lang="pug">
div(class="text-center indicator")
	v-icon(x-large color="red") mdi-alert-circle-outline
	div(class="error-text")
		slot
</template>

<script lang="ts">
export default {}
</script>

<style scoped>
.indicator {
	margin-top: 70px;
}
.error-text {
	margin-top: 1em;
}
</style>