<template>
  <div v-if="isAuth">
    <app-sidebar />
    <div class="c-wrapper">
      <app-topbar />
      <div class="c-body">
        <main class="c-main">
          <div class="container-fluid">
            <router-view />
          </div>
        </main>
      </div>
      <app-footer />
    </div>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import Topbar from './components/Topbar.vue'
import Footer from './components/Footer.vue'
import Sidebar from './components/Sidebar.vue'
export default {
  computed: {
    ...mapState(['token']),
    ...mapState(['userid']),
    ...mapState(['role']),
    ...mapGetters(['isAuth']),
  },
  components: {
    'app-topbar': Topbar,
    'app-footer': Footer,
    'app-sidebar': Sidebar,
  },
}
</script>
