import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        background: "#284259",
        primary: "#04BF8A",
        darkgrey: "#424242",
        lightgrey: "#E7E7E7"
      },
    },
  },
});
