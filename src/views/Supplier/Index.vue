<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="card">
        <div class="card-header">
          <div class="pull-right">
            <button
              type="button"
              v-on:click.prevent="toggle"
              class="btn btn-info mb-2 mr-2">
              <i class="fa fa-search"></i> Form Pencarian
            </button>
            <a
              href="#"
              @click="toggleCreateModal()"
              class="btn btn-success mb-2">
              <i class="fa fa-plus"></i> Tambah Data
            </a>
          </div>
          <transition name="fade">
            <div
              class="card"
              style="margin-top:50px;"
              v-show="showForm"
            >
              <div class="card-body table-responsive">
                <form v-on:submit.prevent="fetchData()">
                  <div class="row">
                    <div class="form-group col-md-4">
                      <input
                        type="text"
                        class="form-control"
                        v-model="search.q"
                        placeholder="Nama Supplier"
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
          </transition>
        </div>
        <div class="card-body">
          <v-alert :alert="alert"></v-alert>
          <spinner :active="isLoading" />

          <!-- show data -->
          <transition name="fade" v-if="showTable === true">
            <div v-if="mobile === true">
              <div class="card" v-for="v in suppliers" :key="v.id">
                <div class="card-body">
                  <table class="table-noborder">
                    <tr>
                      <td>Nama</td>
                      <td>:</td>
                      <td>{{ v.supplier_name }}</td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td>{{ v.supplier_address }}</td>
                    </tr>
                    <tr>
                      <td>Kontak</td>
                      <td>:</td>
                      <td>{{ v.supplier_contact }}</td>
                    </tr>
                  </table>

                  <div class="summary">
                    <span class="buttons">
                      <a
                        href="#"
                        @click="toggleUpdateModal(v.id)"
                        class="btn btn-sm btn-warning mr-2"
                      >
                        <i class="fa fa-wrench"></i> Ubah
                      </a>
                      <a
                        href="#"
                        class="btn btn-sm btn-outline-danger"
                        @click="toggleModal(v.id)"
                      >
                        <i class="fa fa-trash"></i> Hapus
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-responsive" v-else>
              <table
                class="table table-hover table-striped table-bordered"
              >
                <thead>
                  <tr>
                    <th style="width:12%; text-align:center;">
                      Nama Supplier
                    </th>
                    <th style="width:10%; text-align:center;">
                      Kontak
                    </th>
                    <th style="width:20%; text-align:center;">
                      Alamat
                    </th>
                    <th style="width:10%; text-align:center;">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="v in suppliers" :key="v.id">
                    <td>{{ v.supplier_name }}</td>
                    <td>{{ v.supplier_contact }}</td>
                    <td>{{ v.supplier_address }}</td>
                    <td>
                      <div style="text-align: center;">
                        <a
                          href="#"
                          @click="toggleUpdateModal(v.id)"
                          class="btn btn-sm btn-warning mr-2"
                        >
                          <i class="fa fa-wrench"></i> Ubah
                        </a>
                        <a
                          href="#"
                          @click="toggleModal(v.id)"
                          class="btn btn-sm btn-danger"
                        >
                          <i class="fa fa-trash-o"></i> Hapus
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </transition>

          <!-- create form modal -->
          <div class="modal fade" id="create_modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Tambah Supplier</h5>
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
                  <form method="POST" v-on:submit.prevent="postData">
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Nama Supplier *</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Masukkan Nama Supplier"
                          v-model="payload.supplier_name"
                          :class="{
                            'is-invalid': validasi_create.supplier_name,
                          }"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Kontak *</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Masukkan Kontak"
                          v-model="payload.supplier_contact"
                          :class="{
                            'is-invalid': validasi_create.supplier_contact,
                          }" />
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Alamat *</label>
                        <textarea
                          class="form-control"
                          v-model="payload.supplier_address"
                          :class="{
                            'is-invalid': validasi_create.supplier_address,
                          }"></textarea>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-12">
                        <button
                          type="submit"
                          :class="{ 'btn-block': mobile === true }"
                          class="btn btn-success mr-2">
                          <i class="fa fa-save"></i> Simpan
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

          <!-- update form modal -->
          <div class="modal fade" id="update_modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Ubah Supplier</h5>
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
                  <form method="POST" v-on:submit.prevent="putData">
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Nama Supplier *</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Masukkan Nama Supplier"
                          v-model="supplier.supplier_name"
                          :class="{
                            'is-invalid': validasi_update.supplier_name,
                          }"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Kontak *</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Masukkan Kontak"
                          v-model="supplier.supplier_contact"
                          :class="{
                            'is-invalid': validasi_update.supplier_contact,
                          }" />
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Alamat *</label>
                        <textarea
                          class="form-control"
                          v-model="supplier.supplier_address"
                          :class="{
                            'is-invalid': validasi_update.supplier_address,
                          }"></textarea>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-12">
                        <button
                          type="submit"
                          :class="{ 'btn-block': mobile === true }"
                          class="btn btn-success mr-2">
                          <i class="fa fa-save"></i> Simpan
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

          <!-- delete modal -->
          <v-delete
            :element="'delete_modal'"
            :id="id"
            @delete="deleteData"
          />

          <div class="card-footer clearfix" v-if="showTable === true">
            <v-pagination
              :pagination="pagination"
              v-on:next="nextPage"
              v-on:previous="prevPage"
              v-if="showTable === true" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from './../../services.js'
