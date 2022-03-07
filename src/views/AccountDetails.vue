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
            <div class="col-md-12" v-if="balances.length > 0">
                <ul class="list-group">
                    <li class="list-group-item"><b>Address :</b>{{ accountId }} </li>
                    <li class="list-group-item"><b>Tokens :</b> {{ balances[0].denom.substr(1).toUpperCase() }} </li>
                    <li class="list-group-item"><b>Balance:</b> {{ balances[0].amount / exponent  }} </li>
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
            balances: [
    {
      "denom": "uhid",
      "amount": "6850"
    }
  ]    
        }
    },
    async created() {
        console.log('Inside accountDetails test page')
        const { accountId } = this.$route.params;
        console.log(accountId)
        if(!accountId){
            console.error('accountId is not passed')
            return;
        }
        this.accountId = accountId;
        this.getTransactionDetailsbyHash()
    },
    methods: {
         async getTransactionDetailsbyHash(){
            const api  = `${this.$config.hid.HID_NODE_REST_EP}/cosmos/bank/v1beta1/balances/${this.accountId}`;
            const res =  await fetch(api)
            const json = await res.json();
            
            const { balances } = json;
            if(error){
                throw new Error(error)
            }
            this.balances = balances
        },
    }

}
</script>