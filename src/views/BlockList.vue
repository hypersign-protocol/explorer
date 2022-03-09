<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h3>Top 50 Blocks</h3>
        <div v-if="this.blockList.length > 0" class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;margin-top:3%">
            <div class="col-md-12">
                <table class="table table-striped table-bordered table-sm">
                    <thead>
                    <tr>
                        <th>Height</th>
                        <th>Hash</th>
                        <th>Txs</th>
                        <th>Time</th>
                        <th>Proposer</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="b in  blockList" v-bind="b.block_id.hash">
                        <td><a :href='`/explorer/blockdetails?height=${b.block.header.height}`'>{{b.block.header.height}}</a></td>    
                        <td><a :href='`/explorer/blockdetails?hash=0x${b.block_id.hash}`'>0x{{shorten(b.block_id.hash)}}</a></td>
                        <td>{{b.block.data.txs.length}}</td>
                        <td>{{formatDate(b.block.header.time)}}</td>
                        <td>{{shorten(b.block.header.proposer_address)}}</td>    
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

        <div v-if="this.blockList.length > 0" class="row">
            <div class="col-md-12">
                <a :href='`/explorer/blocks?nextBlockHeight=${parseInt(latestBlockHeight) - 50}`'> Previous </a> |
                <a :href='`/explorer/blocks?nextBlockHeight=${parseInt(latestBlockHeight) + 50}`'> Next </a> 
            </div>
        </div>
    </div>

    
</template>


<script>
export default {
    name: 'BlocksList',
    data() {
        return {
            blockList: [],
            latestBlockHeight: "",
            isLoading: false
        }
    },    
    async created(){
        this.isLoading = true;
        setTimeout(async () => {
            try{
                const { nextBlockHeight} = this.$route.query
                const h =  this.$store.state.latestBlockHeight;
                this.latestBlockHeight = nextBlockHeight ? nextBlockHeight: h;
                await this.getTop10Blocks();
                this.isLoading = false;
            }catch(e){
                this.isLoading = false;
                console.error(e)
            }
        }, 3000)
        
    },

    methods: {
        async getTop10Blocks(){
            const block_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/block_search?query="block.height<${this.latestBlockHeight}"&page=1&per_page=50&order_by="desc"`;
            const res =  await fetch(block_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            const { blocks } = result;
            if(blocks){
                this.blockList = blocks;
                this.latestBlockHeight = blocks[0].block.header.height
            }
        },

        formatDate(date){
            const d =  new Date(date);
            return d.getTime();
        },
        shorten(str){
            const len = 8;
            if(str.length <= len){
                return str
            }

            const f = str.substr(0,len)
            const m = "..."
            const l = str.substr(str.length - len, len);
            return f+m+l;
        }

    }  
    

}
</script>