<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h3>Top 50 Transactions</h3>
        <div class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;">
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
                        <td><a :href='`/blockdetails?height=${t.height}`'>{{t.height}}</a></td>
                        <!-- TODO -->
                        <td><a :href='`/txdetails?hash=0x${t.hash}`'>0x{{shorten(t.hash)}}</a></td>
                        <td>{{checkTxStatus(t.tx_result.code)}}</td>
                        <td>{{getTimestampFromBlock(t.height)}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <a :href='`/transactions?nextBlockHeight=${parseInt(latestBlockHeight) + 50}`'> Next </a> |
                <a :href='`/transactions?nextBlockHeight=${parseInt(latestBlockHeight) - 50}`'> Previous </a>
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
        this.latestBlockHeight = nextBlockHeight
        await this.getTopTransactions();
    },

    methods: {
        async getTopTransactions(){
            console.log('Inside Tx Component - ' +  this.latestBlockHeight)
            if(!this.latestBlockHeight && this.latestBlockHeight !== 'undefined'){
                return
            }
            const transaction_searchAPI = `http://localhost:26657/tx_search?query="tx.height<${this.latestBlockHeight}"&prove=true&page=1&per_page=50&order_by="desc"`;
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
    

}
</script>