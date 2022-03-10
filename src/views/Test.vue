<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}
</style>
<template>
    <div class="body">
        <div class="row">
            <div class="col-md-12">
                <h3> Details for Block #{{ blockHeight }} </h3>
            </div>
        </div>
        
        <div class="row" v-if="this.blockHeader != null" style="text-align: left;">
            <h5> <font-awesome-icon icon="fa-solid fa-cubes" /> Block Header</h5>
            <div class="col-md-12">
                <ul class="list-group">
                    <li class="list-group-item">
                        <b>Versions:</b> {{ this.blockHeader.version.block }}
                    </li>
                    <li class="list-group-item">
                        <b>Height:</b> {{ this.blockHeader.height }}
                    </li>
                    <li class="list-group-item">
                        <b>Time:</b> {{ this.blockHeader.time }}
                    </li>
                    <li class="list-group-item">
                        
                        <b>Hash:</b> <a :href='`/explorer/blockdetails?hash=0x${this.blockHash}`'>0x{{ this.blockHash }}</a>
                    </li>
                    <li class="list-group-item">
                        <b>Last Block Hash:</b> <a :href='`/explorer/blockdetails?hash=0x${this.blockHeader.last_block_id.hash}`'> 0x{{ this.blockHeader.last_block_id.hash }}</a>
                    </li>
                    <li class="list-group-item">
                        <b>Proposer :</b> {{ this.blockHeader.proposer_address }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="row" style="margin-top:2%; text-align: left;font-size:small" >
            <h5><font-awesome-icon icon="fa-solid fa-file-invoice-dollar" /> Transactions ({{ this.blockTransactions.length }})</h5>
            <div class="col-md-12" v-if="this.blockTransactions.length > 0">
                <ul class="list-group">
                    <li  class="list-group-item" v-for="tx in this.blockTransactions" v-bind="tx">
                        <a :href='`/explorer/txdetails?hash=0x${tx}`'>0x{{(tx)}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>
import encodeHidTx from '../utils/encodeHidTx'
export default {
    name: 'Test',
    data() {
        return {
            blockHash: "",
            blockHeight: "",
            blockData:  {},
            blockHeader:  null,
            blockTransactions: []
        }
    },
    async created() {
        console.log('Inside blockdetails test page')
        const { hash, height } = this.$route.query;
        if(!hash && !height){
            console.error('Block hash or block height must be passed int he query')
            return;
        }
        this.blockHash = hash? hash: ""
        this.blockHeight = height? height: "";
        this.getBlockDetails()
    },
    methods: {
         async getBlockDetails(){
             try{
              let api  = ""
              console.log()
            if(this.blockHeight != "" && this.blockHeight != 'NaN'){
                api  = `${this.$config.hid.HID_NODE_RPC_EP}/block?height=${parseInt(this.blockHeight)}`;
            } else {
                api  = `${this.$config.hid.HID_NODE_RPC_EP}/block_by_hash?hash=${this.blockHash}`;
            }
            
            const res =  await fetch(api)
            const json = await res.json();
            
            const { result, error, } = json;
            if(error){
                throw new Error(error)
            }
            
            const {  block, block_id } = result;
            this.blockHeader = block.header;
                this.blockHash  = block_id.hash
                this.blockHeight = this.blockHeader.height
                if(block.data && block.data.txs && block.data.txs.length >0 ){
                    this.blockTransactions = block.data.txs.map(x => encodeHidTx(x))
                }
              }catch(e){
                console.error(e)    
                
            }
            
        }
    }

}
</script>