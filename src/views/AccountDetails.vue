<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}
</style>
<template>
    <div class="body">
        <div class="row">
            <div class="col-md-12">
                <h3> Account Details </h3>
            </div>
        </div>
        <div class="row" style="text-align: left;">
            <h5>Account: {{ accountId }}</h5>
        </div>
        <div class="row" style="text-align: left;" v-for="balance in balances" v-bind="balance">
            <div class="col-md-12">
                <ul class="list-group">
                    <li class="list-group-item"><b>Tokens :</b> {{ balance.denom }} </li>
                    <li class="list-group-item"><b>Balance:</b> {{ balance.amount }} </li>
                </ul>
            </div>
        </div>

        <div class="row" style="margin-top:2%; text-align: left;font-size:small">
            <h5>
                <font-awesome-icon icon="fa-solid fa-file-invoice-dollar" /> Transactions ({{
                this.transactions.length }})
            </h5>
            <div class="col-md-12" v-if="this.transactions.length > 0">
                <div class="col-md-12">
                    <table class="table table-striped table-bordered table-sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Block</th>
                                <th>Hash</th>
                                <th>Time (UTC)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tx in this.transactions">
                                <td v-if="tx.type === 'IN'"><span class='badge badge-pill badge-success'>IN</span>
                                </td>
                                <td v-if="tx.type === 'OUT'"><span class='badge badge-pill badge-danger'>OUT</span>
                                </td>

                                <td><a :href='`/explorer/blockdetails?height=${tx.height}`'> {{ tx.height}}</a></td>
                                <td>
                                    <a :href='`/explorer/txdetails?hash=0x${tx.txhash}`'>0x{{ (tx.txhash)}}</a>
                                </td>
                                <td>{{ formatdate(tx.timestamp)}}</td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    </div>
</template>


<script>
import { formatDate } from '../utils/others'

export default {
    name: 'Test',
    data() {
        return {
            accountId:"hid1307cjccpulp88cqu5tfnzl25ssv7csyqt7vwqm",
            exponent: 10000000, // 1 million,
            transactions: [],
            balances:[],
            badges: {
                IN: "success",
                OUT: "danger",
            }  
        }
    },
    async created() {
        console.log('Inside accountDetails test page')
        const { accountId } = this.$route.params;
        if(!accountId){
            console.error('accountId is not passed')
            return;
        }
        this.accountId = accountId;
        this.getBalance()
        this.fetchWalletTxs();
    },
    methods: {
         async getBalance(){
            const api  = `${this.$config.hid.HID_NODE_REST_EP}/cosmos/bank/v1beta1/balances/${this.accountId}`;
            const res =  await fetch(api)
            const json = await res.json();
            
            const { balances } = json;
            this.balances = balances
        },

        async fetchOutTxs(){

            const txListHeSentURL = `${this.$config.hid.HID_NODE_REST_EP}/cosmos/tx/v1beta1/txs?events=message.sender='${this.accountId}'`

            const res = await fetch(txListHeSentURL)
            const json = await res.json();
            const { tx_responses } = json;
            tx_responses.map(x => {
                return x['type'] = 'OUT'
            })


            return tx_responses;
        },

        formatdate(date){
            return formatDate(date)
        },

        async fetchInTxs() {


            const txListHeReceivedURL = `${this.$config.hid.HID_NODE_REST_EP}/cosmos/tx/v1beta1/txs?events=transfer.recipient='${this.accountId}'` 

            const res = await fetch(txListHeReceivedURL)
            const json = await res.json();
            const { tx_responses } = json;
            tx_responses.map(x => {
                return x['type'] = 'IN'
            })


            return tx_responses;

        },

        async fetchWalletTxs(){  
            const outTxs = this.fetchOutTxs()
            const inTxs = this.fetchInTxs()
            const results = await Promise.all([inTxs, outTxs])

            console.log(results);
            this.transactions = results[0].concat(results[1]);
        }
    }

}
</script>