<template lang="pug">
div(class="main")
    h2(class="display-1") Authorizations
    h4(class="subtitle-1") Authorizations are configured by the system administrator

    ErrorIndicator(v-if="error") Error while loading authorizations!
    div(v-else)
        CitesphereAuth
        GithubForm
</template>
    
<script lang="ts">
import CitesphereAuth from '@/components/auth/CitesphereAuth.vue'
import GithubForm from '@/components/auth/GithubForm.vue'
import ErrorIndicator from '@/components/global/ErrorIndicator.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
    name: 'AuthListView',
    components: {
        CitesphereAuth,
        GithubForm,
        ErrorIndicator,
    },
})
export default class AuthListView extends Vue {
    private error: boolean = false
}
</script>
    