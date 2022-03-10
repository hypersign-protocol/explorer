<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h3>Top 50 Transactions</h3>
        <div v-if="transactionList.length > 0" class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;margin-top:3%">
            <div class="col-md-12">
                <table class="table table-striped table-bordered table-sm">
                    <thead>
                    <tr>
                        <th>Block</th>
                        <th>Hash</th>
                        <th>Result</th>
                        <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="t in transactionList" v-bind="t.hash">
                        <td><a :href='`/explorer/blockdetails?height=${t.height}`'>{{t.height}}</a></td>
                        
                        <td><a :href='`/explorer/txdetails?hash=0x${t.hash}`'>0x{{(t.hash)}}</a></td>

                        <td v-if="t.tx_result.code == 0">
                            <span class="badge badge-success">SUCCESS</span>
                        </td>
                        <td v-else>
                            <span class="badge badge-danger">FAIL</span>
                        </td>
                        <td  v-html="getType(t.tx_result.events.filter(x => x.type == 'message'))"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="isLoading" class="d-flex justify-content-center" style="min-height:400px">
            <div class="spinner-border text-secondary" role="status" style="margin:auto">
                <span class="sr-only">Loading...</span>
            </div>
        </div>

        <div v-if="transactionList.length > 0" class="row">
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
            latestBlockHeight: "2000",
            isLoading: false,
            badges: {
                staking: "info",
                bank: "primary",
                create_did: "dark",
                update_did: "dark"
            }
        }
    },    
    async created(){
        this.isLoading = true;
         setTimeout(async () => {
             try{
                const { nextBlockHeight } = this.$route.query
                const h =  this.$store.state.latestBlockHeight;
                this.latestBlockHeight = nextBlockHeight ?nextBlockHeight:  h 
                await this.getTopTransactions();
                this.isLoading = false;
             }catch(e){
                console.log(e);
                this.isLoading = false 
             }
            
        }, 3000)
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
        
        getType(events){
            let moduleEvent = events.find(x => x.attributes[0].key === 'bW9kdWxl') // bW9kdWxl =  btoa('module')
            if(!moduleEvent){
                moduleEvent = events.find(x => x.attributes[0].key === 'YWN0aW9u') // bW9kdWxl =  btoa('action')
            }
            if(!moduleEvent){
                return "-"
            }
            let html = "-";
            
            if(moduleEvent && moduleEvent.attributes){
                    const type = atob(moduleEvent.attributes[0].value)
                    if(this.badges[type]){
                        html = `<span class='badge badge-pill badge-${this.badges[type]}'>${type}</span>`

                    }else{
                        html = `<span class='badge badge-pill badge-secondary'>${type}</span>`
                    }
            }            
            return html
        },
        shorten(str){
            if(str.length <= 10){
                return str
            }

            const f = str.substr(0,10)
            const m = "..."
            const l = str.substr(str.length - 10, 10);
            return f+m+l;
        }

    }  
    

}
</script>