<style scoped>
.box{
 margin-left: 3.0%;
 padding-bottom: 20px;
 box-shadow: 0px 0px 2px 2px #ebeef1b3;
}
.too-big-font{
    font-size: xxx-large;
    font-weight: bold;
}

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

.block-tx-margin { 
    margin-top:3%; 
}
.table-heading {
    float:left; font-weight:bold
}
.table-design{ 
    margin-top: 1%; 
    max-height: 400px; 
    overflow-x: hidden; 
    overflow-y: auto;
    background: white;
    border: 1px solid #80808021;
    box-shadow: 0px 0px 2px 2px #ebeef1b3;
}

.card-subheading{
    font-size:small;
    color:grey;
}


</style>


<template>
    <div class="body">
        <div class="row" >
            <div class="col-sm-2 box card">
                <!-- Block Height // Toatal Number of Block -->
                <span class="too-big-font">{{ latestBlockHeight }}</span>
                <span class="card-subheading" >Block Height</span>
            </div>
            <div class="col-sm-2 box card">
                <!-- Toatal Number of Block -->
                <span class="too-big-font">{{ transactionCount }}</span>
                <span  class="card-subheading">Successful Txs</span>
            </div>
            <div class="col-sm-2 box card">
                <!--  -->
                <span class="too-big-font">{{ totalValidators }}</span>
                <span  class="card-subheading">Total Validators</span>
            </div>
            <div class="col-sm-2 box card">
                <!-- Toatal DID Count -->
                <span class="too-big-font">0</span>
                <span  class="card-subheading">Total DIDs</span>
            </div>
            <div class="col-sm-2 box card">
                <!-- Toatal DID Count -->
                <span class="too-big-font">0</span>
                <span  class="card-subheading">Total Credential Def.</span>
            </div>
        </div>
        <div class="row block-tx-margin">
            <div class="col-md-6" >
                <div class="row">
                    <div class="col-md-12">
                        <label class="table-heading"> <font-awesome-icon icon="fa-solid fa-cubes" /> Latest Blocks</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <Blocks v-bind:latestBlockHeight='latestBlockHeight' class="table-design"></Blocks>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-12">
                        <label class="table-heading"> <font-awesome-icon icon="fa-solid fa-file-invoice-dollar" /> Latest Transactions</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <Transactions v-bind:latestBlockHeight='latestBlockHeight'></Transactions>
                    </div>
                </div>
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
            transactionCount: 0,
            totalValidators: 0
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
            // console.log('emitting newBlockHeightFoundEvent event')
            // that.$emit("newBlockHeightFoundEvent", that.latestBlockHeight);
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