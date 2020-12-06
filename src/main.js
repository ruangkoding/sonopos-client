/*jshint esversion: 8 */
import Vue from 'vue'
import moment from 'moment/moment'
import 'moment/locale/id'
import money from 'v-money'
import accounting from 'accounting'
import datePicker from 'vue-bootstrap-datetimepicker'
import VueSwal from 'vue-swal'
import router from './router.js'
import store from './store.js'
import './assets/scss/app.scss'
import App from './App.vue'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@coreui/coreui/dist/js/coreui'

if (process.env.NODE_ENV === 'development') {
  Vue.prototype.$apiUrl = 'http://localhost/pospajada/api'
} else {
  Vue.prototype.$apiUrl = 'http://147.139.164.26/pos/api'
}

Vue.use(money, {
  decimal: ',',
  thousands: '.',
  prefix: 'Rp ',
  suffix: '',
  precision: 0,
  masked: true,
})

Vue.use(datePicker)
Vue.use(accounting)
Vue.use(VueSwal)

// Component Config
$.extend(true, $.fn.datetimepicker.defaults, {
  icons: {
    time: 'fa fa-clock',
    date: 'fa fa-calendar',
    up: 'fa fa-arrow-up',
    down: 'fa fa-arrow-down',
    previous: 'fa fa-chevron-left',
    next: 'fa fa-chevron-right',
    today: 'fa fa-calendar-check',
    clear: 'fa fa-trash-alt',
    close: 'fa fa-times-circle',
  },
})

// Date Filtering
Vue.filter('moment', function(date) {
  return moment(date).format('D MMMM YYYY')
})

// Date Filtering
Vue.filter('long_moment', function(date) {
  return moment(date).format('HH:mm [WIB], DD MMMM YYYY')
})

// Short Date Filtering
Vue.filter('short_moment', function(date) {
  return moment(date).format('D/MM/YYYY')
})

// Generate Year
Vue.filter('year', function(date) {
  return moment(date).format('YYYY')
})

// Date Filtering
Vue.filter('difference', function(date) {
  const now = moment(new Date())
  const end = moment(new Date(date))

  const duration = moment.duration(end.diff(now))
  let days = duration.asDays()
  let months = duration.asMonths()
  let output = ''

  if (parseInt(days) <= 60 && parseInt(days) > 0) {
    output =
      '<span class="badge alert-danger" style="font-size:100%;">' +
      parseInt(days) +
      ' Hari</span>'
  } else if (parseInt(days) > 60) {
    output =
      '<span class="badge alert-success" style="font-size:100%;">' +
      parseInt(months) +
      ' Bulan</span>'
  } else if (parseInt(days) === 0) {
    output =
      '<span class="badge alert-danger" style="font-size:100%;">Hari Ini</span>'
  } else if (parseInt(days) < 0) {
    output =
      '<span class="badge alert-default" style="font-size:100%;">Kontrak Habis</span>'
  }
  return output
})

// Short Date Filtering
Vue.filter('short_difference', function(since, until) {
  const from = moment(new Date(since))
  const end = moment(new Date(until))
  const duration = moment.duration(end.diff(from))
  let days = duration.asDays()
  let callback
  if (parseInt(days) > 0) {
    callback = days
  } else if (parseInt(days) === 0) {
    callback = 1
  }
  return callback
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
Vue.component(
  'v-pagination',
  require('@/components/Pagination.vue').default,
)
Vue.component('v-delete', require('@/components/Delete.vue').default)
Vue.component('spinner', require('@/components/Spinner.vue').default)

Vue.config.productionTip = false
// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: {
//     App,
//   },
// })

new Vue({
  render: (h) => h(App),
  store,
  router,
  components: { App },
}).$mount('#app')
