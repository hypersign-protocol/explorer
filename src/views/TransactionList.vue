<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h3>Top 50 Transactions</h3>
        <div class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;margin-top:3%">
            <div class="col-md-12">
                <table class="table table-striped table-bordered table-sm">
                    <thead>
                    <tr>
                        <th>Block</th>
                        <th>Hash</th>
                        <th>Result</th>
                        <th>Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="t in transactionList" v-bind="t.height">
                        <td><a :href='`/explorer/blockdetails?height=${t.height}`'>{{t.height}}</a></td>
                        <!-- TODO -->
                        <td><a :href='`/explorer/txdetails?hash=0x${t.hash}`'>0x{{shorten(t.hash)}}</a></td>

                        <td v-if="t.tx_result.code == 0">
                            <span class="badge badge-success">SUCCESS</span>
                        </td>
                        <td v-else>
                            <span class="badge badge-danger">FAIL</span>
                        </td>
                        <td>{{getTimestampFromBlock(t.height)}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <a :href='`/explorer/transactions?nextBlockHeight=${parseInt(latestBlockHeight) - 50}`'> Previous </a> |
                <a :href='`/explorer/transactions?nextBlockHeight=${parseInt(latestBlockHeight) + 50}`'> Next </a> 
            </div>
        </div>
    </div>

    
</template>


<script>
export default {
    name: 'TransactionList',
    data() {
        return {
            transactionList: [],
            latestBlockHeight: "2000"
        }
    },    
    async created(){
        const { nextBlockHeight} = this.$route.query
        const h =  localStorage.getItem("latestBlockHeight")
        this.latestBlockHeight = nextBlockHeight ?nextBlockHeight:  h 
        await this.getTopTransactions();
    },

    methods: {
        async getTopTransactions(){
            console.log('Inside Tx Component - ' +  this.latestBlockHeight)
            if(!this.latestBlockHeight && this.latestBlockHeight !== 'undefined'){
                return
            }
            const transaction_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/tx_search?query="tx.height<${this.latestBlockHeight}"&prove=true&page=1&per_page=50&order_by="desc"`;
            const res =  await fetch(transaction_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            const { txs } = result;
            this.transactionList = txs;
            this.latestBlockHeight = txs[0].height
        },
        async getTimestampFromBlock(height) {
            const block_detailAPI = `${this.$config.hid.HID_NODE_RPC_EP}/block?height=${height}`;
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
    

}
</script>