<style scoped>
.box{
 margin-left: 2%;
}
.too-big-font{
    font-size: xxx-large;
    font-weight: bold;
}
</style>


<template>
    <div>
        <div class="row">
            <div class="col-md-2 box card">
                <!-- Block Height // Toatal Number of Block -->
                <span class="too-big-font">{{ latestBlockHeight }}</span>
                <span class="card-header">Blocks</span>
            </div>
            <div class="col-md-2 box card">
                <!-- Toatal Number of Block -->
                <span class="too-big-font">{{ transactionCount }}</span>
                <span class="card-header">Successful Txs</span>
            </div>
            <div class="col-md-2 box card">
                <!--  -->
                <span class="too-big-font">{{ totalValidators }}</span>
                <span class="card-header">Validators</span>
            </div>
            <div class="col-md-2 box card">
                <!-- Toatal DID Count -->
                <span class="too-big-font">673</span>
                <span class="card-header">DIDs</span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <Blocks :latestBlockHeight='latestBlockHeight'></Blocks>
            </div>
            <div class="col-md-6">
                <Transactions></Transactions>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Blocks from '../components/Blocks.vue'
import Transactions from '../components/Transactions.vue'

export default Vue.extend({
    components:{
        Blocks,
        Transactions
    },
    data() {
        return {
            latestBlockHeight: "",
            connection: null,
            transactionCount: 0
        }
    },
    async created(){
        this.connection = new WebSocket('ws://localhost:26657/websocket');
      
        const that =  this;
        this.connection.onopen = function() {
            console.log("Socket connection is open");

            const blockHeader = {
                jsonrpc: '2.0',
                method: 'subscribe',
                id: 0,
                params: {
                    query: 'tm.event=\'NewBlock\'',
                },
            };
            that.connection.send(JSON.stringify(blockHeader));
        };

        this.connection.onmessage = function({ data }) {
            const parseData = JSON.parse(data);
            const { result } = parseData;
            that.latestBlockHeight = result.data.value.block.header.height
        };
        this.connection.onerror = function(error) {
            console.log("Websocket connection error ", error);
        };
    },
    async updated(){
        await this.getTransactionCount();
        await this.getValidatorsCount();
    },
    methods: {

        async getTransactionCount(){
            const event_name = "/cosmos.bank.v1beta1.MsgSend"
            const transactionCountAPI = `http://localhost:26657/tx_search?query="message.action=\'${event_name}\'"`;
            const res =  await fetch(transactionCountAPI)
            const json = await res.json();
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            this.transactionCount = result.total_count;
        },

        async getValidatorsCount() {
            const validatorsCountAPI = `http://localhost:26657/validators`;
            const res =  await fetch(validatorsCountAPI)
            const json = await res.json();
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            this.totalValidators = result.total;
        },
    }

})
</script>