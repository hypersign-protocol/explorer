import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/Dashboard';
import BlockList from './views/BlockList';
import TransactionList from './views/TransactionList';
import Test from './views/Test';
import TxDetails from './views/TransactionDetails'
import DIDs from './views/DIDs'
import AccountDetails from './views/AccountDetails';
import ValidatorList from './views/ValidatorList';


Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [{
            path: '/explorer',
            redirect: '/explorer/dashboard',
            mode: 'hash'
        },
        {
            path: '/',
            redirect: '/explorer/dashboard',
            mode: 'hash'
        },
        {
            path: '/explorer/dashboard',
            name: "Dashboard",
            component: Dashboard,
            mode: 'hash'
        },
        {
            path: '/explorer/blocks',
            name: "BlockList",
            component: BlockList,
            mode: 'hash'
        },
        {
            path: '/explorer/transactions',
            name: "TransactionList",
            component: TransactionList,
            mode: 'hash'
        },
        {
            path: '/explorer/blockdetails',
            name: "BlockDet",
            component: Test,
            mode: 'hash'
        },
        {
            path: '/explorer/txdetails',
            name: "TxDetails",
            component: TxDetails,
            mode: 'hash'
        },
        {
            path: '/explorer/dids',
            name: "Dids",
            component: DIDs,
            mode: 'hash'
        },
        {
            path: '/explorer/account/:accountId',
            name: "Account Details",
            component: AccountDetails,
            mode: 'hash'
        },
        {
            path: '/explorer/validators',
            name: "Validators",
            component: ValidatorList,
            mode: 'hash'
        },
    ]
})

// router.beforeEach((to, from, next) => {
//     // Redirect if fullPath begins with a hash (ignore hashes later in path)
//     if (to.fullPath.substr(0, 2) === "/#") {
//         const path = to.fullPath.substr(2);
//         next(path);
//         return;
//     }
//     next();
// });

export default router