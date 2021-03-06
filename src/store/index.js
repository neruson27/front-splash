import Vue from "vue";
import Vuex from "vuex";
import config from "@/config";
import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";
import { ShoppingCartModule } from "./cart";

Vue.use(Vuex);

let userVoid = {
  id: "",
  fullName: "",
  isAuthenticated: false,
  email: ""
};

export default new Vuex.Store({
  modules: {
    store: ShoppingCartModule
  },
  state: {
    id_buyer: "",
    user: {
      id: "",
      fullName: "",
      isAuthenticated: false,
      email: ""
    },
    url_base: config.api.url,
    checkout: {
      name: '',
      dni: '',
      concept: '',
      total: '',
      tlf: '',
      city: '',
      dir: '',
      email: '',
    }
  },
  mutations: {
    createSessionUserId(state) {
      state.id_buyer = String(Date.now())
      console.log(state)
    },
    setUser(state, user) {
      state.user = user;
    },
    setCheckout(state, checkout) {
      state.checkout = checkout
    },
    setFullName(state, fullName) {
      state.user.fullName = fullName;
    },
    setAuthenticated(state, authenticate) {
      state.user.isAuthenticated = authenticate;
    },
    emptyCheckout(state) {
      state.checkout = {
        name: '',
        dni: '',
        concept: '',
        total: '',
        tlf: '',
        city: '',
        dir: '',
        email: ''
      }
    },
    logout(state) {
      state.user = userVoid;
    }
  },
  getters: {
    authenticate: state => {
      return state.user.isAuthenticated
    } 
  },
  strict: process.env.NODE_ENV !== 'production',
  plugins: [createPersistedState(),],
});
