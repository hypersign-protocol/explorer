<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}

</style>

<template>
    <div class="body">
        <h4>Top 50 Schemas</h4>

        <modal :show="showModal" @close="showModal = false" :data='data' :header='header'></modal>
        <div class="row" style="max-height: 500px; overflow-x: hidden; overflow-y: auto;margin-top:3%">
            <div class="col-md-12">
                <table class="table table-striped table-bordered table-sm">
                    <thead>
                        <tr>
                            <th>SchemaId</th>
                            <th>Name</th>
                            <th>Model Version</th>
                            <th>Description</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="schema in schemaList">
                            <td><a href="#" @click="resolve(schema.id, JSON.stringify(schema.schema, undefined, 2))">{{
                                    formattedSchemaId(schema.id) }}</a>
                            </td>
                            <td>{{ schema.name}}</td>

                            <td>{{ schema.modelVersion}}</td>
                            <td>{{ schema.schema.description}}</td>

                            <td>{{ schema.author}}</td>

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
    name: 'schemaList',
    components: {
        Modal
    },
    data() {
        return {
            schemaList: [],
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
            const schemaLstAPI = `${this.$config.hid.HID_NODE_REST_EP}/hypersign-protocol/hidnode/ssi/schema?count=false&pagination.limit=50&pagination.countTotal=true&pagination.reverse=true`;
            const res =  await fetch(schemaLstAPI)
            const json = await res.json();
        
            const { schemaList } = json;
            this.schemaList = schemaList;
        },
        resolve(did, didDocStr){
            this.data  = didDocStr;
            this.showModal = true;
            this.header = "Schema (" + did + ")"
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