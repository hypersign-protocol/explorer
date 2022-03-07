import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import config from './config';
import Vuex from "vuex";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import { faCube, faCubes, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* add icons to the library */
library.add(faCube, faCubes, faFileInvoiceDollar)

/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Vue.prototype.$gblBlocks = [];
// Vue.prototype.$gblTransactions = [];
Vue.prototype.$gblBlockHeight = 0;

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(Vuex);
Vue.prototype.$config = config;

const store = new Vuex.Store({
  state: {
    latestBlockHeight: 0,
    txEventTrigger: "",
    txCreateDIDEventTrigger: "",
  },
  mutations: {
    updateBlockHeightInStore(state, newHeight) {
      state.latestBlockHeight = newHeight;
    },
    updateTxEventTriggerInStore(state,  newTxHash) {
      state.txEventTrigger = newTxHash;
    },
    updatetxCreateDIDEventTriggerInStore(state, newCreateDidTxHash) {
      // console.log('------  updatetxCreateDIDEventTriggerInStore  ' +  newCreateDidTxHash)

      state.txCreateDIDEventTrigger = newCreateDidTxHash;
    },
  },
  // getters: {
  //   getNewHeight(state){
  //     return state.latestBlockHeight
  //   }
  // }  
});


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
