<style scoped>

.body{
    margin-left: auto;  margin-right: auto;   width: 1300px;
}
</style>
<template>
    <div class="body">
        <div class="row">
            <div class="col-md-12">
                <h3> Transactions Details </h3>
            </div>
        </div>
        
        <div class="row" v-if="this.txDetails != null" style="text-align: left;">
            <div class="col-md-12">
                <ul class="list-group">
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col-md-8">
                                <b>Hash:</b> <a :href='`/explorer/txdetails?hash=${this.txHash}`'>{{ this.txHash }}</a>
                            </div>
                            <div class="col-md-4">
                                <span v-if="this.txDetails.status==='FAIL'" style="float:right">
                                    <span class="badge badge-danger">{{this.txDetails.status}}</span>
                                </span>
                                <span v-if="this.txDetails.status==='SUCCESS'" style="float:right">
                                    <span class="badge badge-success">{{this.txDetails.status}}</span>
                                </span>
                            </div>
                        </div>
                    </li>
                    <!-- <li class="list-group-item">
                        <b>Root Hash:</b> <a :href='`/explorer/txdetails?hash=0x${this.txProof.root_hash}`'> 0x{{ this.txProof.root_hash }}</a>
                    </li> -->
                    <li class="list-group-item">
                        <b>Height:</b><a :href='`/explorer/blockdetails?height=${this.blockHeight}`'> {{ this.blockHeight }}</a>
                    </li>
                    <li class="list-group-item">
                        <b>Gas Wanted:</b> {{ this.txDetails.gas_wanted }}
                    </li>
                    <li class="list-group-item">
                        <b>Gas Used:</b> {{ this.txDetails.gas_used }}
                    </li>
                    <li class="list-group-item" >
                        <b>Type:</b>
                        <span  v-html="getType(this.txDetails.tevents.message[0].value)"></span>
                    </li>
                    <li class="list-group-item" v-if="this.txDetails.tevents.type==='bank'">
                        <b>From:</b> <span class="badge badge-warning">{{ this.computedTransfer.sender }}</span>
                    </li>
                    <li class="list-group-item" v-if="this.txDetails.tevents.type==='bank'">
                        <b>To:</b> <span class="badge badge-warning">{{   this.computedTransfer.recipient }}</span>
                    </li>
                    <li class="list-group-item" v-if="this.txDetails.tevents.type==='bank'">
                        <b>Amount:</b> <span class="badge badge-warning">{{  this.computedTransfer.amount  }}</span>
                    </li>
                    <li class="list-group-item">
                        <b>Signature:</b> {{  this.computedSignature }}
                    </li>
                    <li class="list-group-item" style="word-wrap: break-word;">
                        <b>Log:</b> {{ this.txDetails.log }}
                    </li>
                     <li class="list-group-item" style="word-wrap: break-word;">
                        <b>Blob:</b> {{ this.txData }}
                    </li>
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
            txHash: "",
            txDetails: {
                tevents: {
                },
                log: "",
                status: "FAIL",
                gas_wanted: "",
                gas_used: "",
                signature:"",
                type: "",
            },
            txData: "",
            blockHeight: "",
            txProof: "",
            transfer: {},
            badges: {
                staking: "info",
                bank: "primary",
                create_did: "dark",
                update_did: "dark"
            }
        }
    },
    computed: {
        computedTransfer: function(){
            console.log('computed got called')
            if(this.txDetails.tevents.transfer){
                this.txDetails.tevents.transfer.forEach(x => {
                    this.transfer[x.key] = x.value
                })
            }
            return this.transfer
        },
        computedSignature: function(){
            if(this.txDetails.tevents.tx ){
                this.txDetails.signature = this.txDetails.tevents.tx.find(x => x.key == 'signature').value
           }
            return this.txDetails.signature
        },
    },
    async created() {
        console.log('Inside TxDetails test page')
        const { hash } = this.$route.query;
        if(!hash){
            console.error('Block hash or block height must be passed int he query')
            return;
        }
        this.txHash = hash? hash: ""
        this.getTransactionDetailsbyHash()
    },
    methods: {
        getType(type){
            this.txDetails.tevents.type = type;
            let html = "";
            if(this.badges[type]){
                html = `<span class='badge badge-pill badge-${this.badges[type]}'>${type}</span>`

            }else{
                html = `<span class='badge badge-pill badge-secondary'>${type}</span>`
            }
            return html
        },
         async getTransactionDetailsbyHash(){
            const api  = `${this.$config.hid.HID_NODE_RPC_EP}/tx?hash=${this.txHash}&prove=true`;
            const res =  await fetch(api)
            const json = await res.json();
            
            const { result, error } = json;
            if(error){
                throw new Error(error)
            }
            
            ////// Tests
            //// Token transffer
            // const res1 = {"hash":"E599F2013150C14A42BC403EEFE6154ED2EFEE884332663E01E9EAF03CEB448D","height":"463","index":0,"tx_result":{"code":0,"data":"Ch4KHC9jb3Ntb3MuYmFuay52MWJldGExLk1zZ1NlbmQ=","log":"[{\"events\":[{\"type\":\"coin_received\",\"attributes\":[{\"key\":\"receiver\",\"value\":\"hid18afarjm3v0nas29gz00at9y2m6cuxutxnwqadk\"},{\"key\":\"amount\",\"value\":\"1000uhid\"}]},{\"type\":\"coin_spent\",\"attributes\":[{\"key\":\"spender\",\"value\":\"hid1dxym8fj4mkeqmp0423cjrvnds36cxx2z5uvlkl\"},{\"key\":\"amount\",\"value\":\"1000uhid\"}]},{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmos.bank.v1beta1.MsgSend\"},{\"key\":\"sender\",\"value\":\"hid1dxym8fj4mkeqmp0423cjrvnds36cxx2z5uvlkl\"},{\"key\":\"module\",\"value\":\"bank\"}]},{\"type\":\"transfer\",\"attributes\":[{\"key\":\"recipient\",\"value\":\"hid18afarjm3v0nas29gz00at9y2m6cuxutxnwqadk\"},{\"key\":\"sender\",\"value\":\"hid1dxym8fj4mkeqmp0423cjrvnds36cxx2z5uvlkl\"},{\"key\":\"amount\",\"value\":\"1000uhid\"}]}]}]","info":"","gas_wanted":"200000","gas_used":"49750","events":[{"type":"tx","attributes":[{"key":"ZmVl","value":null,"index":true}]},{"type":"tx","attributes":[{"key":"YWNjX3NlcQ==","value":"aGlkMWR4eW04Zmo0bWtlcW1wMDQyM2NqcnZuZHMzNmN4eDJ6NXV2bGtsLzE=","index":true}]},{"type":"tx","attributes":[{"key":"c2lnbmF0dXJl","value":"d1UyWHFFeEx5OWNDd3FIQ25oUDdUYjJMRVJkak9qb1RkMWtKYlJ3Z1JhUnU3anV3VURmbXNaWDdOSWFOc1hmeHNlOHZQaU9WRnFIdXlvQkxkU294ckE9PQ==","index":true}]},{"type":"message","attributes":[{"key":"YWN0aW9u","value":"L2Nvc21vcy5iYW5rLnYxYmV0YTEuTXNnU2VuZA==","index":true}]},{"type":"coin_spent","attributes":[{"key":"c3BlbmRlcg==","value":"aGlkMWR4eW04Zmo0bWtlcW1wMDQyM2NqcnZuZHMzNmN4eDJ6NXV2bGts","index":true},{"key":"YW1vdW50","value":"MTAwMHVoaWQ=","index":true}]},{"type":"coin_received","attributes":[{"key":"cmVjZWl2ZXI=","value":"aGlkMThhZmFyam0zdjBuYXMyOWd6MDBhdDl5Mm02Y3V4dXR4bndxYWRr","index":true},{"key":"YW1vdW50","value":"MTAwMHVoaWQ=","index":true}]},{"type":"transfer","attributes":[{"key":"cmVjaXBpZW50","value":"aGlkMThhZmFyam0zdjBuYXMyOWd6MDBhdDl5Mm02Y3V4dXR4bndxYWRr","index":true},{"key":"c2VuZGVy","value":"aGlkMWR4eW04Zmo0bWtlcW1wMDQyM2NqcnZuZHMzNmN4eDJ6NXV2bGts","index":true},{"key":"YW1vdW50","value":"MTAwMHVoaWQ=","index":true}]},{"type":"message","attributes":[{"key":"c2VuZGVy","value":"aGlkMWR4eW04Zmo0bWtlcW1wMDQyM2NqcnZuZHMzNmN4eDJ6NXV2bGts","index":true}]},{"type":"message","attributes":[{"key":"bW9kdWxl","value":"YmFuaw==","index":true}]}],"codespace":""},"tx":"CokBCoYBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmYKKmhpZDFkeHltOGZqNG1rZXFtcDA0MjNjanJ2bmRzMzZjeHgyejV1dmxrbBIqaGlkMThhZmFyam0zdjBuYXMyOWd6MDBhdDl5Mm02Y3V4dXR4bndxYWRrGgwKBHVoaWQSBDEwMDASWApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohA9P6nDfgop2f4H5z+lnF8UY3neKSxjzanCqqVJXUaOTcEgQKAggBGAESBBDAmgwaQMFNl6hMS8vXAsKhwp4T+029ixEXYzo6E3dZCW0cIEWkbu47sFA35rGV+zSGjbF38bHvLz4jlRah7sqAS3UqMaw=","proof":{"root_hash":"BC449AC199A01ED9F6F27C6D187B8D8120E91FBF0F57B6550658885C0170B421","data":"CokBCoYBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmYKKmhpZDFkeHltOGZqNG1rZXFtcDA0MjNjanJ2bmRzMzZjeHgyejV1dmxrbBIqaGlkMThhZmFyam0zdjBuYXMyOWd6MDBhdDl5Mm02Y3V4dXR4bndxYWRrGgwKBHVoaWQSBDEwMDASWApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohA9P6nDfgop2f4H5z+lnF8UY3neKSxjzanCqqVJXUaOTcEgQKAggBGAESBBDAmgwaQMFNl6hMS8vXAsKhwp4T+029ixEXYzo6E3dZCW0cIEWkbu47sFA35rGV+zSGjbF38bHvLz4jlRah7sqAS3UqMaw=","proof":{"total":"1","index":"0","leaf_hash":"vESawZmgHtn28nxtGHuNgSDpH78PV7ZVBliIXAFwtCE=","aunts":[]}}}
            
            //// create_did
            // const res1 = {"hash":"6EAEB52A3235D2DADEE5E7C264151648D5734E42A2AD3DA00D8DE075989B4893","height":"719","index":0,"tx_result":{"code":0,"data":"Ci0KKy9oeXBlcnNpZ25wcm90b2NvbC5oaWRub2RlLnNzaS5Nc2dDcmVhdGVESUQ=","log":"[{\"events\":[{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"create_did\"}]}]}]","info":"","gas_wanted":"200000","gas_used":"68906","events":[{"type":"tx","attributes":[{"key":"ZmVl","value":null,"index":true}]},{"type":"tx","attributes":[{"key":"YWNjX3NlcQ==","value":"aGlkMWR4eW04Zmo0bWtlcW1wMDQyM2NqcnZuZHMzNmN4eDJ6NXV2bGtsLzM=","index":true}]},{"type":"tx","attributes":[{"key":"c2lnbmF0dXJl","value":"MDlJN2krTWtwMjBuUW9qdlc4a2oyVEY0anZ3RlJNeEdNK3VmQVFqUDlacGh4MFlNei9aUWRFeW1FMDJIRFNQU0xsOUJnbmdVWDZYc0N4aUhFRGVUU1E9PQ==","index":true}]},{"type":"message","attributes":[{"key":"YWN0aW9u","value":"Y3JlYXRlX2RpZA==","index":true}]}],"codespace":""},"tx":"CpMGCpAGCisvaHlwZXJzaWducHJvdG9jb2wuaGlkbm9kZS5zc2kuTXNnQ3JlYXRlRElEEuAFCvkDChxodHRwczovL3d3dy53My5vcmcvbnMvZGlkL3YxChxodHRwczovL3czaWQub3JnL3NlY3VyaXR5L3YxChJodHRwczovL3NjaGVtYS5vcmcSK2RpZDpoczowZjQ5MzQxYS0yMGVmLTQzZDEtYmM5My1kZTMwOTkzZTZjNTIaK2RpZDpoczowZjQ5MzQxYS0yMGVmLTQzZDEtYmM5My1kZTMwOTkzZTZjNTIiHGRpZDpoczoxZjQ5MzQxYS1kZTMwOTkzZTZjNTIq0wEKWWRpZDpoczowZjQ5MzQxYS0yMGVmLTQzZDEtYmM5My1kZTMwOTkzZTZjNTIjejhCWGcyemp3QlJUcmpQczd1Q25rRkJLckw5YlBEMTRIeEVKTUVOeG0zQ0o0EhpFZDI1NTE5VmVyaWZpY2F0aW9uS2V5MjAyMBorZGlkOmhzOjBmNDkzNDFhLTIwZWYtNDNkMS1iYzkzLWRlMzA5OTNlNmM1MiItejhCWGcyemp3QlJUcmpQczd1Q25rRkJLckw5YlBEMTRIeEVKTUVOeG0zQ0o0MllkaWQ6aHM6MGY0OTM0MWEtMjBlZi00M2QxLWJjOTMtZGUzMDk5M2U2YzUyI3o4QlhnMnpqd0JSVHJqUHM3dUNua0ZCS3JMOWJQRDE0SHhFSk1FTnhtM0NKNBK1AQpZZGlkOmhzOjBmNDkzNDFhLTIwZWYtNDNkMS1iYzkzLWRlMzA5OTNlNmM1MiN6OEJYZzJ6andCUlRyalBzN3VDbmtGQktyTDliUEQxNEh4RUpNRU54bTNDSjQSWEdxSHJYdC9NWHNUQ0hvMEpDbHo0R09ESkNCR29NZmI4Tm1yWndkQkp1YmJwamhscWlVVjVIME14VUlGaTRpelY4dEFhaDh1OFZTYlBNTHY3M1JWb0NnPT0aKmhpZDFkeHltOGZqNG1rZXFtcDA0MjNjanJ2bmRzMzZjeHgyejV1dmxrbBJYClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiED0/qcN+CinZ/gfnP6WcXxRjed4pLGPNqcKqpUldRo5NwSBAoCCAEYAxIEEMCaDBpA09I7i+Mkp20nQojvW8kj2TF4jvwFRMxGM+ufAQjP9Zphx0YMz/ZQdEymE02HDSPSLl9BgngUX6XsCxiHEDeTSQ==","proof":{"root_hash":"D16057FB5AC003A9BFDD3D8E5F9A45C93C8DBBA8BB996D019A6765F9C5636B39","data":"CpMGCpAGCisvaHlwZXJzaWducHJvdG9jb2wuaGlkbm9kZS5zc2kuTXNnQ3JlYXRlRElEEuAFCvkDChxodHRwczovL3d3dy53My5vcmcvbnMvZGlkL3YxChxodHRwczovL3czaWQub3JnL3NlY3VyaXR5L3YxChJodHRwczovL3NjaGVtYS5vcmcSK2RpZDpoczowZjQ5MzQxYS0yMGVmLTQzZDEtYmM5My1kZTMwOTkzZTZjNTIaK2RpZDpoczowZjQ5MzQxYS0yMGVmLTQzZDEtYmM5My1kZTMwOTkzZTZjNTIiHGRpZDpoczoxZjQ5MzQxYS1kZTMwOTkzZTZjNTIq0wEKWWRpZDpoczowZjQ5MzQxYS0yMGVmLTQzZDEtYmM5My1kZTMwOTkzZTZjNTIjejhCWGcyemp3QlJUcmpQczd1Q25rRkJLckw5YlBEMTRIeEVKTUVOeG0zQ0o0EhpFZDI1NTE5VmVyaWZpY2F0aW9uS2V5MjAyMBorZGlkOmhzOjBmNDkzNDFhLTIwZWYtNDNkMS1iYzkzLWRlMzA5OTNlNmM1MiItejhCWGcyemp3QlJUcmpQczd1Q25rRkJLckw5YlBEMTRIeEVKTUVOeG0zQ0o0MllkaWQ6aHM6MGY0OTM0MWEtMjBlZi00M2QxLWJjOTMtZGUzMDk5M2U2YzUyI3o4QlhnMnpqd0JSVHJqUHM3dUNua0ZCS3JMOWJQRDE0SHhFSk1FTnhtM0NKNBK1AQpZZGlkOmhzOjBmNDkzNDFhLTIwZWYtNDNkMS1iYzkzLWRlMzA5OTNlNmM1MiN6OEJYZzJ6andCUlRyalBzN3VDbmtGQktyTDliUEQxNEh4RUpNRU54bTNDSjQSWEdxSHJYdC9NWHNUQ0hvMEpDbHo0R09ESkNCR29NZmI4Tm1yWndkQkp1YmJwamhscWlVVjVIME14VUlGaTRpelY4dEFhaDh1OFZTYlBNTHY3M1JWb0NnPT0aKmhpZDFkeHltOGZqNG1rZXFtcDA0MjNjanJ2bmRzMzZjeHgyejV1dmxrbBJYClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiED0/qcN+CinZ/gfnP6WcXxRjed4pLGPNqcKqpUldRo5NwSBAoCCAEYAxIEEMCaDBpA09I7i+Mkp20nQojvW8kj2TF4jvwFRMxGM+ufAQjP9Zphx0YMz/ZQdEymE02HDSPSLl9BgngUX6XsCxiHEDeTSQ==","proof":{"total":"1","index":"0","leaf_hash":"0WBX+1rAA6m/3T2OX5pFyTyNu6i7mW0Bmmdl+cVjazk=","aunts":[]}}}
            
            //// failed case
            // const res1 = {"hash":"E1BDA44BC6D0293D28AC34AAF1F2AC5D4C4B4FD4732A9FEA2AC90F0C26957E0C","height":"500","index":0,"tx_result":{"code":5,"data":null,"log":"failed to execute message; message index: 0: 0somthing is smaller than 1000somthing: insufficient funds","info":"","gas_wanted":"200000","gas_used":"42686","events":[{"type":"tx","attributes":[{"key":"ZmVl","value":null,"index":false}]},{"type":"tx","attributes":[{"key":"YWNjX3NlcQ==","value":"aGlkMWR4eW04Zmo0bWtlcW1wMDQyM2NqcnZuZHMzNmN4eDJ6NXV2bGtsLzI=","index":false}]},{"type":"tx","attributes":[{"key":"c2lnbmF0dXJl","value":"TDh0RlN4K2ZTUjFrWWhtYVhSZy95bk9lMnY3UDdYbEZLWnlKUms5em1iTXc3Z2xGak1XMU1NbzNzd0FDN00yNzlxOUthRmFFeUo4ZllmbzRib3doQmc9PQ==","index":false}]}],"codespace":"sdk"},"tx":"Co0BCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKKmhpZDFkeHltOGZqNG1rZXFtcDA0MjNjanJ2bmRzMzZjeHgyejV1dmxrbBIqaGlkMThhZmFyam0zdjBuYXMyOWd6MDBhdDl5Mm02Y3V4dXR4bndxYWRrGhAKCHNvbXRoaW5nEgQxMDAwElgKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQPT+pw34KKdn+B+c/pZxfFGN53iksY82pwqqlSV1Gjk3BIECgIIARgCEgQQwJoMGkAvy0VLH59JHWRiGZpdGD/Kc57a/s/teUUpnIlGT3OZszDuCUWMxbUwyjezAALszbv2r0poVoTInx9h+jhujCEG","proof":{"root_hash":"1FA3E8B359F416BB5CC19B44EBC6E653E6EF220BBC8130C57C205EE13091B478","data":"Co0BCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKKmhpZDFkeHltOGZqNG1rZXFtcDA0MjNjanJ2bmRzMzZjeHgyejV1dmxrbBIqaGlkMThhZmFyam0zdjBuYXMyOWd6MDBhdDl5Mm02Y3V4dXR4bndxYWRrGhAKCHNvbXRoaW5nEgQxMDAwElgKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQPT+pw34KKdn+B+c/pZxfFGN53iksY82pwqqlSV1Gjk3BIECgIIARgCEgQQwJoMGkAvy0VLH59JHWRiGZpdGD/Kc57a/s/teUUpnIlGT3OZszDuCUWMxbUwyjezAALszbv2r0poVoTInx9h+jhujCEG","proof":{"total":"1","index":"0","leaf_hash":"H6Pos1n0FrtcwZtE68bmU+bvIgu8gTDFfCBe4TCRtHg=","aunts":[]}}}
            // const {  tx_result, height, tx, proof  } = res1;


            const {  tx_result, height, tx, proof  } = result;
            tx_result['tevents'] = {};
            tx_result.events.forEach(x => {
                return tx_result['tevents'][x.type] = x.attributes.map(x => {
                    x.key = atob(x.key)
                    x.value = atob(x.value)
                    return x    
                })
            })
            
            
            Object.assign(this.txDetails, {...tx_result})
            this.txDetails.status = tx_result.code === 0 ? "SUCCESS": "FAIL";

            this.blockHeight = height
            this.txData = tx
            this.txProof = proof
        },
    }

}
</script>