<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h4>Top 50 Credential Status</h4>

        <modal :show="showModal" @close="showModal = false" :data='data' :header='header'></modal>
        <div class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;margin-top:3%">
            <div class="col-md-12">
                <table class="table table-striped table-bordered table-sm">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Issuer</th>
                            <th>Hash</th>
                            <th>Current Status</th>
                            <th>Status Reason</th>
                            <th>Issuance Date</th>
                            <th>Expiration Date</th>
                            <th>Proof</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="credeStatus in credStatusList">
                            <td>{{credeStatus.claim.id}}</td>

                            <td>{{ credeStatus.issuer}}</td>
                            <td>{{ credeStatus.credentialHash}}</td>
                            <td>{{ credeStatus.claim.currentStatus}}</td>
                            <td>{{ credeStatus.claim.statusReason}}</td>
                            <td>{{ credeStatus.issuanceDate}}</td>
                            <td>{{ credeStatus.expirationDate}}</td>
                            <td><a href="#"
                                    @click="resolve(credeStatus.claim.id, JSON.stringify(credeStatus.proof, undefined, 2))">View</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
import Modal from '../components/Modal.vue'
export default {
    name: 'credStatusList',
    components: {
        Modal
    },
    data() {
        return {
            credStatusList: [],
            latestBlockHeight: "2000",
            showModal: false,
            data: "",
            header: ""
        }
    }, 
    async created(){
        await this.getTopTransactions();
    },
    methods: {
        formattedSchemaId(schemaId){
            if(!schemaId) return ""
            const id = schemaId.split(';')[1]
            return id.substr(3);
        },
        async getTopTransactions(){
            const schemaLstAPI = `${this.$config.hid.HID_NODE_REST_EP}/hypersign-protocol/hidnode/ssi/credential?count=false&pagination.limit=50&pagination.countTotal=true&pagination.reverse=true`;
            const res =  await fetch(schemaLstAPI)
            const json = await res.json();
        
            const { credentials } = json;
            this.credStatusList = credentials;
        },
        resolve(did, didDocStr){
            this.data  = didDocStr;
            this.showModal = true;
            this.header = "Credenial Status Proof Of " + did 
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