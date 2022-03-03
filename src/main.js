import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import config from './config'

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

Vue.prototype.$gblBlocks = [];
Vue.prototype.$gblTransactions = [];
Vue.prototype.$gblBlockHeight = 0;

Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.prototype.$config = config
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
