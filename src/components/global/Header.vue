<template lang="pug">
	v-toolbar
		v-app-bar-nav-icon
			img(src="../../assets/images/logos/VogonTiny_beta.png")
		v-toolbar-title Vogon Web
		v-menu( offset-y open-on-hover)
			template(v-slot:activator="{ on }")
				v-toolbar-title(v-on="on")
					span Annotate
					v-icon mdi-arrow_drop_down
			v-list-item(v-for="item in annotate_items" :key="item.title" @click="")
				v-list-item-content
					v-list-item-title {{item.title}}
		v-toolbar-items.hidden-sm-and-down
			v-btn(text to="/contributors" class="subheading font-weight-medium") Contributors
			v-btn(text to="/about" class="subheading font-weight-medium") About
			v-menu( offset-y open-on-hover)
				template(v-slot:activator="{ on }")
					v-toolbar-title(v-on="on")
						span Data
						v-icon mdi-arrow_drop_down
				v-list-item(v-for="item in data_items" :key="item.title" @click="")
					v-list-item-content
						v-list-item-title {{item.title}}
		v-spacer
		v-toolbar-items.hidden-sm-and-down
			v-btn(text) Link One
			v-btn(text) Link Two
			v-btn(text) Link 3
			
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Header',
  props: {
    msg: String,
  },
  data() {
    return {
      activeIndex: '1',
      annotate_items: [{ title: 'Text' }, { title: 'Projects' }],
      data_items: [{ title: 'Concepts' }, { title: 'Annotations' }],
      info_items: [
        { title: 'Overview' },
        { title: 'Use Cases' },
        { title: 'Our Team' },
      ],
    };
  },

  methods: {
    handleSelect(key: string, keyPath: string[]) {
      this.activeIndex = key;
    },
    pushHome() {
      this.$router.push('/');
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
li a {
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}
.v-toolbar {
	flex: unset;
}
</style>
