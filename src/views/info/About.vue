
<template lang="pug">
  div
    MainContent
    WhatsItGoodFor
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainContent from '@/components/info/about/MainContent.vue';
import WhatsItGoodFor from '@/components/info/about/WhatsItGoodFor.vue';
export default Vue.extend({
  name: 'home',
  components: {
    MainContent,
    WhatsItGoodFor,
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