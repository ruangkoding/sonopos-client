<template>
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
        <router-link
          :to="{ name: 'po.cart' }"
          class="btn btn-success mb-2"
        >
          <i class="fa fa-plus"></i> Tambah Data Order
        </router-link>
      </div>
      <div class="card" style="margin-top:50px;" v-show="showForm">
        <div class="card-body">
          <form v-on:submit.prevent="fetchData()">
            <div class="row">
              <div class="form-group col-md-6">
                <input
                  type="text"
                  class="form-control"
                  v-model="search.q"
                  placeholder="Nomor PO"
                />
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
      <v-alert :alert="alert"></v-alert>
      <spinner :active="isLoading"></spinner>
      <transition name="fade" v-if="showTable == true">
        <div v-if="mobile === true">
          <div class="card" v-for="v in po" :key="v.id">
            <div class="card-body">
              <table class="table-noborder">
                <tr>
                  <td>Nomor</td>
                  <td>:</td>
                  <td>
                    <router-link
                      :to="{
                        name: 'po.detail',
                        params: { id: v.id },
                      }"
                    >
                      {{ v.po_number }}
                    </router-link>
                  </td>
                </tr>
                <tr>
                  <td>Supplier</td>
                  <td>:</td>
                  <td>{{ v.supplier.supplier_name }}</td>
                </tr>
                <tr>
                  <td>Tanggal</td>
                  <td>:</td>
                  <td>{{ v.po_date | short_moment }}</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>:</td>
                  <td>{{ v.total | rupiah }}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>:</td>
                  <td>
                    <span
                      class="badge badge-warning"
                      v-if="v.status === 0"
                      style="padding:10px;"
                    >
                      <i class="fa fa-refresh"></i> MENUNGGU
                    </span>
                    <span
                      class="badge badge-success"
                      v-if="v.status === 1"
                      style="padding:10px;"
                    >
                      <i class="fa fa-check"></i> DIPROSES
                    </span>
                    <span
                      class="badge badge-danger"
                      v-if="v.status === 2"
                      style="padding:10px;"
                    >
                      <i class="fa fa-times"></i> DIBATALKAN
                    </span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="table-responsive" v-else>
          <table
            class="table table-hover table-striped table-bordered"
          >
            <thead class="thead-dark">
              <tr>
                <th scope="col" style="text-align:center;">
                  Nomor PO
                </th>
                <th scope="col" style="text-align:center;">
                  Supplier
                </th>
                <th scope="col" style="text-align:center;">
                  Tanggal
                </th>
                <th scope="col" style="text-align:center;">Total</th>
                <th scope="col" style="text-align:center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in po" :key="v.id">
                <td scope="row" style="vertical-align:middle;">
                  <router-link
                    :to="{ name: 'po.detail', params: { id: v.id } }"
                  >
                    {{ v.po_number }}
                  </router-link>
                </td>
                <td scope="row" style="vertical-align:middle;">
                  {{ v.supplier.supplier_name }}<br />
                  {{ v.supplier.supplier_address }}<br />
                </td>
                <td
                  scope="row"
                  style="text-align:center;vertical-align:middle;"
                >
                  {{ v.po_date | moment }}
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
                    class="badge badge-warning"
                    v-if="v.status === 0"
                    style="padding:10px;"
                  >
                    <i class="fa fa-refresh"></i> MENUNGGU
                  </span>
                  <span
                    class="badge badge-success"
                    v-if="v.status === 1"
                    style="padding:10px;"
                  >
                    <i class="fa fa-check"></i> DIPROSES
                  </span>
                  <span
                    class="badge badge-danger"
                    v-if="v.status === 2"
                    style="padding:10px;"
                  >
                    <i class="fa fa-times"></i> DIBATALKAN
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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
</template>

<script>
import service from './../../services.js'
import { mapState } from 'vuex'
export default {
  data: function() {
    return {
      po: {},
      search: {
        q: '',
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
    }
  },
  props: ['mobile'],
  methods: {
    toggle() {
      this.showForm = !this.showForm
    },
    clear() {
      this.search.q = ''
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
          '/api/po?user=' +
            this.userid +
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
        this.po = response.data
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
  computed: {
    ...mapState(['userid']),
  },
  created() {
    this.isLoading = true
  },
  mounted() {
    this.fetchData()
  },
}
</script>
