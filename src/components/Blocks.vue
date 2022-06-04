<template>
    <div>
        <table v-if="blockList.length > 0" class="table  table-striped table-bordered table-sm">
            <tr>
                <th>Height</th>
                <th>Hash</th>
                <th>Txs</th>
                <th>Time (UTC)</th>
                <th>Proposer</th>
            </tr>
            <tr v-for="b in  blockList" v-bind="b.block_id.hash">
                <!-- <tr :v-for="b in blocksList" :v-bind="b"> -->
                <td><a :href='`/explorer/blockdetails?height=${b.block.header.height}`'>{{b.block.header.height}}</a>
                </td>
                <!-- TODO -->
                <td><a :href='`/explorer/blockdetails?hash=0x${b.block_id.hash}`'>0x{{shorten(b.block_id.hash)}}</a>
                </td>
                <td>{{b.block.data.txs.length}}</td>
                <td>{{ formatdate(b.block.header.time)}}</td>
                <td>{{shorten(b.block.header.proposer_address)}}</td>
            </tr>
        </table>

        <div v-if="isLoading" class="d-flex justify-content-center" style="min-height:400px">
            <div class="spinner-border text-secondary" role="status" style="margin:auto">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import Vue from 'vue'
import { formatDate  } from '../utils/others'
// import config from '../config'

export default Vue.extend({
    name: "Blocks",
    data() {
        return {        
           blockList: [],
           latestBlockHeight: "",
           isLoading: false
        }
    },
    async created(){   
        this.latestBlockHeight = this.heightInStore      
        this.isLoading = true;
        await this.getTop10Blocks()
        this.isLoading = false;
    },
    computed:{
        heightInStore(){
            return this.$store.state.latestBlockHeight
        }
    },
    watch: {
        heightInStore() { 
            this.latestBlockHeight = this.heightInStore 
            this.getTop10Blocks();
        }
    },   
   
    methods: {
        async getTop10Blocks(){
        
            if(!this.latestBlockHeight && this.latestBlockHeight !== 'undefined'){
                // this.isLoading = false
                return
            }
            const block_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/block_search?query="block.height<=${this.latestBlockHeight}"&page=1&per_page=10&order_by="desc"`;
            const res =  await fetch(block_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                // this.isLoading = false
                throw new Error(error)
            }
            const { blocks } = result;
            this.blockList = blocks;
            
        },
        formatdate(date){
            return formatDate(date);
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
    
})
</script>