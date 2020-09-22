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
</style>
<template>
  <div class="home">
    
    <div class="col-md-3" style="font-size: small;color:grey;margin-left: 36%;">
      <form action="#" style="padding:6px">
        <b-card no-body style="padding: 40px">
          <h4>DID Registration</h4>
          <hr/>
          <div class="row">
            <form action="#" class="col-md-12" @submit.prevent="submit">
              <div class="form-group">
                <label class="floatLeft">Name:</label>
                <input type="text" class="form-control" v-model="fullName" placeholder="Enter name" required/>
              </div>
              <div class="form-group">
                <!-- <VueRecaptcha sitekey="sitekey" loadRecaptchaScript="true" @verify="onCaptchaVerified"/> -->
                <vue-recaptcha 
                  ref="recaptcha" 
                  size="invisible" 
                  :sitekey="$config.recaptchaSiteKey" 
                  :loadRecaptchaScript="true" 
                  @verify="onCaptchaVerified"
                  @expired="onCaptchaExpired"
                ></vue-recaptcha>
                <!-- <vue-recaptcha
                    ref="recaptcha"
                    @verify="onCaptchaVerified"
                    sitekey="6Lf4Hs4ZAAAAABWR5rRqj-QYSdJi7rAP5HsyrZkD">
                </vue-recaptcha>   -->
              </div>
              <div class="form-group">
                <button :disabled="status==='submitting'" type="submit"  class="btn btn-primary btn-sm">Register</button>
              </div>
            </form>
          </div>
          <!-- <div class="row">
            <div class="col-sm-3">
              <button
                type="button"
                data-toggle="modal"
                @click="signup()"
                class="btn btn-primary btn-sm"
              >Register</button>
            </div>
          </div> -->
        </b-card>
      </form>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import { getUserDoc, getCredential } from "lds-sdk";
import VueRecaptcha from 'vue-recaptcha';
const { sha256hashStr } = require("../utils/hash");
export default {
  name: "RegisterDid",
  components: {
    VueRecaptcha
  },
  data() {
    return {
      active: 0,
      fullName: "",
      email: "",
      telephone: "8323210123",
      publicKey: "",
      username: "t",
      password: "",
      birthdate: "",
      jobTitle: "",
      host: location.hostname,
      credentials: "",
      userData: "",
      prevRoute: null,
      status: ""
    };
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  methods: {
    submit: function () {
      // this.status = "submitting";
      this.$refs.recaptcha.execute();
    },
    onCaptchaExpired: function () {
      console.log('Captcha expired')
      this.$refs.recaptcha.reset();
    },
    onCaptchaVerified: function (recaptchaToken) {
      const self = this;
      self.status = "submitting";
      self.$refs.recaptcha.reset();
      this.signup(recaptchaToken)
    },
    forceFileDownload(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    downloadCredentials() {
      this.forceFileDownload(JSON.stringify(this.credentials), "keys.json");
    },
    signup(recaptchaToken) {
      try {
        console.log(recaptchaToken)
        if(this.fullName == " ") return alert('Alias is required!');
        const url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.DID_CREATE_EP}?name=${this.fullName}&rcToken=${recaptchaToken}`;
        fetch(url)
          .then((res) => res.json())
          .then((j) => {
            if (j && j.status == 500) {
              return alert(`Error:  ${j.error}`);
            }

            console.log(j.message)
            this.status = "";
            this.credentials = j.message.keys
            this.downloadCredentials()
            alert('Did has been successfully registered. Please keep your keys.json file safe. It contains your privatekey')
            this.$router.push("/");
          });
      } catch (e) {
        alert(e);
      }
    },
  },
};
</script>


