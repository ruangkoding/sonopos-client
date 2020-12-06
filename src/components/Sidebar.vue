<template>
  <div class="c-sidebar c-sidebar-dark bg-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
    <div class="c-sidebar-brand">
      <img
        class="c-sidebar-brand-minimized"
        src="/img/logo-mini.png"
        height="46" />
      <img
        class="c-sidebar-brand-full"
        src="/img/logo-h.png"
        height="46" />
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
      <li class="c-sidebar-nav-item">
        <router-link
          :to="{ name: 'item' }"
          class="c-sidebar-nav-link">
          <i class="c-sidebar-nav-icon fa fa-dropbox"></i> Barang
        </router-link>
      </li>
      <li class="c-sidebar-nav-dropdown">
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
          to="dashboard" 
          class="c-sidebar-nav-link">
          <i class="c-sidebar-nav-icon fa fa-lock"></i> Keluar
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>
