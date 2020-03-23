import Vue from 'vue';
import utils from '@/utils';

const plugin = {
    install() {
        Vue.$utils = utils;
        Vue.prototype.$utils = utils;
    },
};

Vue.use(plugin);
