<style scoped>
.box{
 /* margin-left: 3.0%; */
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
    min-height: 400px;
    margin-top: 1%; 
    max-height: 400px; 
    overflow-x: hidden; 
    overflow-y: auto;
    background: white;
    border: 1px solid #80808021;
    box-shadow: 0px 0px 2px 2px #ebeef1b3;
}

.float-right{
    float:right;
    align-content:right;
    font-size: small;
    color: grey;
}

.card-subheading{
    font-size:x-small;
    color:grey;
}


</style>


<template>
    <div class="body">
        <div class="row" >
            <div class="col-sm-3 box card">
                <!-- Block Height // Toatal Number of Block -->
                <span class="too-big-font">{{ latestBlockHeight }}</span>
                <span class="card-subheading" >Block Height</span>
            </div>
            <div class="col-sm-3 box card">
                <!-- Toatal Number of Block -->
                <span class="too-big-font">{{ transactionCount }}</span>
                <span  class="card-subheading">Successful Txs</span>
            </div>
            <div class="col-sm-3 box card">
                <!--  -->
                <span class="too-big-font">{{ totalValidators }}</span>
                <span  class="card-subheading">Total Validators</span>
            </div>
            <div class="col-sm-3 box card">
                <!-- Toatal DID Count -->
                <span class="too-big-font"> {{ totalDIDCount }}</span>
                <span  class="card-subheading">Total DIDs</span>
            </div>
            <!-- <div class="col-sm-2 box card">
                <span class="too-big-font">0</span>
                <span  class="card-subheading">Total Credential Def.</span>
            </div> -->
        </div>
        <div class="row block-tx-margin">
            <div class="col-md-6" >
                <div class="row">
                    <div class="col-md-6">
                        <label class="table-heading"> <font-awesome-icon icon="fa-solid fa-cubes" /> Latest Blocks</label>
                    </div>
                    <div class="col-md-6">
                        <a class="float-right" :href='`/explorer/blocks`'>See More</a>
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
                    <div class="col-md-6">
                        <label class="table-heading"> <font-awesome-icon icon="fa-solid fa-file-invoice-dollar" /> Latest Transactions</label>
                    </div>
                    <div class="col-md-6">
                        <a class="float-right" :href='`/transactions`'>See More</a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <Transactions v-bind:latestBlockHeight='latestBlockHeight' v-bind:newTxEventArrived='newTxEventArrived'  class="table-design"></Transactions>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts">

import Blocks from '../components/Blocks.vue'
import Transactions from '../components/Transactions.vue'

export default {
    components:{
        Blocks,
        Transactions
    },
    data() {
        return {
            latestBlockHeight: 0,
            connection: null,
            transactionCount: 0,
            totalValidators: 0,
            newTxEventArrived: "",
            totalDIDCount: 0
        }
    },
    async created(){
        
        this.connection = new WebSocket(`${this.$config.hid.HID_NODE_SOCKET_EP}`);
      
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


            const txHeader = {
                jsonrpc: '2.0',
                method: 'subscribe',
                id: 0,
                params: {
                    query: 'tm.event=\'Tx\'',
                },
            };
            that.connection.send(JSON.stringify(txHeader));
        };

        this.connection.onmessage = function({ data }) {
            const parseData = JSON.parse(data);
            const { result } = parseData;
            const { query } = result;
            switch (query) {
                case 'tm.event=\'NewBlock\'':
                    that.latestBlockHeight = result.data.value.block.header.height    
                    that.$config.gblBlockHeight = that.latestBlockHeight
                    localStorage.setItem("latestBlockHeight", that.latestBlockHeight)
                    break;
        
                case 'tm.event=\'Tx\'':
                    console.log('==========Tx event=======')
                    console.log(JSON.stringify(result.events))
                    const msg_action_type = result.events['message.action'][0]
                    switch(msg_action_type){
                        case 'create_did': 
                            // Trigger event to update the did count
                            break;

                        case 'update_did':
                            break;
                        default: 
                            break;
                    }
                    
                    that.newTxEventArrived = Date.now();
                    break;
        
                default:
                    break;
            }
            
            
        };
        this.connection.onerror = function(error) {
            console.log("Websocket connection error ", error);
        };
    },
    async updated(){
        await this.getTransactionCount();
        await this.getValidatorsCount();
        this.updateDIDCount()
    },
    methods: {

        async updateDIDCount(){
            const transactionCountAPI = `${this.$config.hid.HID_NODE_REST_EP}/hypersign-protocol/hidnode/ssi/did?count=true&pagination.countTotal=true&pagination.reverse=false`
            const res =  await fetch(transactionCountAPI)
            const json = await res.json();
            
            const { totalDidCount } = json;
            if(!totalDidCount){
                throw new Error("Some error occurred while fetching did count")
            }
            this.totalDIDCount = totalDidCount;
        },

        async getTransactionCount(){
            const event_name = "/cosmos.bank.v1beta1.MsgSend"
            const transactionCountAPI = `${this.$config.hid.HID_NODE_RPC_EP}/tx_search?query="message.action=\'${event_name}\'"`;
            const res =  await fetch(transactionCountAPI)
            const json = await res.json();
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            this.transactionCount = result.total_count;
        },

        async getValidatorsCount() {
            const validatorsCountAPI = `${this.$config.hid.HID_NODE_RPC_EP}/validators`;
            const res =  await fetch(validatorsCountAPI)
            const json = await res.json();
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            this.totalValidators = result.total;
        },
    }

}
</script>