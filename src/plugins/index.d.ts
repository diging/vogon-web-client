import Vue, { VueConstructor } from 'vue';
import { AxiosInstance } from 'axios';
import VueRouter from 'vue-router';


interface VerifyToken {
  (
    router: VueRouter,
    gaurded: boolean
  ): void;
}

declare global {
  interface Window {
    axios: AxiosInstance;
    verify: VerifyToken;
    utils: any;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
    $verify: VerifyToken;
    $utils: any;
  }
  interface VueConstructor {
    $axios: AxiosInstance;
    $verify: VerifyToken;
    $utils: any;
  }
}