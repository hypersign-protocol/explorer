<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}
</style>
<template>
    <div class="body">
        <div class="row">
            <div class="col-md-12">
                <h3> Block Details For {{ blockHeight }} </h3>
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
        <div class="row" style="margin-top:2%">
            <h5><font-awesome-icon icon="fa-solid fa-file-invoice-dollar" /> Transactions ({{this.blockTransactions.length}})</h5>
            <div class="col-md-12">
                
                <!-- Block Transactions -->
                
                <!-- Compoent which fetchs all tractins in  that block -->
            </div>
        </div>
    </div>
</template>


<script>
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
              let api  = ""
              console.log()
            if(this.blockHeight != "" && this.blockHeight != 'NaN'){
                api  = `${this.$config.hid.HID_NODE_RPC_EP}/block?height=${parseInt(this.blockHeight)}`;
            } else {
                api  = `${this.$config.hid.HID_NODE_RPC_EP}/block_by_hash?hash=${this.blockHash}`;
            }
            
            const res =  await fetch(api)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            console.log(result)
            const {  block, block_id } = result;
            this.blockHeader = block.header;
            this.blockTransactions = block.data.txs;
            this.blockHash  = block_id.hash
            this.blockHeight = this.blockHeader.height
        },
    }

}
</script>