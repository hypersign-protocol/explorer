<style scoped>
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}
.floatLeft {
  float: left;
}
.floatRight {
  float: right;
}
.marginLeft
{
margin-left: 13%
}
.marginRight
{
margin-right: 12%
}
</style>
<template>
  <!-- <div class="home"> -->
  <div class="row">
    <div class="col-md-9 marginRight marginLeft">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-3">
              <button
                type="button"
                data-toggle="modal"
                @click="getList('DID')"
                class="btn btn-link floatLeft"
              >Did</button>
              <button
                type="button"
                data-toggle="modal"
                @click="getList('SCHEMA')"
                class="btn btn-link floatLeft"
                style="margin-left: 2px"
              >Schema</button>
            </div>
            <div class="col-md-6">
              <form class="form-inline" >
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter did or schemaId to search"
                    size="70"
                  />
                </div>
              </form>
            </div>
            <div class="col-md-3">
              <div class="form-group">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12" style="padding: 10px">
          <div class="row">
            <div class="col-md-12" id="didTable" v-if="showDid">
              <table class="table table-bordered" style="background:#FFF">
                <thead>
                  <tr>
                    <th>DID</th>
                    <th>Alias</th>
                    <th>DID Document</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in didList" :key="row">
                    <td><a :href="`${$config.nodeServer.BASE_URL}${$config.nodeServer.DID_RESOLVE_EP}`+row.did" target="_blank">{{row.did}}</a></td>
                    <td>{{row.name}}</td>
                    <td
                      style="word-wrap: break-word;min-width: 700px;max-width: 700px;"
                    >{{row.didDoc}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-12" id="schemaTable" v-if="showSchema">
              <table class="table table-bordered" style="background:#FFF">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>credentialName</th>
                    <th>attributes</th>
                    <th>version</th>
                    <th>owner</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="row in schemaList" :key="row">
                    <th scope="row"><a :href="`${$config.nodeServer.BASE_URL}${$config.nodeServer.SCHEMA_GET_EP}`+row.id" target="_blank">{{row.id}}</a></th>
                    <td>{{row.credentialName}}</td>
                    <td>{{row.attributes}}</td>
                    <td>{{row.version}}</td>
                    <td>{{row.owner}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { getChallange } from "lds-sdk";
import QrcodeVue from "qrcode.vue";
import { sign } from "lds-sdk";
const { sha256hashStr } = require("../utils/hash");
export default {
  name: "Home",
  components: {
    QrcodeVue,
  },
  data() {
    return {
      active: 0,
      username: "",
      password: "",
      host: location.hostname,
      challenge: "dddd",
      domain: location.host,
      QRCodeValue: this.$route.query,
      credentials: {},
      userData: {},
      proof: "",
      didList: [],
      schemaList: [],
      showDid: true,
      showSchema: false,
    };
  },
  created() {
    this.getList("DID");
  },
  mounted() {},
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    async getList(type) {
      let url = "";
      if (type === "DID") {
        url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.DID_LIST_EP}`;
      } else {
        url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.SCHEMA_LIST_EP}`;
      }

      const resp = await fetch(url);
      const j = await resp.json();
      if (j && j.status == 500) {
        return alert(`Error:  ${j.error}`);
      }

      if (type == "DID") {
        this.didList = j.message;
        this.showDid = true;
        this.showSchema = false;
      } else {
        this.schemaList = j.message;
        this.showDid = false;
        this.showSchema = true;
      }
    }
  },
};
</script>
