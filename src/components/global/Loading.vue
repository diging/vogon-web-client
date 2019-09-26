<template lang="pug">
  div(class="text-center indicator")
    v-progress-circular(indeterminate :size="70" :width="7" color="teal")
</template>

<script>
export default {};
</script>

<style scoped>
.indicator {
  margin-top: 70px;
}
</style>