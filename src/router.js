import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import VueBodyClass from 'vue-body-class'

import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import Customer from './views/Customer/Index.vue'
import Supplier from './views/Supplier/Index.vue'
import Category from './views/Category/Index.vue'
import Item from './views/Item/Index.vue'
import User from './views/User/Index.vue'
import Profile from './views/Profile.vue'

import BuyInvoice from './views/BuyInvoice/BuyInvoice.vue';
import BuyInvoiceIndex from './views/BuyInvoice/Index.vue';
import BuyInvoiceDetail from './views/BuyInvoice/Detail.vue';
import BuyInvoiceCart from './views/BuyInvoice/Cart.vue';

import SellInvoice from './views/SellInvoice/SellInvoice.vue';
import SellInvoiceIndex from './views/SellInvoice/Index.vue';
import SellInvoiceDetail from './views/SellInvoice/Detail.vue';
import SellInvoiceCart from './views/SellInvoice/Cart.vue';

Vue.use(Router)

//DEFINE ROUTE
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, bodyClass: 'app' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { bodyClass: 'app flex-row align-items-center' },
  },
  {
    path: '/customer',
    name: 'customer',
    component: Customer,
    meta: { requiresAuth: true },
  },
  {
    path: '/supplier',
    name: 'supplier',
    component: Supplier,
    meta: { requiresAuth: true },
  },
  {
    path: '/category',
    name: 'category',
    component: Category,
    meta: { requiresAuth: true },
  },
  {
    path: '/item',
    name: 'item',
    component: Item,
    meta: { requiresAuth: true },
  },
  {
    path: '/user',
    name: 'user',
    component: User,
    meta: { requiresAuth: true },
  },
  {
    path: '/buy',
    name: 'buy',
    component: BuyInvoice,
    meta: { requiresAuth: true },
    children: [
        {
            path: '',
            name: 'buy.index',
            component: BuyInvoiceIndex,
            meta: { title: 'Data Invoice Pembelian' }
        },
        {
            path: 'cart',
            name: 'buy.cart',
            component: BuyInvoiceCart,
            meta: { title: 'Keranjang Belanja' }
        },
        {
            path: 'detail/:id',
            name: 'buy.detail',
            component: BuyInvoiceDetail,
            meta: { title: 'Detail Invoice' }
        }
    ]
  },
  {
    path: '/sell',
    name: 'sell',
    component: SellInvoice,
    meta: { requiresAuth: true },
    children: [
        {
            path: '',
            name: 'sell.index',
            component: SellInvoiceIndex,
            meta: { title: 'Data Invoice Penjualan' }
        },
        {
            path: 'cart',
            name: 'sell.cart',
            component: SellInvoiceCart,
            meta: { title: 'Keranjang Belanja' }
        },
        {
            path: 'detail/:id',
            name: 'sell.detail',
            component: SellInvoiceDetail,
            meta: { title: 'Detail Invoice' }
        }
    ]
  },
]

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_ROUTE,
  routes,
})

const vueBodyClass = new VueBodyClass(routes)
const DEFAULT_TITLE = 'SonoPOS'

router.beforeEach((to, from, next) => {
  vueBodyClass.guard(to, next)
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    let auth = store.getters.isAuth
    if (!auth) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE
  })
})

export default router
