
<template lang="pug">
	CitesphereAuth
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import CitesphereAuth from '@/components/auth/CitesphereAuth.vue';

@Component({
  name: 'CitesphereAuthView',
  components: {
	  CitesphereAuth,
  },
})
class CitesphereAuthView extends Vue {}

export default CitesphereAuthView;
</script>
