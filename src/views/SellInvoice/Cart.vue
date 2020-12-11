<template>
  <div class="card">
    <div class="card-header">
      <div class="pull-right">
        <a
          href="#"
          :class="{ 'btn-block': mobile === true }"
          @click="toggleCartModal"
          class="btn btn-success mb-2">
          <i class="fa fa-plus"></i> Tambah Barang Ke Keranjang
        </a>
      </div>
    </div>
    <div class="card-body">
      <v-alert :alert="alert_page"></v-alert>
      <spinner :active="isLoading"></spinner>

      <!-- cart table -->
      <transition name="fade" v-if="showTable == true">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead class="thead-dark">
              <tr>
                <th
                  scope="col"
                  class="text-center"
                  style="width:30%;">
                  Barang
                </th>
                <th
                  scope="col"
                  class="text-center"
                  style="width:10%;">
                  Harga
                </th>
                <th scope="col" class="text-center" style="width:5%;">
                  Jumlah
                </th>
                <th
                  scope="col"
                  class="text-center"
                  style="width:10%;">
                  Subtotal
                </th>
                <th scope="col" class="text-center" style="width:5%;">
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in cart" :key="v.id">
                <td scope="col">{{ v.item.item_name }}</td>
                <td scope="col" style="text-align:right;">
                  {{ v.price | rupiah }}
                </td>
                <td scope="col" style="text-align:center;">
                  {{ v.quantity }} {{ v.item.unit.unit_name }}
                </td>
                <td scope="col" style="text-align:right;">
                  {{ v.subtotal | rupiah }}
                </td>
                <td scope="col">
                  <div style="text-align: center;">
                    <a
                      href="#"
                      @click="toggleModal(v.id)"
                      class="btn btn-xs btn-danger">
                      <i class="fa fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="text-align:right;">
                  <b>Total Harga</b>
                </td>
                <td style="text-align:right;">
                  <b>{{ totalHarga | rupiah }}</b>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>

      <!-- checkout button -->
      <span v-if="showTable == true">
        <a
          href="#"
          :class="{ 'btn-block': mobile === true }"
          @click="toggleCheckoutModal"
          class="btn btn-warning mr-2">
          <i class="fa fa-shopping-cart"></i> Buat Invoice
        </a>
        <router-link
          :to="{ name: 'sell.index' }"
          class="btn btn-secondary"
          :class="{ 'btn-block': mobile === true }">
          <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
      </span>
      <span v-else>
        <router-link
          :to="{ name: 'sell.index' }"
          class="btn btn-secondary"
          :class="{ 'btn-block': mobile === true }">
          <i class="fa fa-arrow-left"></i> Kembali
        </router-link>
      </span>

      <!-- delete item from cart -->
      <v-delete
        :element="'delete_modal'"
        :id="id"
        @delete="deleteData" />

      <!-- checkout form modal -->
      <div
        class="modal fade"
        id="checkout_modal"
        tabindex="-1"
        role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Form Invoice</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <v-alert :alert="alert_modal"></v-alert>
              <form method="POST">
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Buat SO</label>
                    <select
                      v-model="checkout.is_so"
                      class="form-control">
                      <option value='0'>Tidak</option>
                      <option value='1'>Ya</option>
                    </select>
                  </div>
                </div>
                <div class="row" v-if="checkout.is_so === '1'">
                  <div class="form-group col-md-12">
                    <label>Nomor SO</label>
                    <input
                      readonly="readonly"
                      class="form-control"
                      placeholder="Masukkan Nomor so"
                      v-model="checkout.so_number"
                      :class="{
                        'is-invalid': validasi_checkout.so_number,
                      }" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Nomor Invoice</label>
                    <input
                      readonly="readonly"
                      class="form-control"
                      placeholder="Masukkan Nomor Invoice"
                      v-model="checkout.invoice_number"
                      :class="{
                        'is-invalid': validasi_checkout.invoice_number,
                      }" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label for="tanggal">Tanggal</label>
                    <input
                      autocomplete="off"
                      type="date"
                      class="form-control"
                      placeholder="Tanggal Transaksi"
                      v-model="checkout.invoice_date"
                      :class="{
                        'is-invalid': validasi_checkout.invoice_date,
                      }" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Konsumen</label>
                    <select
                      v-model="checkout.customer_id"
                      class="form-control"
                      :class="{
                        'is-invalid': validasi_checkout.customer_id }">
                      <option value="">Pilih Supplier</option>
                      <option
                        v-for="v in this.customer"
                        :value="v.id"
                        :key="v.id">
                        {{ v.customer_name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Total Harga</label>
                    <money
                      class="form-control"
                      readonly="readonly"
                      v-model="totalHarga" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <label>Metode Pembayaran *</label>
                    <select 
                      v-model="checkout.payment_method_id" 
                      class="form-control">
                      <option value="1">Tunai</option>
                      <option value="2">Kredit</option>
                    </select>
                  </div>
                </div>
                <div class="row" v-if="checkout.payment_method_id === '2'">
                  <div class="form-group col-md-12">
                    <label>Durasi Pembayaran *</label>
                    <select v-model="checkout.payment_duration" class="form-control">
                      <option value="7" selected>7 Hari Kerja</option>
                      <option value="14">14 Hari Kerja</option>
                      <option value="30">30 Hari Kerja</option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-md-12">
                    <button
                      type="button"
                      :class="{ 'btn-block': mobile === true }"
                      class="btn btn-success mr-2"
                      @click.prevent="checkOutCart()">
                      <i class="fa fa-shopping-cart"></i>
                      Selesaikan Order
                    </button>
                    <button
                      type="button"
                      :class="{ 'btn-block': mobile === true }"
                      class="btn btn-danger"
                      data-dismiss="modal">
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

      <!-- cart form modal -->
      <div
        class="modal fade"
        id="cart_modal"
        tabindex="-1"
        role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Form Keranjang Belanja</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <v-alert :alert="alert_cart"></v-alert>
              <form method="POST">
                <div class="row">
                  <div class="form-group col-12">
                    <label>Barang</label>
                    <select
                      v-model="cartitem.item_id"
                      class="form-control"
                      :class="{ 'is-invalid': validasi_cart.item_id }">
                      <option value="">Pilih Barang</option>
                      <option
                        v-for="v in this.item"
                        :value="v.id"
                        :key="v.id">
                        {{ v.item_name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-12">
                    <label>Harga Satuan</label>
                    <money
                      class="form-control"
                      placeholder="Masukkan Harga"
                      @input="calcTotal"
                      v-model="cartitem.price"
                      :class="{ 'is-invalid': validasi_cart.price }" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-12">
                    <label>Jumlah</label>
                    <input
                      type="number"
                      class="form-control"
                      placeholder="Masukkan Jumlah Pembelian"
                      @input="calcTotal"
                      v-model="cartitem.quantity"
                      :class="{
                        'is-invalid': validasi_cart.quantity,
                      }" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-12">
                    <label>Total Harga *</label>
                    <money
                      class="form-control"
                      readonly="readonly"
                      v-model="cartitem.subtotal" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-12">
                    <button
                      type="button"
                      :class="{ 'btn-block': mobile === true }"
                      class="btn btn-success mr-2"
                      @click.prevent="addCartItem()">
                      <i class="fa fa-save"></i> Simpan Data
                    </button>
                    <button
                      type="button"
                      :class="{ 'btn-block': mobile === true }"
                      class="btn btn-danger"
                      data-dismiss="modal">
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
</template>
<script>
import service from './../../services.js'
export default {
  data: function() {
    return {
      cart: {},
      customer: {},
      item: {},
      cartitem: {
        item_id: '',
        quantity: '',
        price: '',
        subtotal: '',
      },
      checkout: {
        is_so: 0,
        customer_id: '',
        so_number: '',
        invoice_number: '',
        invoice_date: '',
        total: '',
        payment_method_id:'1',
        payment_duration:'7'
      },
      validasi_cart: {
        item_id: '',
        quantity: '',
        price: '',
      },
      validasi_checkout: {
        invoice_number: '',
        invoice_date: '',
        customer_id: ''
      },
      alert_page: {
        error: false,
        empty: false,
        delete: false,
        checkout: false,
      },
      alert_modal: {
        error: false,
        validate: false,
      },
      alert_cart: {
        error: false,
        save: false,
        duplicate: false,
        validate: false,
      },
      isLoading: false,
      showForm: false,
      showTable: false,
      id: '',
      totalHarga: 0,
      userId: '',
    }
  },
  methods: {
    calcChanges() {
      if (this.checkout.paytotal > 0) {
        this.checkout.changes =
          this.checkout.paytotal - this.totalHarga
      }
    },
    toggleModal(id) {
      $('#delete_modal').modal('show')
      this.id = id
    },
    toggleCheckoutModal() {
      $('#checkout_modal').modal('show')
    },
    toggleCartModal() {
      $('#cart_modal').modal('show')
    },
    fetchData() {
      service
        .fetchData(this.$apiUrl + '/order/sell/cart?user=' + this.userid)
        .then((response) => {
          this.totalHarga = 0
          if (response.length === 0) {
            this.showTable = false
            this.alert_page.empty = true
            this.alert_page.error = false
          } else {
            this.showTable = true
            this.alert_page.empty = false
            this.alert_page.error = false
            this.cart = response
            if (this.cart.length > 0) {
              for (let i = 0; i < this.cart.length; i++) {
                this.totalHarga += this.cart[i].subtotal
              }
            }
          }
          this.isLoading = false
        })
        .catch((error) => {
          this.alert.error = true
          console.log(error)
        })
    },
    clearAlert() {
      this.alert.error = false
      this.alert.save = false
      this.alert.duplicate = false
      this.alert.validate = false
    },
    clearCartAlert() {
      this.alert_cart.error = false
      this.alert_cart.save = false
      this.alert_cart.duplicate = false
      this.alert_cart.validate = false
    },
    deleteData(id) {
      service
        .deleteData(this.$apiUrl + '/order/sell/cart?id=' + id)
        .then((response) => {
          if (response.status === 'ok') {
            this.$swal(
              'Berhasil!',
              'Barang Berhasil Dihapus Dari Keranjang!',
              'success',
            )
            $('#delete_modal').modal('hide')
            setTimeout(() => this.fetchData(), 1000)
          }
        })
        .catch((error) => {
          $('#delete_modal').modal('hide')
          this.$swal(
            'Terjadi Kesalahan!',
            'Silahkan ulangi kembali!',
            'error',
          )
          setTimeout(() => this.fetchData(), 1000)
          console.log(error)
        })
    },
    checkOutCart() {
      let validasi_checkout = this.validate_checkout()
      if (validasi_checkout === true) {
        this.checkout.total = this.totalHarga
        service
          .postData(this.$apiUrl + '/order/sell?user=' + this.userid, this.checkout)
          .then((response) => {
            if (response.status === 'ok') {
              $('#checkout_modal').modal('hide')
              this.$swal(
                'Berhasil!',
                'Proses Pembuatan Order Berhasil!',
                'success',
              )
              this.$router.push({
                name: 'sell.detail',
                params: { id: response.data },
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
        setTimeout(() => (this.alert_modal.validate = false), 3000)
      }
    },
    addCartItem() {
      this.clearCartAlert()
      let validasi_cart = this.validate_cart()
      if (validasi_cart === true) {
        this.isLoading = true
        service
          .postData(this.$apiUrl + '/order/sell/cart?user=' + this.userid, this.cartitem)
          .then((result) => {
            setTimeout(() => {
              this.isLoading = false
            }, 1000)
            if (result.status === 'ok') {
              this.resetCart()
              $('#cart_modal').modal('hide')
              this.$swal(
                'Berhasil!',
                'Barang Berhasil Dimasukan Ke Keranjang!',
                'success',
              )
              setTimeout(() => this.fetchData(), 1000)
            } else if (result.status === 'duplicate') {
              this.$swal(
                'Terduplikasi!',
                'Data Yang Sama Sudah Tersimpan Dalam Record Sebelumnya!',
                'warning',
              )
            }
          })
          .catch((error) => {
            this.isLoading = false
            this.$swal(
              'Terjadi Kesalahan!',
              'Silahkan Ulangi Kembali!',
              'error',
            )
            console.log(error)
          })
      } else {
        this.alert_cart.validate = true
        setTimeout(() => (this.alert_cart.validate = false), 3000)
      }
    },
    validate_checkout() {
      let condition = 0
      if (this.checkout.customer_id.length === 0) {
        this.validasi_checkout.customer_id = true
        condition++
      } else {
        this.validasi_checkout.customer_id = false
      }

      if (this.checkout.invoice_number.length === 0) {
        this.validasi_checkout.invoice_number = true
        condition++
      } else {
        this.validasi_checkout.invoice_number = false
      }

      if (this.checkout.invoice_date.length === 0) {
        this.validasi_checkout.invoice_date = true
        condition++
      } else {
        this.validasi_checkout.invoice_date = false
      }

      if (condition > 0) {
        return false
      } else {
        return true
      }
    },
    validate_cart() {
      let condition = 0
      if (this.cartitem.item_id.length === 0) {
        this.validasi_cart.item_id = true
        condition++
      } else {
        this.validasi_cart.item_id = false
      }

      if (this.cartitem.quantity.length === 0) {
        this.validasi_cart.quantity = true
        condition++
      } else {
        this.validasi_cart.quantity = false
      }

      if (this.cartitem.price.length === 0) {
        this.validasi_cart.price = true
        condition++
      } else {
        this.validasi_cart.price = false
      }

      if (condition > 0) {
        return false
      } else {
        return true
      }
    },
    calcTotal() {
      this.cartitem.subtotal =
        this.cartitem.price * this.cartitem.quantity
    },
    resetCart() {
      this.cartitem.item_id = ''
      this.cartitem.quantity = ''
      this.cartitem.price = ''
      this.cartitem.subtotal = ''
    },
    getSupplier() {
      service
        .fetchData(this.$apiUrl + '/customer?all=true')
        .then((response) => {
          this.customer = response
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getItem() {
      service
        .fetchData(this.$apiUrl + '/item?all=true&category=' + this.branch)
        .then((response) => {
          this.item = response
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
  computed: {
    userid() {
      return this.$store.state.userid
    },
    branch() {
      return this.$store.state.businessbranch
    }
  },
  created() {
    this.isLoading = true
    this.getItem()
    this.getSupplier()
    this.fetchData()
  },
  mounted() {
    service
      .fetchData(this.$apiUrl + '/ajax/sonumber')
      .then((response) => {
        this.checkout.so_number = response
      })
      .catch((error) => {
        this.alert_modal.error = true
        console.log(error)
      })

    service
      .fetchData(this.$apiUrl + '/ajax/soinvoice')
      .then((response) => {
        this.checkout.invoice_number = response
      })
      .catch((error) => {
        this.alert_modal.error = true
        console.log(error)
      })
  },
}
</script>
