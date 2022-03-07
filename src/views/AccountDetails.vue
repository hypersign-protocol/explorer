<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}
</style>
<template>
    <div class="body">
        <div class="row">
            <div class="col-md-12">
                <h3> Account Details </h3>
            </div>
        </div>
        <div class="row" style="text-align: left;">
            <h5>Account: {{ accountId }}</h5>
        </div>
        <div class="row" style="text-align: left;" v-for="balance in balances" v-bind="balance">
            <div class="col-md-12">
                <ul class="list-group" >
                    <li class="list-group-item"><b>Tokens :</b> {{ balance.denom }} </li>
                    <li class="list-group-item"><b>Balance:</b> {{ balance.amount }} </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    name: 'Test',
    data() {
        return {
            accountId:"hid1307cjccpulp88cqu5tfnzl25ssv7csyqt7vwqm",
            exponent: 10000000, // 1 million
            balances:[
   
            ]  
        }
    },
    async created() {
        console.log('Inside accountDetails test page')
        const { accountId } = this.$route.params;
        if(!accountId){
            console.error('accountId is not passed')
            return;
        }
        this.accountId = accountId;
        await this.getTransactionDetailsbyHash()
    },
    methods: {
         async getTransactionDetailsbyHash(){
            const api  = `${this.$config.hid.HID_NODE_REST_EP}/cosmos/bank/v1beta1/balances/${this.accountId}`;
            const res =  await fetch(api)
            const json = await res.json();
            
            const { balances } = json;
            this.balances = balances
        },
    }

}
</script>