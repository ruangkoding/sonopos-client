import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    userid: localStorage.getItem('userid'),
    role: localStorage.getItem('role'),
    businessbranch: localStorage.getItem('businessbranch'),
  },
  getters: {
    isAuth: (state) => {
      return state.token !== 'null' && state.token !== null
    },
    isAdmin: (state) => {
      return state.role !== 'null' && state.role === 'admin'
    },
    userId: (state) => {
      return state.userid !== 'null'
    },
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload
      localStorage.setItem('token', payload)
    },
    SET_USER_ID(state, payload) {
      state.userid = payload
      localStorage.setItem('userid', payload)
    },
    SET_ROLE(state, payload) {
      state.role = payload
      localStorage.setItem('role', payload)
    },
    SET_BRANCH(state, payload) {
      state.businessbranch = payload
      localStorage.setItem('businessbranch', payload)
    },
  },
})
