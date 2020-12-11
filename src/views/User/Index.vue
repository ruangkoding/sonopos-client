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
                        placeholder="Nama Pengguna"
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
              <div class="card" v-for="v in users" :key="v.id">
                <div class="card-body">
                  <table class="table-noborder">
                    <tr>
                      <td>Username</td>
                      <td>:</td>
                      <td scope="row">{{ v.username }}</td>
                    </tr>
                    <tr>
                      <td>Cabang Bisnis</td>
                      <td>:</td>
                      <td>{{ v.category.category_name }}</td>
                    </tr>
                    <tr>
                      <td>Jabatan</td>
                      <td>:</td>
                      <td>{{ v.level }}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>:</td>
                      <td>{{ v.active }}</td>
                    </tr>
                  </table>
                  <div class="summary">
                    <span class="buttons">
                      <a
                        href="#"
                        @click="toggleUpdateModal(v.id)"
                        class="btn btn-sm btn-warning mr-2">
                        <i class="fa fa-wrench"></i> Ubah
                      </a>
                      <a
                        href="#"
                        class="btn btn-sm btn-outline-danger"
                        @click="toggleModal(v.id)">
                        <i class="fa fa-trash"></i> Hapus
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="table-responsive" v-else>
              <table class="table table-hover table-striped table-bordered">
                <thead>
                  <tr>
                  <th
                    scope="col"
                    class="text-center"
                    style="width:20%;">
                    Username
                  </th>
                  <th
                    scope="col"
                    class="text-center"
                    style="width:20%;">
                    Cabang Bisnis
                  </th>
                  <th
                    scope="col"
                    class="text-center"
                    style="width:20%;">
                    Jabatan
                  </th>
                  <th
                    scope="col"
                    class="text-center"
                    style="width:20%;">
                    Status
                  </th>
                  <th
                    scope="col"
                    class="text-center"
                    style="width:20%;">
                    Tindakan
                  </th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="v in users" :key="v.id">
                    <th scope="row">{{ v.username }}</th>
                    <td>{{ v.category.category_name }}</td>
                    <td class="text-center">{{ v.level }}</td>
                    <td class="text-center">{{ v.active }}</td>
                    <td>
                      <div style="text-align: center;">
                        <a
                          href="#"
                          @click="toggleUpdateModal(v.id)"
                          class="btn btn-sm btn-warning mr-2">
                          <i class="fa fa-wrench"></i> Ubah
                        </a>
                        <a
                          href="#"
                          @click="toggleModal(v.id)"
                          class="btn btn-sm btn-danger">
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
                  <h5 class="modal-title">Tambah Pengguna</h5>
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
                        <label>Cabang Bisnis</label>
                        <select
                          v-model="payload.category_id"
                          class="form-control"
                          :class="{ 'is-invalid': validasi_create.category_id }">
                          <option value="">Pilih Cabang Bisnis</option>
                          <option
                            v-for="v in this.category"
                            :value="v.id"
                            :key="v.id">
                            {{ v.category_name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Username</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Masukkan Username"
                          v-model="payload.username"
                          :class="{ 'is-invalid': validasi_create.username }" />
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
                  <h5 class="modal-title">Ubah Pengguna</h5>
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
                        <label>Cabang Bisnis</label>
                        <select
                          v-model="user.category_id"
                          class="form-control"
                          :class="{ 'is-invalid': validasi_update.category_id }">
                          <option
                            v-for="v in this.category"
                            :value="v.id"
                            :key="v.id">
                            {{ v.category_name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="row">
                      <div class="form-group col-md-12">
                        <label>Username</label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Masukkan Username"
                          v-model="user.username"
                          :class="{ 'is-invalid': validasi_update.username }" />
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
                          class="btn btn-warning mr-2"
                          @click.prevent="resetPassword(user.id)">
                          <i class="fa fa-refresh"></i> Reset Password
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
            @delete="deleteData" />

          <div class="card-footer clearfix" v-if="showTable === true">
            <v-pagination
              :pagination="pagination"
              v-on:next="nextPage"
              v-on:previous="prevPage"
              v-if="showTable === true" />
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
        username: '',
        category_id: ''
      },
      category:{},
      users: {},
      user:{},
      validasi_create: {
        username: '',
        category_id: ''
      },
      validasi_update: {
        username: '',
        category_id: ''
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
      this.payload.username = ''
      this.payload.category_id = ''
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
      this.getCategory()
    },
    toggleUpdateModal(id) {
      $('#update_modal').modal('show')
      this.id = id
      this.getCategory()
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
            '/user?' +
            query +
            '&page=' +
            this.pagination.page)
        .then((response) => {
          if (response.total === 0) {
            this.showTable = false
            this.alert.empty = true
            this.alert.error = false
          } else {
            this.showTable = true
            this.alert.empty = false
            this.alert.error = false
            this.users = response.data
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
        .fetchData(this.$apiUrl + '/user/show/' + id)
        .then((response) => {
          this.user = response
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
        .deleteData(this.$apiUrl + '/user?id=' + id)
        .then((response) => {
          if (response.status === 'ok') {
            this.$swal(
              'Berhasil!',
              'Data Berhasil Dihapus!',
              'success',
            )
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
          .postData(this.$apiUrl + '/user', this.payload)
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
          .putData(this.$apiUrl + '/user?id=' + this.id, this.user)
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
    getCategory() {
      service
        .fetchData(this.$apiUrl + '/category?all=true')
        .then((response) => {
          this.category = response
        })
        .catch((error) => {
          console.log(error)
        })
    },
    validateCreate() {
      let condition = 0

      if (this.payload.username.length === 0) {
        this.validasi_create.username = true
        condition++
      } else {
        this.validasi_create.username = false
      }

      if (this.payload.category_id.length === 0) {
        this.validasi_create.category_id = true
        condition++
      } else {
        this.validasi_create.category_id = false
      }

      if (condition > 0) {
        return false
      } else {
        return true
      }
    },
    validateUpdate() {
      let condition = 0

      if (this.user.username.length === 0) {
        this.validasi_update.username = true
        condition++
      } else {
        this.validasi_update.username = false
      }

      if (this.user.category_id.length === 0) {
        this.validasi_update.category_id = true
        condition++
      } else {
        this.validasi_update.category_id = false
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
