<template lang="pug">
	v-row
		pre(id="text-content" class="text-left") {{ content }}
		appellation-display(:appellations="appellations")
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppellationDisplay from './AppellationDisplay.vue';
@Component({
  name: 'TextDisplay',
  components: {
	'appellation-display': AppellationDisplay,
  },
})
export default class TextDisplay extends Vue {
  @Prop()
  private content: string;
  @Prop()
  private appellations: any[];
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
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid#ccc;
  border-radius: 4px;
  display: block;
}
#test {
  float: left;
}
#text-content {
  padding: 3%;
}
</style>