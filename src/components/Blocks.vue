<template>
    <div>
        <table class="table  table-striped table-bordered table-sm">
            <tr>
                <th>Height</th>
                <th>Hash</th>
                <th>Txs</th>
                <th>Time</th>
                <th>Proposer</th>
            </tr>
            <tr v-for="b in  blockList" v-bind="b.block_id.hash">
            <!-- <tr :v-for="b in blocksList" :v-bind="b"> -->
                <td><a :href='`/blockdetails?height=${b.block.header.height}`'>{{b.block.header.height}}</a></td>
                <!-- TODO -->
                <td><a :href='`/blockdetails?hash=0x${b.block_id.hash}`'>0x{{shorten(b.block_id.hash)}}</a></td>
                <td>{{b.block.data.txs.length}}</td>
                <td>{{formatDate(b.block.header.time)}}</td>
                <td>{{shorten(b.block.header.proposer_address)}}</td>    
            </tr>
        </table>
    </div>

</template>

<script lang="ts">
import Vue from 'vue'
// import config from '../config'

export default Vue.extend({
    name: "Blocks",
    data() {
        return {        
           blockList: [],
        }
    },
    props: ['latestBlockHeight'],
    watch: {
        latestBlockHeight() { 
            this.getTop10Blocks();
        }
    },   
    methods: {
        async getTop10Blocks(){
            console.log('Inside Blocks Component - ' +  this.latestBlockHeight)
            if(!this.latestBlockHeight && this.latestBlockHeight !== 'undefined'){
                return
            }
            const block_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/block_search?query="block.height<${this.latestBlockHeight}"&page=1&per_page=10&order_by="desc"`;
            const res =  await fetch(block_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            const { blocks } = result;
            this.blockList = blocks;
        },

        formatDate(date){
            const d =  new Date(date);
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
    
})
</script>