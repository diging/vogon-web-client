import Vue, { VueConstructor } from 'vue';
import { AxiosInstance } from 'axios';
import VueRouter from 'vue-router';


interface VerifyToken {
	(router: VueRouter): void;
}

declare global {
  interface Window {
    axios: AxiosInstance;
    verify: VerifyToken;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
    $verify: VerifyToken;
  }
  interface VueConstructor {
    $axios: AxiosInstance;
    $verify: VerifyToken;
  }
}