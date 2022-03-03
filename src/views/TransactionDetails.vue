<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}
</style>
<template>
    <div class="body">
        <div class="row">
            <div class="col-md-12">
                <h3> Transactions Details </h3>
            </div>
        </div>
        
        <div class="row" v-if="this.txDetails != null" style="text-align: left;">
            <div class="col-md-12">
                <ul class="list-group">
                    <li class="list-group-item">
                        <b>Hash:</b> {{ this.txHash }}
                    </li>
                     <li class="list-group-item">
                        <b>Root Hash:</b> 0x{{ this.txProof.root_hash }}
                    </li>
                    <li class="list-group-item">
                        <b>Height:</b><a :href='`/blockdetails?height=${this.blockHeight}`'> {{ this.blockHeight }}</a>
                        
                    </li>
                    <li class="list-group-item">
                        <b>Gas Wanted:</b> {{ this.txDetails.gas_wanted }}
                    </li>
                    <li class="list-group-item">
                        <b>Gas Used:</b> {{ this.txDetails.gas_used }}
                    </li>
                    <li class="list-group-item">
                        <b>Type:</b> 
                    </li>
                    <li class="list-group-item">
                        <b>From:</b> 
                    </li>
                    <li class="list-group-item">
                        <b>To:</b> 
                    </li>
                    <li class="list-group-item">
                        <b>Amount:</b> 
                    </li>
                    <li class="list-group-item" style="word-wrap: break-word;">
                        <b>Blob:</b> {{ this.txData }}
                    </li>
                    <li class="list-group-item" style="word-wrap: break-word;">
                        <b>Log:</b> {{ this.txDetails.log }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Test',
    data() {
        return {
            txHash: "",
            txDetails: null,
            txData: "",
            blockHeight: "",
            txProof: ""
        }
    },
    async created() {
        console.log('Inside TxDetails test page')
        const { hash } = this.$route.query;
        if(!hash){
            console.error('Block hash or block height must be passed int he query')
            return;
        }
        this.txHash = hash? hash: ""
        this.getTransactionDetailsbyHash()
    },
    methods: {
         async getTransactionDetailsbyHash(){
            const api  = `${this.$config.hid.HID_NODE_RPC_EP}/tx?hash=${this.txHash}&prove=true`;
            const res =  await fetch(api)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            console.log(JSON.stringify(result))
            const {  tx_result, height, tx, proof  } = result;
            console.log(proof)
            this.txDetails = tx_result
            this.blockHeight = height
            this.txData = tx
            this.txProof = proof
        },
    }

}
</script>