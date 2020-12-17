<template>
  <div class="c-sidebar c-sidebar-dark bg-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
    <div class="c-sidebar-brand">
      <img
        class="c-sidebar-brand-minimized"
        :src='baseDir + "img/logo-mini.png"'
        height="42" />
      <img
        class="c-sidebar-brand-full"
        :src='baseDir + "img/logo-h.png"'
        height="42" />
    </div>
    <ul class="c-sidebar-nav ps ps--active-y">
      <li class="c-sidebar-nav-item">
        <router-link
          :to="{ name: 'dashboard' }"
          class="c-sidebar-nav-link">
          <i class="c-sidebar-nav-icon fa fa-home"></i> Beranda
        </router-link>
      </li>
      <li class="c-sidebar-nav-dropdown">
        <a class="c-sidebar-nav-dropdown-toggle" href="#">
          <i class="c-sidebar-nav-icon fa fa-file-text-o"></i> Invoice
        </a>
        <ul class="c-sidebar-nav-dropdown-items">
          <li class="c-sidebar-nav-item">
            <router-link
              :to="{ name: 'buy.index' }"
              class="c-sidebar-nav-link">
              Pembelian
            </router-link>
          </li>
          <li class="c-sidebar-nav-item">
            <router-link
              :to="{ name: 'sell.index' }"
              class="c-sidebar-nav-link">
              Penjualan
            </router-link>
          </li>
        </ul>
      </li>
      <li class="c-sidebar-nav-item" v-if="isAdmin">
        <router-link
          :to="{ name: 'item' }"
          class="c-sidebar-nav-link">
          <i class="c-sidebar-nav-icon fa fa-dropbox"></i> Barang
        </router-link>
      </li>
      <li class="c-sidebar-nav-dropdown" v-if="isAdmin">
        <a class="c-sidebar-nav-dropdown-toggle" href="#">
          <i class="c-sidebar-nav-icon fa fa-briefcase"></i> Master
        </a>
        <ul class="c-sidebar-nav-dropdown-items">
          <li class="c-sidebar-nav-item">
            <router-link
              :to="{ name: 'user' }"
              class="c-sidebar-nav-link">
              Pengguna
            </router-link>
          </li>
          <li class="c-sidebar-nav-item">
            <router-link 
              :to="{ name: 'customer' }" 
              class="c-sidebar-nav-link">
              Konsumen
            </router-link>
          </li>
          <li class="c-sidebar-nav-item">
            <router-link
              :to="{ name: 'supplier' }"
              class="c-sidebar-nav-link">
              Supplier
            </router-link>
          </li>
          <li class="c-sidebar-nav-item">
            <router-link
              :to="{ name: 'category' }"
              class="c-sidebar-nav-link">
              Cabang Bisnis
            </router-link>
          </li>
        </ul>
      </li>
      <li class="c-sidebar-nav-item">
        <router-link
          :to="{ name: 'profile' }"
          class="c-sidebar-nav-link">
          <i class="c-sidebar-nav-icon fa fa-user"></i> Ganti Password
        </router-link>
      </li>
      <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="#" @click="logout">
          <i class="c-sidebar-nav-icon fa fa-lock"></i> Keluar
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      baseDir: this.$baseDir
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuth
    },
    isAdmin() {
      return this.$store.getters.isAdmin
    }
  },
  methods: {
    logout() {
      this.$store.commit('SET_TOKEN', null, { root: true })
      this.$store.commit('SET_USER_ID', null, { root: true })
      this.$store.commit('SET_ROLE', null, { root: true })
      this.$store.commit('SET_BRANCH', null, { root: true })
      if (!this.isAuth) {
        localStorage.removeItem('token');
        localStorage.removeItem('userid');
        localStorage.removeItem('role');
        localStorage.removeItem('businessbranch');
        this.$router.go({ name: 'login' })
      }
    }
  }
}
</script>
