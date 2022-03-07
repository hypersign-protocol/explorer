<template>
    <div>
        <table class="table  table-striped table-bordered table-sm">
            <tr>
                <th>Block</th>
                <th>Hash</th>
                <th>Status</th>
                <th>Type</th>
            </tr>
            <tr v-for="t in transactionList" v-bind="t.hash">
                <td><a :href='`/explorer/blockdetails?height=${t.height}`'>{{t.height}}</a></td>
                <!-- TODO -->
                <td><a :href='`/explorer/txdetails?hash=0x${t.hash}`'>0x{{shorten(t.hash)}}</a></td>
                
                
                <td v-if="t.tx_result.code == 0">
                    <span class="badge badge-success">SUCCESS</span>
                </td>
                <td v-else>
                    <span class="badge badge-danger">FAIL</span>
                </td>
                <td  v-html="getType(t.tx_result.events.filter(x => x.type == 'message'))"></td>
            </tr>
        </table>
    </div>

</template>


<script lang="ts">

// staking  <> <span class="badge badge-info">Info</span>
// bank <> <span class="badge badge-primary">Primary</span>
// create_did / update_did <> <span class="badge badge-dark">Dark</span>

import Vue from 'vue'

export default Vue.extend({
    name: "Transactions",
    data() {
        return {
            transactionList: [],
            timestamp: "",
            tevents: {},
            latestBlockHeight: "",
            tempTxType: "",
            badges: {
                staking: "info",
                bank: "primary",
                create_did: "dark",
                update_did: "dark"
            }
        }
    },
    computed:{
    
    },
    props: ['newTxEventArrived', 'latestBlockHeight'],
    created() {
        
        this.getTop10Transactions();
    },
    watch: {
        // newTxEventArrived() { 
        //     this.getTop10Transactions();
        // }
        latestBlockHeight() {
            this.getTop10Transactions();
        }
    }, 
    
    methods: {
        getType(events){
            let moduleEvent = events.find(x => x.attributes[0].key === 'bW9kdWxl') // bW9kdWxl =  btoa('module')
            const type = atob(moduleEvent.attributes[0].value)
            let html = "";
            if(this.badges[type]){
                html = `<span class='badge badge-pill badge-${this.badges[type]}'>${type}</span>`

            }else{
                html = `<span class='badge badge-pill badge-secondary'>${type}</span>`
            }
            return html
        },
        async getTop10Transactions(){
            this.latestBlockHeight  = this.$config.gblBlockHeight;
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


        ////// TODO: I am surpised that they do have timestamp field in the tx rpc
        // async getTimestampFromBlock(height) {
        //     const block_detailAPI = `${this.$config.hid.HID_NODE_RPC_EP}/block?height=${height}`;
        //     const res = await fetch(block_detailAPI)
        //     const json = await res.json();
            
        //     const { result, error } = json;
        //     if(error){
        //         throw new Error(error)
        //     }
        //     console.log(result)
        //     const { block } = result;
        //     const timestamp = block.header.time;

        //     const d =  new Date(timestamp);
        //     return d.getTime();
        // },
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
