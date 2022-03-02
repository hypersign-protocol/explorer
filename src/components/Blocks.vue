<template>
    <div>
        <table class="table">
            <tr>
                <th>Height</th>
                <th>Hash</th>
                <th>Txs</th>
                <th>Time</th>
                <th>Proposer</th>
            </tr>
            <tr v-for="b in blocksList" v-bind="b.block_id.hash">
            <!-- <tr :v-for="b in blocksList" :v-bind="b"> -->
                <td>{{b.block.header.height}}</td>
                <!-- TODO -->
                <td><a :href='b.block_id.hash'>{{shorten(b.block_id.hash)}}</a></td>
                <td>{{b.block.data.txs.length}}</td>
                <td>{{formatDate(b.block.header.time)}}</td>
                <td>{{shorten(b.block.header.proposer_address)}}</td>    
            </tr>
        </table>
    </div>

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: "Transactions",
    data() {
        return {        
            latestBlockHeight: "",    
            blocksList: []
        }
    },
    props:{
        // latestBlockHeight : {
        //     type: String
        // }
    },
    async created(){     
       setInterval(async () => {
            try{
                console.log(this.latestBlockHeight)
                await this.getConsensusState();
                await this.getTop10Blocks();
            }   catch(e){
                console.error(JSON.stringify(e))
            }
       }, 2000)
    },   
       
    methods: {
        async getConsensusState(){
            const consensusStateAPI = `http://localhost:26657/consensus_state`
            const res =  await fetch(consensusStateAPI)
            const json = await res.json();
            console.log(json)
            const { result, error } = json;
            if(error){
                console.log(error)
                throw new Error(error)
            }
            const { round_state } = result;
            this.latestBlockHeight = round_state['height/round/step'].split('/')[0];
            
        },
        async getTop10Blocks(){
            if(!this.latestBlockHeight){
                return
            }
            const block_searchAPI = `http://localhost:26657/block_search?query="block.height<${this.latestBlockHeight}"&page=1&per_page=10&order_by="desc"`;
            const res =  await fetch(block_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            const { blocks } = result;
            this.blocksList = blocks;
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