<template>
  <div class="card">
    <div class="card-body">
      <spinner :active="isLoading"></spinner>
      <table class="table table-bordered" v-if="!isLoading">
        <tbody>
          <tr>
            <td style="width:15%;"><b>Nomor PO</b></td>
            <td style="width:85%;">{{ po.po_number }}</td>
          </tr>
          <tr>
            <td style="width:15%;"><b>Tanggal PO</b></td>
            <td style="width:85%;">{{ po.po_date | moment }}</td>
          </tr>
          <tr>
            <td style="width:15%;"><b>Supplier</b></td>
            <td style="width:85%;">
              {{ po.supplier.supplier_name }}<br />
              {{ po.supplier.supplier_address }}<br />
              {{ po.supplier.supplier_contact }}
            </td>
          </tr>
          <tr>
            <td style="width:15%;"><b>PIC</b></td>
            <td style="width:85%;">
              {{ po.user.username }}
            </td>
          </tr>
          <tr v-if="po.note !== null">
            <td style="width:15%;"><b>Keterangan</b></td>
            <td style="width:85%;">
              {{ po.note }}
            </td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:25px;"></div>
      <div class="row">
        <div class="col-md-12">
          <v-alert :alert="alert"></v-alert>
          <transition name="fade" v-if="showTable == true">
            <div class="table-responsive">
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
                    <th style="width:5%;text-align:center;">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="v in podetail"
                    :key="v.id"
                    :class="{ 'table-warning': isReject(v.status) }"
                  >
                    <td>
                      {{ v.item.item_name
                      }}<span v-if="isReject(v.status)"
                        >&nbsp;<i>(Dibatalkan)</i></span
                      >
                    </td>
                    <td style="text-align:right;">
                      {{ v.price | rupiah }}
                    </td>
                    <td style="text-align:center;">
                      {{ v.quantity }} {{ v.item.unit.unit_name }}
                    </td>
                    <td style="text-align:right;">
                      {{ v.subtotal | rupiah }}
                    </td>
                    <td style="text-align:center;">
                      <a
                        v-if="v.status === 0 && po.status === 0"
                        href="#"
                        @click="toggleCancelItemModal(v.id)"
                        class="btn btn-sm btn-danger"
                      >
                        <i class="fa fa-times"></i>
                      </a>
                      <span v-if="v.status === 0 && po.status === 1"
                        ><i class="fa fa-check"></i
                      ></span>
                      <span v-if="v.status === 2"
                        ><i class="fa fa-archive"></i
                      ></span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align:right;">
                      <b>Total Harga</b>
                    </td>
                    <td style="text-align:right;">
                      <b>{{ po.total | rupiah }}</b>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </transition>
        </div>
      </div>
      <span v-if="po.status === 0">
        <a
          href="#"
          :class="{ 'btn-block': mobile === true }"
          class="btn btn-success"
          @click="toggleApprovalModal(po.id)"
        >
          <i class="fa fa-check"></i> Proses Order
        </a>
        <a
          href="#"
          :class="{ 'btn-block': mobile === true }"
          class="btn btn-danger"
          @click="toggleRejectModal(po.id)"
        >
          <i class="fa fa-times"></i> Batalkan Order
        </a>
        <router-link
          :to="{ name: 'po.index' }"
          class="btn btn-secondary"
          :class="{ 'btn-block': mobile === true }"
        >
          <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
      </span>
      <span v-else>
        <router-link
          :to="{ name: 'po.index' }"
          class="btn btn-secondary"
          :class="{ 'btn-block': mobile === true }"
        >
          <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
      </span>

      <div
        class="modal fade"
        id="approval_modal"
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
                    <label>Nomor Invoice *</label>
                    <input
                      class="form-control"
                      placeholder="Masukkan Nomor Invoice"
                      v-model="checkout.invoice_number"
                      :class="{
                        'is-invalid': validasi.invoice_number,
                      }"
                      readonly="readonly"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Tanggal Invoice *</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text">
                          <i class="fa fa-calendar"></i>
                        </span>
                      </div>
                      <date-picker
                        v-model="checkout.invoice_date"
                        :config="options"
                        class="form-control"
                        placeholder="Tanggal Invoice"
                        autocomplete="off"
                      >
                      </date-picker>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Metode Pembayaran *</label>
                    <select
                      v-model="checkout.payment_method_id"
                      class="form-control"
                      :class="{
                        'is-invalid': validasi.payment_method_id,
                      }"
                    >
                      <option value=""
                        >Pilih Metode Pembayaran</option
                      >
                      <option
                        v-for="v in this.paymentmethod"
                        :value="v.id"
                        :key="v.id"
                      >
                        {{ v.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="checkout.payment_method_id === 2"
                >
                  <div class="form-group col-md-12">
                    <label>Durasi Pembayaran *</label>
                    <select
                      v-model="checkout.payment_duration"
                      class="form-control"
                    >
                      <option value="7" selected>7 Hari Kerja</option>
                      <option value="14">14 Hari Kerja</option>
                      <option value="30">30 Hari Kerja</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Keterangan</label>
                    <textarea
                      class="form-control"
                      v-model="checkout.note"
                    ></textarea>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Total Harga *</label>
                    <money
                      class="form-control"
                      readonly="readonly"
                      v-model="checkout.total"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <button
                      type="button"
                      :class="{ 'btn-block': mobile === true }"
                      class="btn btn-success"
                      @click.prevent="generateInvoice()"
                    >
                      <i class="fa fa-shopping-cart"></i> Proses
                      Invoice
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

      <div
        class="modal fade"
        id="cancel_item_modal"
        tabindex="-1"
        role="dialog"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                Konfirmasi Pembatalan Barang
              </h5>
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
              <p>Anda Akan Membatalkan Barang Ini, Teruskan?</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                @click="rejectItem"
              >
                <i class="fa fa-check-circle-o"></i> Ya
              </button>
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
              >
                <i class="fa fa-times-circle-o"></i> Batal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="reject_modal"
        tabindex="-1"
        role="dialog"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Konfirmasi Pembatalan Order</h5>
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
              <p>Anda Akan Membatalkan Order Ini, Teruskan?</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                @click="rejectOrder"
              >
                <i class="fa fa-check-circle-o"></i> Ya
              </button>
              <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
              >
                <i class="fa fa-times-circle-o"></i> Batal
              </button>
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
      po: {},
      paymentmethod: {},
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
      checkout: {
        note: '',
        invoice_number: '',
        invoice_date: '',
        total: '',
        payment_method_id: '',
        payment_duration: '7',
      },
      validasi: {
        po_number: '',
        po_date: '',
        supplier_id: '',
      },
      options: {
        format: 'YYYY-MM-DD',
        useCurrent: true,
        locale: 'id',
      },
      userId: '',
      itemId: '',
    }
  },
  props: ['mobile'],
  methods: {
    getPO() {
      service
        .fetchData('/api/po/show/' + this.$route.params.id)
        .then((response) => {
          this.po = response
          this.podetail = this.po.detail
          this.checkout.total = this.po.total
          if (this.podetail.length < 1) {
            this.alert.empty = true
            this.showTable = false
          } else {
            this.showTable = true
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getPaymentMethod() {
      service
        .fetchData('/api/paymentmethod')
        .then((response) => {
          this.paymentmethod = response
        })
        .catch((error) => {
          console.log(error)
        })
    },
    cetakInvoice() {
      let newWindow = window.open()
      newWindow.location = ''
    },
    toggleApprovalModal() {
      $('#approval_modal').modal('show')
    },
    toggleRejectModal() {
      $('#reject_modal').modal('show')
    },
    toggleCancelItemModal(id) {
      this.itemId = id
      $('#cancel_item_modal').modal('show')
    },
    isReject(status) {
      if (status === 2) {
        return true
      } else {
        return false
      }
    },
    generateInvoice() {
      let validasi = this.validate()
      if (validasi === true) {
        service
          .postData(
            '/api/po/generateinvoice?id=' + this.po.id,
            this.checkout,
          )
          .then((response) => {
            if (response.status === 'ok') {
              $('#approval_modal').modal('hide')
              this.$swal(
                'Berhasil!',
                'Proses Pembuatan Invoice Berhasil!',
                'success',
              )
              this.$router.push({
                name: 'poinvoice.detail',
                params: { id: response.invoice_id },
              })
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
        this.alert_modal.validate = true
        setTimeout(() => (this.alert_modal.validate = false), 5000)
      }
    },
    rejectOrder() {
      service
        .postData('/api/po/rejectpo?id=' + this.po.id)
        .then((response) => {
          if (response.status === 'ok') {
            $('#reject_modal').modal('hide')
            this.$swal(
              'Berhasil!',
              'PO Berhasil Dibatalkan!',
              'success',
            )
            setTimeout(() => this.getPO(), 1000)
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
    },
    rejectItem() {
      service
        .postData('/api/po/rejectitem?item=' + this.itemId)
        .then((response) => {
          if (response.status === 'ok') {
            $('#cancel_item_modal').modal('hide')
            this.$swal(
              'Berhasil!',
              'Proses Pembatalan Barang Berhasil!',
              'success',
            )
            setTimeout(() => this.getPO(), 1000)
          }
        })
        .catch((error) => {
          $('#cancel_item_modal').modal('hide')
          this.$swal(
            'Terjadi Kesalahan!',
            'Silahkan ulangi kembali!',
            'error',
          )
          console.log(error)
        })
    },
    validate() {
      let condition = 0
      if (this.checkout.invoice_number.length === 0) {
        this.validasi.invoice_number = true
        condition++
      } else {
        this.validasi.invoice_number = false
      }

      if (this.checkout.invoice_date.length === 0) {
        this.validasi.invoice_date = true
        condition++
      } else {
        this.validasi.invoice_date = false
      }

      if (this.checkout.payment_method_id.length === 0) {
        this.validasi.payment_method_id = true
        condition++
      } else {
        this.validasi.payment_method_id = false
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
    this.getPO()
    this.getPaymentMethod()
  },
  mounted() {
    service
      .fetchData('/api/ajax/poinvoice')
      .then((response) => {
        this.checkout.invoice_number = response
        this.isLoading = false
      })
      .catch((error) => {
        this.alert_modal.error = true
        console.log(error)
      })
  },
}
</script>
