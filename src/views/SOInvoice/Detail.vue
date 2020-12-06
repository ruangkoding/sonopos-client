<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card">
        <div class="card-body">
          <loading
            :opacity="100"
            :active.sync="isLoading"
            :can-cancel="false"
            :is-full-page="false"
          />
          <!-- summary data -->
          <transition name="fade">
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <td style="width:15%;"><b>Invoice</b></td>
                  <td style="width:85%;">
                    {{ invoice.invoice_number }}
                  </td>
                </tr>
                <tr>
                  <td style="width:15%;"><b>Tanggal</b></td>
                  <td style="width:85%;">
                    {{ invoice.invoice_date | moment }}
                  </td>
                </tr>
                <tr>
                  <td style="width:15%;"><b>Supplier</b></td>
                  <td style="width:85%;">
                    {{ invoice.so.customer.customer_name }}<br />
                    {{ invoice.so.customer.customer_address }}<br />
                    {{ invoice.so.customer.customer_hp }}
                  </td>
                </tr>
                <tr>
                  <td style="width:15%;"><b>PIC</b></td>
                  <td style="width:85%;">
                    {{ invoice.so.user.username }}
                  </td>
                </tr>
                <tr>
                  <td style="width:15%;"><b>Pembayaran</b></td>
                  <td style="width:85%;">
                    <span
                      v-if="invoice.paymentmethod.name === 'Kredit'"
                    >
                      {{ invoice.paymentmethod.name }}<br />
                      Tanggal Jatuh Tempo :
                      <b>{{ invoice.payment_due_date | moment }}</b>
                    </span>
                    <span
                      v-if="invoice.paymentmethod.name === 'Tunai'"
                    >
                      {{ v.paymentmethod.name }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td><b>Status</b></td>
                  <td>
                    <span
                      class="badge badge-danger"
                      v-if="invoice.status === 0"
                      style="padding:5px;"
                    >
                      <i class="fa fa-times"></i> BELUM DIBAYAR
                    </span>
                    <span
                      class="badge badge-success"
                      v-if="invoice.status === 1"
                      style="padding:5px;"
                    >
                      <i class="fa fa-check"></i> LUNAS
                    </span>
                    <span
                      class="badge badge-warning"
                      v-if="invoice.status === 2"
                      style="padding:5px;"
                    >
                      <i class="fa fa-refresh"></i> DIBAYAR SEBAGIAN
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </transition>

          <div style="margin-top:25px;"></div>

          <!-- item data -->
          <div class="row">
            <div class="col-lg-12">
              <hr />
              <h3>Data Barang</h3>
              <transition name="fade" v-if="showTable == true">
                <div class="table-responsive-sm">
                  <table class="table table-hover table-bordered">
                    <thead class="thead-dark">
                      <tr>
                        <th style="width:30%;text-align:center;">
                          Barang
                        </th>
                        <th style="width:10%;text-align:center;">
                          Harga
                        </th>
                        <th style="width:5%;text-align:center;">
                          Jumlah
                        </th>
                        <th style="width:10%;text-align:center;">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="v in detail" :key="v.id">
                        <td>{{ v.item.item_name }}</td>
                        <td style="text-align:right;">
                          {{ v.price | rupiah }}
                        </td>
                        <td style="text-align:center;">
                          {{ v.quantity }} {{ v.item.unit.unit_name }}
                        </td>
                        <td style="text-align:right;">
                          {{ v.subtotal | rupiah }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" style="text-align:right;">
                          <b>Total Harga</b>
                        </td>
                        <td style="text-align:right;">
                          <b>{{ invoice.total | rupiah }}</b>
                        </td>
                      </tr>
                      <tr v-if="invoice.status == 2">
                        <td colspan="3" style="text-align:right;">
                          <b>Dibayarkan Sebagian</b>
                        </td>
                        <td style="text-align:right;">
                          <b>{{
                            (invoice.total - payment.total) | rupiah
                          }}</b>
                        </td>
                      </tr>
                      <tr v-if="invoice.status == 2">
                        <td colspan="3" style="text-align:right;">
                          <b>Sisa Pembayaran</b>
                        </td>
                        <td style="text-align:right;">
                          <b>{{ payment.total | rupiah }}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </transition>
            </div>
          </div>

          <!-- payment data -->
          <div class="row" v-if="payment_data.length > 0">
            <div class="col-lg-12">
              <hr />
              <h3>Data Pembayaran</h3>
              <transition name="fade">
                <div style="overflow-x:auto;">
                  <table class="table table-hover table-bordered">
                    <thead class="thead-dark">
                      <tr>
                        <th style="width:30%;text-align:center;">
                          Tanggal Pembayaran
                        </th>
                        <th style="width:25%;text-align:center;">
                          Jumlah Pembayaran
                        </th>
                        <th style="width:25%;text-align:center;">
                          Sisa Pembayaran
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="p in payment_data" :key="p.id">
                        <td style="text-align:center;">
                          {{ p.payment_date | moment }}
                        </td>
                        <td style="text-align:right;">
                          {{ p.nominal | rupiah }}
                        </td>
                        <td style="text-align:right;">
                          {{ (p.total_payment - p.nominal) | rupiah }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </transition>
            </div>
          </div>

          <!-- action button -->
          <span v-if="invoice.status !== 1">
            <a
              href="#"
              class="btn btn-success"
              :class="{ 'btn-block': mobile === true }"
              @click="togglePaymentModal()"
            >
              <i class="fa fa-check"></i> Proses Pembayaran
            </a>
            <a
              :href="route"
              :class="{ 'btn-block': mobile === true }"
              class="btn btn-outline-danger"
            >
              <i class="fa fa-arrow-left"></i> Kembali
            </a>
          </span>
          <span v-else>
            <a
              href="#"
              :class="{ 'btn-block': mobile === true }"
              @click="cetakInvoice(invoice.id)"
              class="btn btn-info"
            >
              <i class="fa fa-print"></i> Cetak Invoice
            </a>
            <a
              :href="route"
              :class="{ 'btn-block': mobile === true }"
              class="btn btn-outline-danger"
            >
              <i class="fa fa-arrow-left"></i> Kembali
            </a>
          </span>

          <!-- payment modal -->
          <div
            class="modal fade"
            id="payment_modal"
            tabindex="-1"
            role="dialog"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Form Invoice</h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <v-alert :alert="alert_modal"></v-alert>
                  <form method="POST">
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Tanggal Pembayaran *</label>
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span class="input-group-text">
                              <i class="fa fa-calendar"></i>
                            </span>
                          </div>
                          <date-picker
                            v-model="payment.payment_date"
                            :config="options"
                            class="form-control"
                            placeholder="Tanggal Pembayaran"
                            :class="{
                              'is-invalid': validasi.payment_date,
                            }"
                            autocomplete="off"
                          >
                          </date-picker>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Keterangan</label>
                        <textarea
                          class="form-control"
                          v-model="payment.note"
                        >
                        </textarea>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-12">
                        <label>Nominal Pembayaran *</label>
                        <money
                          class="form-control"
                          placeholder="Masukkan Nominal Pembayaran"
                          v-model="payment.nominal"
                          :class="{ 'is-invalid': validasi.nominal }"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Jumlah Yang Harus Dibayar *</label>
                        <money
                          class="form-control"
                          readonly="readonly"
                          v-model="payment.total"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <button
                          type="button"
                          class="btn btn-success"
                          :class="{ 'btn-block': mobile === true }"
                          @click.prevent="processPayment()"
                        >
                          <i class="fa fa-shopping-cart"></i> Proses
                          Pembayaran
                        </button>
                        <button
                          type="button"
                          :class="{ 'btn-block': mobile === true }"
                          class="btn btn-danger"
                          data-dismiss="modal"
                        >
                          <i class="fa fa-times"></i> Batal
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from './../../services.js'
export default {
  data() {
    return {
      id: '',
      isLoading: false,
      saldo: 0,
      showForm: false,
      showTable: false,
      alert: {
        empty: false,
        error: false,
      },
      alert_modal: {
        error: false,
        validate: false,
      },
      payment: {
        so_invoice_id: this.invoice.id,
        note: '',
        payment_date: '',
        total: '',
        nominal: '',
      },
      payment_data: {},
      remaining_payment: 0,
      validasi: {
        payment_date: '',
        nominal: '',
      },
      options: {
        format: 'YYYY-MM-DD',
        useCurrent: true,
        locale: 'id',
      },
      userId: '',
    }
  },
  props: [
    'invoice',
    'detail',
    'route',
    'print_api',
    'access',
    'api',
    'mobile',
  ],
  methods: {
    cetakInvoice() {
      let newWindow = window.open()
      newWindow.location = this.print_api
    },
    togglePaymentModal() {
      $('#payment_modal').modal('show')
    },
    processPayment() {
      let validasi = this.validate()
      if (validasi === true) {
        if (this.payment.nominal <= this.payment.total) {
          service
            .postData(this.api + '/pay', this.payment)
            .then((response) => {
              if (response.status === 'ok') {
                $('#payment_modal').modal('hide')
                this.$swal(
                  'Berhasil!',
                  'Proses Pembayaran Berhasil!',
                  'success',
                )
                setTimeout(() => location.reload(), 2000)
              }
            })
            .catch((error) => {
              this.$swal(
                'Terjadi Kesalahan!',
                'Silahkan Ulangi Kembali!',
                'error',
              )
              console.log(error)
            })
        } else {
          this.$swal(
            'Peringatan!',
            'Nominal Yang Dibayarkan Tidak Boleh Melebihi Total Yang Harus Dibayar!',
            'warning',
          )
        }
      } else {
        this.alert_modal.validate = true
        setTimeout(() => (this.alert_modal.validate = false), 5000)
      }
    },
    checkRemainingPayment() {
      service
        .fetchData(this.api + '/pay?invoice=' + this.invoice.id)
        .then((response) => {
          this.payment_data = response.payment_data
          this.payment.total = response.remaining_payment
        })
        .catch((error) => {
          console.log(error)
        })
    },
    validate() {
      let condition = 0

      if (this.payment.payment_date.length === 0) {
        this.validasi.payment_date = true
        condition++
      } else {
        this.validasi.payment_date = false
      }

      if (this.payment.nominal.length === 0) {
        this.validasi.nominal = true
        condition++
      } else {
        this.validasi.nominal = false
      }

      if (condition > 0) {
        return false
      } else {
        return true
      }
    },
  },
  created() {
    this.isLoading = true
    if (this.detail.length < 1) {
      this.alert.empty = true
      this.showTable = false
    } else {
      this.showTable = true
      this.checkRemainingPayment()
    }
  },
  mounted() {
    this.userId = this.$cookies.get('id')
    this.isLoading = false
  },
}
</script>
