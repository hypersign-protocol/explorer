<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h4>Top 50 Decentralised Identifiers (DIDs)</h4>

        <modal :show="showModal" @close="showModal = false" :data='data' :header='header'></modal>
        <div class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;margin-top:3%">
            <div class="col-md-12">
                <table class="table table-striped table-bordered table-sm">
                    <thead>
                    <tr>
                        <th>DID</th>
                        <th>VersionId</th>
                        <th>CreatedAt</th>
                        <th>UpdatedAt</th>
                        <th>Deactivated?</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="did in didList">
                        <td><a href="#" @click="resolve(did.didDocument.id,JSON.stringify(did.didDocument, undefined, 2))">{{shorten(did.didDocument.id)}}</a></td>
                        <td>{{did.didDocumentMetadata.versionId}}</td>
                        <td>{{did.didDocumentMetadata.created}}</td>
                        <td>{{did.didDocumentMetadata.updated}}</td>
                        <td>{{did.didDocumentMetadata.deactivated}}</td>

                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- <div class="row">
            <div class="col-md-12">
                <a :href='`/transactions?nextBlockHeight=${parseInt(latestBlockHeight) - 50}`'> Previous </a> |
                <a :href='`/transactions?nextBlockHeight=${parseInt(latestBlockHeight) + 50}`'> Next </a> 
            </div>
        </div> -->
    </div>

    
</template>


<script>
import Modal from '../components/Modal.vue'
export default {
    name: 'didList',
    components: {
        Modal
    },
    data() {
        return {
            didList: [],
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
        async getTopTransactions(){
            const didListAPI = `${this.$config.hid.HID_NODE_REST_EP}/hypersign-protocol/hidnode/ssi/did?count=false&pagination.limit=50&pagination.countTotal=true&pagination.reverse=true`;
            const res =  await fetch(didListAPI)
            const json = await res.json();
        
            const { didDocList } = json;
            this.didList = didDocList;
        },
        resolve(did, didDocStr){
            this.data  = didDocStr;
            this.showModal = true;
            this.header = "DID Document(" + did + ")"
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