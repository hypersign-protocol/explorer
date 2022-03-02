<template>
    <div>
        <table class="table">
            <tr>
                <th>Block</th>
                <th>Hash</th>
                <th>Result</th>
                <th>Time</th>
            </tr>
            <tr v-for="t in transactionList" v-bind="t.height">
                <td>{{t.height}}</td>
                <!-- TODO -->
                <td><a :href='t.hash'>{{shorten(t.hash)}}</a></td>
                <td>{{checkTxStatus(t.tx_result.code)}}</td>
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
            latestBlockHeight: "",    
            transactionList: [],
            timestamp: ""
        }
    },
    props:{
        // latestBlockHeight : {
        //     type: String
        // }
    },
    async created(){
        setInterval(async () => {
            try{
                console.log(this.latestBlockHeight)
                await this.getConsensusState();
                await this.getTop10Transactions();
            }   catch(e){
                console.error(JSON.stringify(e))
            }
       }, 2000) 
    },
    
    methods: {
        async getConsensusState(){
            const consensusStateAPI = `http://localhost:26657/consensus_state`
            const res =  await fetch(consensusStateAPI)
            const json = await res.json();
            console.log(json)
            const { result, error } = json;
            if(error){
                console.log(error)
                throw new Error(error)
            }
            const { round_state } = result;
            this.latestBlockHeight = round_state['height/round/step'].split('/')[0];
            
        },
        async getTop10Transactions(){
            // if(!this.latestBlockHeight){
            //     return
            // }
            const transaction_searchAPI = `http://localhost:26657/tx_search?query="tx.height<${this.latestBlockHeight}"&prove=true&page=1&per_page=10&order_by="desc"`;
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
            const block_detailAPI = `http://localhost:26657/block?height=${height}`;
            const res = await fetch(block_detailAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
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
