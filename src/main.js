/*jshint esversion: 8 */
import Vue from 'vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/id'
import money from 'v-money'
import accounting from 'accounting'
import VueSwal from 'vue-swal'
import router from './router.js'
import store from './store.js'
import './assets/scss/app.scss'
import App from './App.vue'
import { ModalEvent, DropdownEvent, AlertEvent } from 'bootstrap/dist/js/bootstrap.min'
import '@coreui/coreui/dist/js/coreui.min'
import VueBridgeWebview from 'vue-bridge-webview'

Vue.prototype.$apiUrl = process.env.VUE_APP_API
if (process.env.NODE_ENV === 'development') {
  Vue.prototype.$baseDir = process.env.VUE_APP_BASE_ROUTE
} else {
  Vue.prototype.$baseDir = process.env.VUE_APP_BASE_ROUTE + '/'
}

dayjs.locale('id')

Vue.use(money, {
  decimal: ',',
  thousands: '.',
  prefix: 'Rp ',
  suffix: '',
  precision: 0,
  masked: true,
})
Vue.use(VueBridgeWebview)
Vue.use(accounting)
Vue.use(VueSwal)

VueBridgeWebview.config(0,true);
// Component Config
// $.extend(true, $.fn.datetimepicker.defaults, {
//   icons: {
//     time: 'fa fa-clock',
//     date: 'fa fa-calendar',
//     up: 'fa fa-arrow-up',
//     down: 'fa fa-arrow-down',
//     previous: 'fa fa-chevron-left',
//     next: 'fa fa-chevron-right',
//     today: 'fa fa-calendar-check',
//     clear: 'fa fa-trash-alt',
//     close: 'fa fa-times-circle',
//   },
// })

// Date Filtering
Vue.filter('moment', function(date) {
  return dayjs(date).format('D MMMM YYYY')
})

// Date Filtering
Vue.filter('long_moment', function(date) {
  return dayjs(date).format('HH:mm [WIB], DD MMMM YYYY')
})

// Short Date Filtering
Vue.filter('short_moment', function(date) {
  return dayjs(date).format('D/MM/YYYY')
})

// Generate Year
Vue.filter('year', function(date) {
  return dayjs(date).format('YYYY')
})

// Filter Generate Date
Vue.filter('month', function(month) {
  const bulan = {
    1: 'Januari',
    2: 'Februari',
    3: 'Maret',
    4: 'April',
    5: 'Mei',
    6: 'Juni',
    7: 'Juli',
    8: 'Agustus',
    9: 'September',
    10: 'Oktober',
    11: 'November',
    12: 'Desember',
  }
  let output = bulan[month]
  return output
})

// Filter Rupiah
Vue.filter('rupiah', function(amount) {
  return accounting.formatMoney(amount, '', 0, '.', ',')
})

/**
 *  Component Registration
 */
Vue.component('v-alert', require('@/components/Alert.vue').default)
Vue.component('v-pagination', require('@/components/Pagination.vue').default)
Vue.component('v-delete', require('@/components/Delete.vue').default)
Vue.component('spinner', require('@/components/Spinner.vue').default)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
  store,
  router,
  components: { App },
}).$mount('#app')
