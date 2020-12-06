<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card">
        <div class="card-header">
          <div class="pull-right">
            <button
              type="button"
              v-on:click.prevent="toggle"
              class="btn btn-info mb-2"
            >
              <i class="fa fa-search"></i> Form Pencarian
            </button>
          </div>
          <div
            class="card"
            style="margin-top:50px;"
            v-show="showForm"
          >
            <div class="card-body">
              <form v-on:submit.prevent="fetchData()">
                <div class="row">
                  <div class="form-group col-md-3">
                    <input
                      type="text"
                      class="form-control"
                      v-model="search.q"
                      placeholder="Nomor Invoice"
                    />
                  </div>
                  <div class="form-group col-md-3">
                    <date-picker
                      v-model="search.from"
                      :config="options"
                      class="form-control"
                      placeholder="Tanggal Mulai Pencarian"
                      autocomplete="off"
                    >
                    </date-picker>
                  </div>
                  <div class="form-group col-md-3">
                    <date-picker
                      v-model="search.to"
                      :config="options"
                      class="form-control"
                      placeholder="Tanggal Akhir Pencarian"
                      autocomplete="off"
                    >
                    </date-picker>
                  </div>
                  <div class="form-group col-md-3">
                    <select
                      v-model="search.payment"
                      class="form-control"
                    >
                      <option value="">Pilih Pembayaran</option>
                      <option value="1">Tunai</option>
                      <option value="2">Kredit</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="input-group col-md-6">
                    <button
                      type="submit"
                      :class="{ 'btn-block': mobile === true }"
                      class="btn btn-success mr-sm-2"
                    >
                      <i class="fa fa-search"></i> Cari Data
                    </button>
                    <button
                      type="button"
                      :class="{ 'btn-block': mobile === true }"
                      v-on:click.prevent="clear"
                      class="btn btn-info"
                    >
                      <i class="fa fa-refresh"></i> Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="card-body">
          <v-alert :alert="alert" />
          <loading
            :opacity="100"
            :active.sync="isLoading"
            :can-cancel="false"
            :is-full-page="false"
          />
          <transition name="fade" v-if="showTable === true">
            <!-- mobile view -->
            <div v-if="mobile === true">
              <div class="card" v-for="v in so" :key="v.id">
                <div class="card-body">
                  <table class="table-noborder">
                    <tr>
                      <td>Invoice</td>
                      <td>:</td>
                      <td>
                        <a :href="route + '/detail?id=' + v.id">{{
                          v.invoice_number
                        }}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Customer</td>
                      <td>:</td>
                      <td>{{ v.so.supplier.customer_name }}</td>
                    </tr>
                    <tr>
                      <td>Tanggal</td>
                      <td>:</td>
                      <td>{{ v.invoice_date | moment }}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>:</td>
                      <td>{{ v.total | rupiah }}</td>
                    </tr>
                    <tr>
                      <td>Pembayaran</td>
                      <td>:</td>
                      <td>
                        <span
                          v-if="v.paymentmethod.name === 'Kredit'"
                        >
                          {{ v.paymentmethod.name }}<br />
                          <b
                            >Tempo :
                            {{ v.payment_due_date | short_moment }}</b
                          >
                        </span>
                        <span v-if="v.paymentmethod.name === 'Tunai'">
                          {{ v.paymentmethod.name }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>:</td>
                      <td>
                        <span
                          class="badge badge-danger"
                          v-if="v.status === 0"
                          style="padding:5px;"
                        >
                          <i class="fa fa-times"></i> BELUM DIBAYAR
                        </span>
                        <span
                          class="badge badge-success"
                          v-if="v.status === 1"
                          style="padding:5px;"
                        >
                          <i class="fa fa-check"></i> LUNAS
                        </span>
                        <span
                          class="badge badge-warning"
                          v-if="v.status === 2"
                          style="padding:5px;"
                        >
                          <i class="fa fa-refresh"></i> DIBAYAR
                          SEBAGIAN
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <!-- desktop view -->
            <div name="fade" v-else>
              <div class="table-responsive">
                <table
                  class="table table-hover table-striped table-bordered"
                >
                  <thead class="thead-dark">
                    <tr>
                      <th
                        scope="col"
                        style="text-align:center;width:13%;"
                      >
                        Nomor Invoice
                      </th>
                      <th
                        scope="col"
                        style="text-align:center;width:32%;"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        style="text-align:center;width:15%;"
                      >
                        Tanggal
                      </th>
                      <th
                        scope="col"
                        style="text-align:center;width:12%;"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        style="text-align:center;width:13%;"
                      >
                        Pembayaran
                      </th>
                      <th
                        scope="col"
                        style="text-align:center;width:15%;"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="v in so" :key="v.id">
                      <td scope="row" style="vertical-align:middle;">
                        <a :href="route + '/detail?id=' + v.id">{{
                          v.invoice_number
                        }}</a>
                      </td>
                      <td scope="row" style="vertical-align:middle;">
                        {{ v.so.customer.customer_name }}<br />
                        {{ v.so.customer.customer_address }}<br />
                      </td>
                      <td
                        scope="row"
                        style="text-align:center;vertical-align:middle;"
                      >
                        {{ v.invoice_date | moment }}
                      </td>
                      <td
                        scope="row"
                        style="text-align:right;vertical-align:middle;"
                      >
                        {{ v.total | rupiah }}
                      </td>
                      <td
                        scope="row"
                        style="text-align:center;vertical-align:middle;"
                      >
                        <span
                          v-if="v.paymentmethod.name === 'Kredit'"
                        >
                          {{ v.paymentmethod.name }}<br />
                          <b
                            >Tempo :
                            {{ v.payment_due_date | short_moment }}</b
                          >
                        </span>
                        <span
                          v-if="v.paymentmethod.name === 'Tunai'"
                          >{{ v.paymentmethod.name }}</span
                        >
                      </td>
                      <td
                        scope="row"
                        style="text-align:center;vertical-align:middle;"
                      >
                        <span
                          class="badge badge-danger"
                          v-if="v.status === 0"
                          style="padding:5px;"
                        >
                          <i class="fa fa-times"></i> BELUM DIBAYAR
                        </span>
                        <span
                          class="badge badge-success"
                          v-if="v.status === 1"
                          style="padding:5px;"
                        >
                          <i class="fa fa-check"></i> LUNAS
                        </span>
                        <span
                          class="badge badge-warning"
                          v-if="v.status === 2"
                          style="padding:5px;"
                        >
                          <i class="fa fa-refresh"></i> DIBAYAR
                          SEBAGIAN
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </transition>

          <div class="card-footer clearfix" v-if="showTable === true">
            <v-pagination
              :pagination="pagination"
              v-on:next="nextPage"
              v-on:previous="prevPage"
              v-if="showTable === true"
            >
            </v-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from './../../services.js'

export default {
  data: function() {
    return {
      so: {},
      search: {
        q: '',
        from: '',
        to: '',
        payment: '',
      },
      alert: {
        error: false,
        empty: false,
        delete: false,
      },
      pagination: {
        page: 1,
        last: 0,
        total: 0,
        to: 0,
        from: 0,
      },
      isLoading: false,
      showForm: false,
      showTable: false,
      id: '',
      userId: '',
      options: {
        format: 'YYYY-MM-DD',
        useCurrent: false,
        locale: 'id',
      },
    }
  },
  props: ['api', 'route', 'access', 'mobile'],
  methods: {
    toggle() {
      this.showForm = !this.showForm
    },
    clear() {
      this.search.q = ''
      this.search.from = ''
      this.search.to = ''
      this.search.payment = ''
      this.fetchData()
    },
    nextPage() {
      this.pagination.page++
      this.fetchData()
    },
    prevPage() {
      this.pagination.page--
      this.fetchData()
    },
    fetchData() {
      let query = this.generateParams()
      service
        .fetchData(
          this.api +
            '?user=' +
            this.userId +
            '&' +
            query +
            '&page=' +
            this.pagination.page,
        )
        .then((response) => {
          this.renderData(response)
          this.isLoading = false
        })
        .catch((error) => {
          this.alert.error = true
          console.log(error)
        })
    },
    renderData(response) {
      if (response.total === 0) {
        this.showTable = false
        this.alert.empty = true
        this.alert.error = false
      } else {
        this.showTable = true
        this.alert.empty = false
        this.alert.error = false
        this.so = response.data
        this.pagination.last = response.last_page
        this.pagination.from = response.from
        this.pagination.to = response.to
        this.pagination.total = response.total
      }
    },
    generateParams() {
      return Object.keys(this.search)
        .map((key) => key + '=' + this.search[key])
        .join('&')
    },
  },
  created() {
    this.isLoading = true
  },
  mounted() {
    this.userId = this.$cookies.get('id')
    this.fetchData()
  },
}
</script>
