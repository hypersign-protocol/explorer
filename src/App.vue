<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}

.selectedButton{
  border-bottom: 1px solid #8080809e;
  font-weight: bold;
}

.nav-style{
  background: #FFFFFF;
  margin-bottom: 1%;
  padding:5px;
  padding-left:1.5%;
  text-align: left;
  box-shadow:
         rgba(0, 0, 0, 0.1) 0px 2px 2px 0px, 
            rgba(0, 0, 0, 0.02) 0px 3px 1px -2px, 
            rgba(0, 0, 0, 0.01) 0px 1px 5px 0px;
}

.rightAlign{
  text-align: end;
}

.card-radius{
  border-radius: 10px;
}


.logo-style {
    width: 144px;
    /* height: 40px; */
    margin-top: 9px;
    margin-left: 5px;
    float:left;
}

#app {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background: #F6F6F687;
}

.subtitle{
  padding-left: 10px;
  color: gray;
  font-size: larger;
  margin-top: auto;
  padding-top:10px;
  float:right;
}


</style>
<template>
  <div id="app">
    <div class="row nav-style">
      <div class="col-md-4">        
        <!-- <h5 class="leftAlign">{{$config.app.name}}</h5>  -->
        <div class="form-group form-inline">
          <a  href="/explorer/dashboard/" >
            <img class='logo-style' src="https://thumb.tildacdn.com/tild3065-3765-4865-b331-393637653931/-/resize/150x/-/format/webp/hypersign_Yellow.png"> 
            <h4 class="subtitle" > <span style="font-size:small;"> {{$config.app.name}} ({{$config.app.version}}) </span></h4>
          </a>
        </div>
      </div>
        <div class="col-md-8 rightAlign" style="padding-top:12px">
          <!-- <div > -->
            <button type="button" @click="goToNextPage(m.name)" class="btn btn-light btn-sm" v-for="m in menu" :key="m.name">{{m.name}}</button>    
          <!-- </div> -->
        </div>
    </div>
    <router-view />
    <notifications group="foo" />
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      menu: [
        { 
          name: "Dashboard",  
          path: "/",
          isShow: true,
        },
        { 
          name: "Blocks",  
          path: "/explorer/blocks",
          isShow: true,
        },
        { 
          name: "Transactions",  
          path: "/explorer/transactions",
          isShow: true,
        },
        { 
          name: "Validators",  
          path: "/explorer/validators",
          isShow: true,
        },
        { 
          name: "DIDs",  
          path: "/explorer/dids",
          isShow: true,
        },
        { 
          name: "Wallet",  
          path: "https://wallet.hypermine.in/",
          isShow: true,
        }
      ],
      latestBlockHeight: 0,
      connection: null,
      newTxEventArrived: ""
    }
  },
   async created(){
        this.connection = new WebSocket(`${this.$config.hid.HID_NODE_SOCKET_EP}`);
        const that =  this;
        this.connection.onopen = function() {
            console.log("Socket connection is open");

            const blockHeader = {
                jsonrpc: '2.0',
                method: 'subscribe',
                id: 0,
                params: {
                    query: 'tm.event=\'NewBlock\'',
                },
            };
            console.log("Subscribing to NewBlock Event");
            that.connection.send(JSON.stringify(blockHeader));


            const txHeader = {
                jsonrpc: '2.0',
                method: 'subscribe',
                id: 0,
                params: {
                    query: 'tm.event=\'Tx\'',
                },
            };
            console.log("Subscribing to Tx event");
            that.connection.send(JSON.stringify(txHeader));

            const valHeader = {
                jsonrpc: '2.0',
                method: 'subscribe',
                id: 0,
                params: {
                    query: 'tm.event=\'ValidatorSetUpdates\'',
                },
            };
            console.log("Subscribing to ValidatorSetUpdates event");
            that.connection.send(JSON.stringify(valHeader));
        };

        this.connection.onmessage = function({ data }) {
            
            const parseData = JSON.parse(data);
            const { result } = parseData;
            const { query } = result;
            
            switch (query) {
                case 'tm.event=\'NewBlock\'':
                    that.$store.commit("updateBlockHeightInStore", result.data.value.block.header.height);
                    break;
                case 'tm.event=\'ValidatorSetUpdates\'':
                    // console.log('ValidatorSetUpdates event arrived')
                    // console.log(data, undefined, 2)
                    //that.$store.commit("updatetxCreateDIDEventTriggerInStore");
                    break;
                case 'tm.event=\'Tx\'':
                  const msg_action_type = result.events['message.action'] ? result.events['message.action'][0] : null;
                  // console.log('xxxxxxxxxxxxxxxxxxxx Tx Event Arrived xxxxxxxxxxxxxxxxx')
                  // console.log(JSON.stringify(result, undefined, 2))
                  if(msg_action_type){
                     switch(msg_action_type){
                        case 'create_did': 
                            // console.log('xxxxxxxxxxxxxxxxxxxx Create Tx Event Arrived xxxxxxxxxxxxxxxxx')
                            that.$store.commit("updatetxCreateDIDEventTriggerInStore", result.events['tx.hash'][0]);
                            break;

                        case 'update_did':
                            break;
                        default: 
                            break;
                    }
                  }
                  that.$store.commit("updateTxEventTriggerInStore", result.events['tx.hash'][0]);
                  break;
        
                default:
                    break;
            }
            
            
        };
        this.connection.onerror = function(error) {
            console.log("Websocket connection error ", error);
        };
  },
  methods: {
    goToNextPage(route){
      const r = this.menu.find(x => x.name === route)
      if(r.name === "Wallet") {
        return window.open(
          r.path,
          '_blank' // <- This is what makes it open in a new window.
        );
      }
      this.$router.push(r.path)
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push(r.path)
                }
    }
  }
}
</script>





<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.centeralign {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
