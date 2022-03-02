import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import RegisterDid from './views/RegisterDId.vue';
import Dashboard  from './views/Dashboard';

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/explorer',
      redirect: '/explorer/home'
    },
    {
      path: '/explorer/newdid',
      name: 'newdid',
      component: RegisterDid
    },
    {
      path: '/explorer/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/dashboard',
      name: "Dashboard",
      component: Dashboard
    }
  ]
})

// router.beforeEach((to, from, next) => {
 
// })

export default router
