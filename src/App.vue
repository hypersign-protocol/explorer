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
          <a  href="/" >
            <img class='logo-style' src="https://hypermine.in/hypersign/wp-content/uploads/2020/01/Banner_logo2.png"> 
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
          path: "/blocks",
          isShow: true,
        },
        { 
          name: "Transactions",  
          path: "/transactions",
          isShow: true,
        },
        { 
          name: "DIDs",  
          path: "/dids",
          isShow: true,
        }
      ]
    }
  },
  methods: {
    goToNextPage(route){
      const r = this.menu.find(x => x.name === route)
      if(r.name === "Studio") {
        window.location.href = this.$config.studio.BASE_URL + "login"
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


