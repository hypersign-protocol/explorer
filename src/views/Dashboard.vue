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
        <div class="row">
            <div class="col-sm-2 box card">
                <!-- Block Height // Toatal Number of Block -->
                <span class="too-big-font">{{ heightInStore }}</span>
                <span class="card-subheading">Block Height</span>
            </div>
            <div class="col-sm-2 box card">
                <!-- Toatal Number of Block -->
                <span class="too-big-font">{{ transactionCount }}</span>
                <span class="card-subheading">Successful Txs</span>
            </div>
            <div class="col-sm-2 box card">
                <!--  -->
                <span class="too-big-font">{{ totalValidators }}</span>
                <span class="card-subheading">Total Validators</span>
            </div>
            <div class="col-sm-2 box card">
                <!-- Toatal DID Count -->
                <span class="too-big-font"> {{ totalDIDCount }}</span>
                <span class="card-subheading">Total DIDs</span>
            </div>
            <div class="col-sm-2 box card">
                <!-- Toatal DID Count -->
                <span class="too-big-font"> {{ totalSchemaCount }}</span>
                <span class="card-subheading">Total Schemas</span>
            </div>
            <div class="col-sm-2 box card">
                <!-- Toatal DID Count -->
                <span class="too-big-font"> {{ totalCredStausCount }}</span>
                <span class="card-subheading">Total Credentials</span>
            </div>
            <!-- <div class="col-sm-2 box card">
                <span class="too-big-font">0</span>
                <span  class="card-subheading">Total Credential Def.</span>
            </div> -->
        </div>
        <div class="row block-tx-margin">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6">
                        <label class="table-heading">
                            <font-awesome-icon icon="fa-solid fa-cubes" /> Latest Blocks
                        </label>
                    </div>
                    <div class="col-md-6">
                        <a class="float-right" :href='`/explorer/blocks`'>See More</a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <Blocks class="table-design"></Blocks>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6">
                        <label class="table-heading">
                            <font-awesome-icon icon="fa-solid fa-file-invoice-dollar" /> Latest Transactions
                        </label>
                    </div>
                    <div class="col-md-6">
                        <a class="float-right" :href='`/explorer/transactions`'>See More</a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <Transactions class="table-design"></Transactions>
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
            totalDIDCount: 0,
            totalSchemaCount: 0,
            totalCredStausCount: 0,

        }
    },
    computed:{
        heightInStore(){
            return this.$store.state.latestBlockHeight
        },
        newEventTriggerForCreateDID(){
            return this.$store.state.txCreateDIDEventTrigger
        },
        newTxEventTrigger(){
            return this.$store.state.txEventTrigger
        },
        newTxCreateDIDEventTrigger(){
            return this.$store.state.txCreateDIDEventTrigger
        },
        newTxSchemaEventTrigger() {
            return this.$store.state.txCreateSchemaEventTrigger
        },
        newTxCredStatusEventTrigger() {
            return this.$store.state.txMsgRegisterCredentialStatusEventTrigger
        }

    },
    watch:{
        newEventTriggerForCreateDID(){
           this.updateDIDCount()
        },
        newTxEventTrigger(){
            this.getTransactionCount();
        },
        newTxCreateDIDEventTrigger(){
            this.updateDIDCount();
        },
        newTxSchemaEventTrigger() {
            this.updateSchemaCount();
        },
        newTxCredStatusEventTrigger() {
            this.updateCredStatusCount();
        }
    },
    async created(){
        this.getTransactionCount();
        this.getValidatorsCount();
        this.updateDIDCount();
        this.updateSchemaCount();
        this.updateCredStatusCount();
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
        async updateSchemaCount() {
            const transactionCountAPI = `${this.$config.hid.HID_NODE_REST_EP}/hypersign-protocol/hidnode/ssi/schema?count=true&pagination.countTotal=true&pagination.reverse=false`
            const res = await fetch(transactionCountAPI)
            const json = await res.json();

            const { totalCount } = json;
            if (!totalCount) {
                throw new Error("Some error occurred while fetching did count")
            }
            this.totalSchemaCount = totalCount;
        },
        async updateCredStatusCount() {
            const transactionCountAPI = `${this.$config.hid.HID_NODE_REST_EP}/hypersign-protocol/hidnode/ssi/credential?count=true&pagination.countTotal=true&pagination.reverse=false`
            const res = await fetch(transactionCountAPI)
            const json = await res.json();

            const { totalCount } = json;
            if (!totalCount) {
                throw new Error("Some error occurred while fetching did count")
            }
            this.totalCredStausCount = totalCount;
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