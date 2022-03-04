<template>
    <div>
        <table class="table  table-striped table-bordered table-sm">
            <tr>
                <th>Block</th>
                <th>Hash</th>
                <th>Result</th>
                <th>Time</th>
            </tr>
            <tr v-for="t in transactionList" v-bind="t.height">
                <td><a :href='`/blockdetails?height=${t.height}`'>{{t.height}}</a></td>
                <!-- TODO -->
                <td><a :href='`/txdetails?hash=0x${t.hash}`'>0x{{shorten(t.hash)}}</a></td>
                
                
                <td v-if="t.tx_result.code == 0">
                    <span class="badge badge-success">SUCCESS</span>
                </td>
                <td v-else>
                    <span class="badge badge-danger">FAIL</span>
                </td>
                <td>{{getTimestampFromBlock(t.height)}}</td>
            </tr>
        </table>
    </div>

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: "Transactions",
    data() {
        return {
            transactionList: [],
            timestamp: ""
        }
    },
    props: ['latestBlockHeight'],
    watch: {
        latestBlockHeight() { 
            this.getTop10Transactions();
        }
    }, 
    
    methods: {
        async getTop10Transactions(){
            if(!this.latestBlockHeight && this.latestBlockHeight !== 'undefined'){
                return
            }
            const transaction_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/tx_search?query="tx.height<${this.latestBlockHeight}"&prove=true&page=1&per_page=10&order_by="desc"`;
            const res =  await fetch(transaction_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            const { txs } = result;
            this.transactionList = txs;
        },

        checkTxStatus(code) {
            if (code !== 0) {
                return "Fail"
            }
            return "Success"
        },

        async getTimestampFromBlock(height) {
            const block_detailAPI = `${this.$config.hid.HID_NODE_RPC_EP}/block?height=${height}`;
            const res = await fetch(block_detailAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            console.log(result)
            const { block } = result;
            const timestamp = block.header.time;

            const d =  new Date(timestamp);
            return d.getTime();
        },
        shorten(str){
            if(str.length <= 4){
                return str
            }

            const f = str.substr(0,4)
            const m = "..."
            const l = str.substr(str.length - 4, 4);
            return f+m+l;
        }
    }
})
</script>
