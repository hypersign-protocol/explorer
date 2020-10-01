import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import RegisterDid from './views/RegisterDId.vue';

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
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    const authToken = localStorage.getItem('authToken')
    if(authToken){
      const url = `http://${location.hostname}:5000/api/auth/verify`
      fetch(url,{
        headers: {
          'x-auth-token': authToken
        },
        method: 'POST'
      }).then(res => res.json())
      .then(json => {
        if(json.status == 403){
          next({
            path: '/dashboard/login',
            params: { nextUrl:  to.fullPath}
          })  
        }else{
          next()
        }
      })
      .catch((e)=> {
        next({
          path: '/dashboard/login',
          params: { nextUrl:  to.fullPath}
        })
      })
    }else{
      next()
    }
  }else{
    next()
  }
})
export default router
