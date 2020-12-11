<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card-group">
          <div class="card login-box">
            <div class="card-body">
              <spinner :active="isLoading" />
              <div class="login-logo">
                <img :src='baseDir + "img/logo.png"' width="100%;" />
              </div>
              <transition name="fade">
                <form v-on:submit.prevent="postLogin" method="post">
                  <div class="input-group mb-4">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="fa fa-user"></i>
                      </span>
                    </div>
                    <input
                      class="form-control"
                      type="text"
                      v-model="userlogin.username"
                      placeholder="Username"
                      required />
                  </div>
                  <div class="input-group mb-4">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="fa fa-lock"></i>
                      </span>
                    </div>
                    <input
                      class="form-control"
                      v-model="userlogin.password"
                      type="password"
                      placeholder="Password"
                      required />
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <button class="btn btn-block btn-success px-4" type="submit" disabled v-if="isRequesting">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="sr-only">Loading...</span>
                      </button>
                      <button
                        v-else
                        class="btn btn-block btn-success px-4"
                        type="submit">
                        Login
                      </button>
                      <div
                        class="text-center"
                        v-if="login !== '' && login === 'notfound'"
                        style="margin-top:25px;">
                        <div class="alert alert-danger">Username / Password Salah!</div>
                      </div>
                      <div
                        class="text-center"
                        v-if="login !== '' && login === 'inactive'"
                        style="margin-top:25px;">
                        <div class="alert alert-danger">Status User Tidak Aktif!</div>
                      </div>
                      <div
                        class="text-center"
                        v-if="login !== '' && login === 'error'"
                        style="margin-top:25px;">
                        <div class="alert alert-danger">Terjadi Kesalahan!</div>
                      </div>
                    </div>
                  </div>
                </form>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from './../services.js'
export default {
  data: function() {
    return {
      userlogin: {
        username: '',
        password: '',
      },
      login: '',
      form: '',
      isLoading: false,
      isRequesting: false,
      baseDir: this.$baseDir
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuth
    },
  },
  methods: {
    postLogin() {
      this.login = ''
      this.isRequesting = true
      service
        .postData(this.$apiUrl + '/login', this.userlogin)
        .then((result) => {
          if (result.status === 'success') {
            this.$store.commit('SET_TOKEN', result.data.token, { root: true })
            this.$store.commit('SET_USER_ID', result.data.id, { root: true })
            this.$store.commit('SET_ROLE', result.data.role, { root: true })
            this.$store.commit('SET_BRANCH', result.data.category_id, { root: true })
          } else if (result.status === 'inactive') {
            this.login = 'inactive'
          } else if (result.status === 'failed') {
            this.login = 'notfound'
          }
          this.isRequesting = false
          if (this.isAuth) {
            this.$router.go({ name: 'dashboard' })
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
  },
  created() {
    if (this.isAuth) {
      this.$router.push({ name: 'dashboard' })
    }
    this.isLoading = true
  },
  mounted() {
    this.isLoading = false
  },
}
</script>
