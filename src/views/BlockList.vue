<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h3>Top 50 Blocks</h3>
        <div class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;">
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
                        <td><a :href='`/blockdetails?height=${b.block.header.height}`'>{{b.block.header.height}}</a></td>    
                        <td><a :href='`/blockdetails?hash=0x${b.block_id.hash}`'>0x{{shorten(b.block_id.hash)}}</a></td>
                        <td>{{b.block.data.txs.length}}</td>
                        <td>{{formatDate(b.block.header.time)}}</td>
                        <td>{{shorten(b.block.header.proposer_address)}}</td>    
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <a :href='`/blocks?nextBlockHeight=${parseInt(latestBlockHeight) - 50}`'> Previous </a> |
                <a :href='`/blocks?nextBlockHeight=${parseInt(latestBlockHeight) + 50}`'> Next </a> 
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
            latestBlockHeight: "2000"
        }
    },    
    async created(){
        const { nextBlockHeight} = this.$route.query
        const h =  localStorage.getItem("latestBlockHeight")
        this.latestBlockHeight = nextBlockHeight ? nextBlockHeight: h;
        await this.getTop10Blocks();
    },

    methods: {
        async getTop10Blocks(){
            console.log('Inside BlocksList Component - ' +  this.$config.gblBlockHeight)
            // if(!this.latestBlockHeight && this.latestBlockHeight !== 'undefined'){
            //     return
            // }
            const block_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/block_search?query="block.height<${this.latestBlockHeight}"&page=1&per_page=50&order_by="desc"`;
            const res =  await fetch(block_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            const { blocks } = result;
            this.blockList = blocks;
            console.log(blocks[0].block.header.height)
            this.latestBlockHeight = blocks[0].block.header.height
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