import { isMobile } from 'mobile-device-detect'
export default {
  data() {
    return {
      payload: {
        supplier_name: '',
        supplier_contact: '',
        supplier_address: '',
      },
      suppliers: {},
      supplier:{},
      validasi_create: {
        supplier_name: '',
        supplier_contact: '',
        supplier_address: '',
      },
      validasi_update: {
        supplier_name: '',
        supplier_contact: '',
        supplier_address: '',
      },
      alert: {
        error: false,
        save: false,
        duplicate: false,
        empty: false,
        delete: false,
      },
      alert_modal: {
        validate: false,
      },
      isLoading: false,
      search: {
        q: '',
      },
      pagination: {
        page: 1,
        last: 0,
        total: 0,
        to: 0,
        from: 0,
      },
      showForm: false,
      showTable: false,
      id: '',
      mobile: false,
    }
  },
  methods: {
    reset() {
      this.payload.supplier_name = ''
      this.payload.supplier_contact = ''
      this.payload.supplier_address = ''
    },
    clearAlert() {
      this.alert.error = false
      this.alert.save = false
      this.alert.duplicate = false
      this.alert.validate = false
      this.alert_modal.validate = false;
    },
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
    toggleModal(id) {
      $('#delete_modal').modal('show')
      this.id = id
    },
    toggleCreateModal() {
      $('#create_modal').modal('show')
    },
    toggleUpdateModal(id) {
      $('#update_modal').modal('show')
      this.id = id
      this.getData(id)
    },
    generateParams() {
      return Object.keys(this.search)
        .map((key) => key + '=' + this.search[key])
        .join('&')
    },
    fetchData() {
      let query = this.generateParams()
      service
        .fetchData(
          this.$apiUrl +
            '/supplier?' +
            query +
            '&page=' +
            this.pagination.page,
        )
        .then((response) => {
          if (response.total === 0) {
            this.showTable = false
            this.alert.empty = true
            this.alert.error = false
          } else {
            this.showTable = true
            this.alert.empty = false
            this.alert.error = false
            this.suppliers = response.data
            this.pagination.last = response.last_page
            this.pagination.from = response.from
            this.pagination.to = response.to
            this.pagination.total = response.total
          }
          this.isLoading = false
        })
        .catch((error) => {
          this.alert.error = true
          console.log(error)
        })
    },
    getData(id) {
      service
        .fetchData(this.$apiUrl + '/supplier/' + id)
        .then((response) => {
          this.supplier = response
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
    deleteData(id) {
      service
        .deleteData(this.$apiUrl + '/supplier?id=' + id)
        .then((response) => {
          if (response.status === 'ok') {
            this.$swal(
              'Berhasil!',
              'Data Berhasil Dihapus!',
              'success',
            )
            // eslint-disable-next-line no-undef
            $('#delete_modal').modal('hide')
            this.fetchData()
          }
        })
        .catch((error) => {
          this.isLoading = false
          this.$swal(
            'Terjadi Kesalahan!',
            'Silahkan Ulangi Kembali!',
            'error',
          )
          // eslint-disable-next-line no-undef
          $('#delete_modal').modal('hide')
          this.fetchData()
          console.log(error)
        })
    },
    postData(evt) {
      evt.preventDefault()
      this.clearAlert()
      let validate = this.validateCreate()
      if (validate === true) {
        this.isLoading = true
        service
          .postData(this.$apiUrl + '/supplier', this.payload)
          .then((result) => {
            setTimeout(() => { this.isLoading = false }, 1000)
            if (result.status === 'ok') {
              this.$swal(
                'Berhasil!', 
                'Data Berhasil Disimpan!', 
                'success'
              )
              $('#create_modal').modal('hide')
              this.reset()
              this.fetchData()
            } else if (result.status === 'duplicate') {
              this.$swal(
                'Duplikat!',
                'Data Yang Sama Sudah Disimpan Sebelumnya!',
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
        this.alert_modal.validate = true
        setTimeout(() => (this.alert_modal.validate = false), 3000)
      }
    },
    putData(evt) {
      evt.preventDefault()
      this.clearAlert()
      let validate = this.validateUpdate()
      if (validate === true) {
        this.isLoading = true
        service
          .putData(this.$apiUrl + '/supplier?id=' + this.id, this.supplier)
          .then((result) => {
            setTimeout(() => { this.isLoading = false }, 1000)
            if (result.status === 'ok') {
              this.$swal(
                'Berhasil!', 
                'Data Berhasil Diubah!', 
                'success'
              )
              $('#update_modal').modal('hide')
              this.fetchData()
            } else if (result.status === 'duplicate') {
              this.$swal(
                'Duplikat!',
                'Data Yang Sama Sudah Disimpan Sebelumnya!',
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
        this.alert_modal.validate = true
        setTimeout(() => (this.alert_modal.validate = false), 3000)
      }
    },
    validateCreate() {
      let condition = 0

      if (this.payload.supplier_name.length === 0) {
        this.validasi.supplier_name = true
        condition++
      } else {
        this.validasi.supplier_name = false
      }

      if (this.payload.supplier_contact.length === 0) {
        this.validasi.supplier_contact = true
        condition++
      } else {
        this.validasi.supplier_contact = false
      }

      if (this.payload.supplier_address.length === 0) {
        this.validasi.supplier_address = true
        condition++
      } else {
        this.validasi.supplier_address = false
      }

      if (condition > 0) {
        return false
      } else {
        return true
      }
    },
    validateUpdate() {
      let condition = 0

      if (this.supplier.supplier_name.length === 0) {
        this.validasi_update.supplier_name = true
        condition++
      } else {
        this.validasi_update.supplier_name = false
      }

      if (this.supplier.supplier_contact.length === 0) {
        this.validasi_update.supplier_contact = true
        condition++
      } else {
        this.validasi_update.supplier_contact = false
      }

      if (this.supplier.supplier_address.length === 0) {
        this.validasi_update.supplier_address = true
        condition++
      } else {
        this.validasi_update.supplier_address = false
      }

      if (condition > 0) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    this.isLoading = true
    if (isMobile) {
      this.mobile = true
    }
  },
  mounted() {
    this.fetchData()
  },
}
</script>
