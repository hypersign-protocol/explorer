<template>
    <div>          
        <table  v-if="transactionList.length > 0" class="table table-striped table-bordered table-sm">
            <tr>
                <th>Block</th>
                <th>Hash</th>
                <th>Status</th>
                <th>Type</th>
            </tr>
            
            <tr v-for="t in transactionList" v-bind="t.hash">
                <td><a :href='`/explorer/blockdetails?height=${t.height}`'>{{t.height}}</a></td>
                <td><a :href='`/explorer/txdetails?hash=0x${t.hash}`'>0x{{shorten(t.hash)}}</a></td>
                
                
                <td v-if="t.tx_result.code == 0">
                    <span class="badge badge-success">SUCCESS</span>
                </td>
                <td v-else>
                    <span class="badge badge-danger">FAIL</span>
                </td>
                <td>
                    <div v-if="t.tx_result.events.filter(x => x.type == 'message').length > 0" v-html="getType(t.tx_result.events.filter(x => x.type == 'message'))"></div>
                    <div v-else>-</div>
                </td>
            </tr>            
        </table>

        <div v-if="isLoading" class="d-flex justify-content-center" style="min-height:400px">
            <div class="spinner-border text-secondary" role="status" style="margin:auto">
                <span class="sr-only">Loading...</span>
            </div>
        </div>

    </div>

</template>


<script lang="ts">


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
            customTypes: {
                "/hypersignprotocol.hidnode.ssi.MsgCreateDID": "Create DID",
                "/hypersignprotocol.hidnode.ssi.MsgUpdateDID": "Update DID",
                "/hypersignprotocol.hidnode.ssi.MsgDeactivateDID": "Deactivate DID",
                "/hypersignprotocol.hidnode.ssi.MsgCreateSchema": "Create Schema"
            },
            badges: {
                staking: "info",
                bank: "primary",
                "/hypersignprotocol.hidnode.ssi.MsgCreateDID": "dark",
                "/hypersignprotocol.hidnode.ssi.MsgUpdateDID": "dark",
                "/hypersignprotocol.hidnode.ssi.MsgDeactivateDID": "dark",
                "/hypersignprotocol.hidnode.ssi.MsgCreateSchema": "dark"
            },
            isLoading: false
        }
    },
    computed:{
        newEventTrigger(){
            return this.$store.state.txEventTrigger
        }
    },
    created(){        
        this.isLoading = true;
        setTimeout(async ()=> {
           await this.getTop10Transactions()
           this.isLoading = false;
        }, 5000)
        
    },
    watch: {
        newEventTrigger() {
            this.getTop10Transactions();
        }
    }, 
    methods: {
        getType(events){
            let moduleEvent = events.find(x => x.attributes[0].key === 'bW9kdWxl') // bW9kdWxl =  btoa('module')
            if(!moduleEvent){
                moduleEvent = events.find(x => x.attributes[0].key === 'YWN0aW9u') // bW9kdWxl =  btoa('action')
            }

            if(!moduleEvent){
                return "-"
            }
            
            const type = atob(moduleEvent.attributes[0].value)
            let html = "";
            if(this.badges[type]){
                if (!this.customTypes[type]) {
                    html = `<span class='badge badge-pill badge-${this.badges[type]}'>${type}</span>`
                } else {
                    html = `<span class='badge badge-pill badge-${this.badges[type]}'>${this.customTypes[type]}</span>`
                } 
            } else {
                html = `<span class='badge badge-pill badge-secondary'>${type}</span>`
            }
            return html
        },
        async getTop10Transactions(){
            this.latestBlockHeight = this.$store.state.latestBlockHeight
            if(!this.latestBlockHeight && this.latestBlockHeight !== 'undefined'){
                return
            }
            const transaction_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/tx_search?query="tx.height<=${this.latestBlockHeight}"&prove=true&page=1&per_page=10&order_by="desc"`;
            const res =  await fetch(transaction_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                this.isLoading = false;
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
