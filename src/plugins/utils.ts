import Vue from 'vue';
import utils from '@/utils';
import annotations from '@/utils/annotations';
import permissions from '@/utils/permissions';

const plugin = {
    install() {
        Vue.$utils = {
            ...utils,
            annotations,
            permissions,
        };
        Vue.prototype.$utils = utils;
    },
};

Vue.use(plugin);
