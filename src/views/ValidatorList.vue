<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h3>Validators at height #{{latestBlockHeight}}</h3>
        <div v-if="this.validatorList.length > 0" class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;margin-top:3%">
            <div class="col-md-12">
                <table class="table table-striped table-bordered table-sm">
                    <thead>
                    <tr>
                        <th>Address</th>
                        <th>Voting Power</th>
                        <th>Proposer Priority</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="b in  validatorList" v-bind="b.address">
                            
                        <td>{{b.address}}</td>
                        <td>{{b.voting_power}}</td>
                        <td>{{b.proposer_priority}}</td>
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

        
    </div>

    
</template>


<script>
export default {
    name: 'ValidatorList',
    data() {
        return {
            validatorList: [],
            latestBlockHeight: "",
            isLoading: false
        }
    },    
    async created(){
        this.isLoading = true;
        setTimeout(async () => {
            try{
                await this.getValidators();
                this.isLoading = false;
            }catch(e){
                this.isLoading = false;
                console.error(e)
            }
        }, 1000)
        
    },

    methods: {
        async getValidators(){

            // https://stage.hypermine.in/network/node1-rpc/validators
            const block_searchAPI = `${this.$config.hid.HID_NODE_RPC_EP}/validators`;
            const res =  await fetch(block_searchAPI)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            const { validators, block_height } = result;
            this.latestBlockHeight = block_height
            if(validators){
                this.validatorList = validators;
            }
        },

    }  
    

}
</script>