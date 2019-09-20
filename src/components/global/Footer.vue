<template lang="pug">
    v-footer(height="auto" dark)
        v-card(class="flex" flat tile)
            v-card-title.teal
                | VogonWeb 
                strong Beta
                    a.links(href="https://github.com/diging/vogon-web/releases/tag") Version 0.4
                    a(href="https://github.com/diging/vogon-web" class="btn btn-xs") 
                        i.fab.fa-github 
                    a(href="https://diging.atlassian.net/projects/VGNWB/summary" class="btn btn-xs")
                        i.fab.fa-atlassian 
                v-spacer
                a(href="http://devo-evo.lab.asu.edu" target="_blank")
                    img( src="../../assets/images/logos/devoevolab.png")
            v-card-actions.grey.darken-3.justify-center
                <strong>&copy;2019 — Laubichler Lab</strong>

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Footer',
  props: {
    msg: String,
  },
});
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
</style>
