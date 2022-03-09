import Vue from 'vue';
import Router from 'vue-router';
import Dashboard  from './views/Dashboard';
import BlockList from './views/BlockList';
import TransactionList from './views/TransactionList';
import Test from './views/Test';
import TxDetails from './views/TransactionDetails'
import DIDs from './views/DIDs'
import AccountDetails from './views/AccountDetails';
import ValidatorList from './views/ValidatorList';


Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/explorer',
      redirect: '/explorer/dashboard'
    },
    {
      path: '/',
      redirect: '/explorer/dashboard'
    },
    {
      path: '/explorer/dashboard',
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: '/explorer/blocks',
      name: "BlockList",
      component: BlockList
    },
    {
      path: '/explorer/transactions',
      name: "TransactionList",
      component: TransactionList
    },
    {
      path: '/explorer/blockdetails',
      name: "BlockDet",
      component: Test
    },
    {
      path: '/explorer/txdetails',
      name: "TxDetails",
      component: TxDetails
    },
    {
      path: '/explorer/dids',
      name: "Dids",
      component: DIDs
    },
    {
      path: '/explorer/account/:accountId',
      name: "Account Details",
      component: AccountDetails
    },
    {
      path: '/explorer/validators',
      name: "Validators",
      component: ValidatorList
    },
  ]
})

// router.beforeEach((to, from, next) => {
 
// })

export default router
