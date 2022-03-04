import Vue from 'vue';
import Router from 'vue-router';
import Dashboard  from './views/Dashboard';
import BlockList from './views/BlockList';
import TransactionList from './views/TransactionList';
import Test from './views/Test';
import TxDetails from './views/TransactionDetails'
import DIDs from './views/DIDs'


Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'dashboard'
    },
    {
      path: '/dashboard',
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: '/blocks',
      name: "BlockList",
      component: BlockList
    },
    {
      path: '/transactions',
      name: "TransactionList",
      component: TransactionList
    },
    {
      path: '/blockdetails',
      name: "BlockDet",
      component: Test
    },
    {
      path: '/txdetails',
      name: "TxDetails",
      component: TxDetails
    },
    {
      path: '/dids',
      name: "Dids",
      component: DIDs
    },
  ]
})

// router.beforeEach((to, from, next) => {
 
// })

export default router
